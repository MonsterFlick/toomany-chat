// Account / Session API — supports both manual token and stored session
import { NextResponse } from 'next/server';
import { getSession, getDemoAccount, setSession } from '@/lib/store';
import { getUserProfile, getInstagramAccountId } from '@/lib/instagram';

export async function GET() {
    const session = getSession();
    if (session) {
        return NextResponse.json({
            isConnected: true,
            account: session.profile,
            connectedAt: session.connectedAt,
        });
    }
    return NextResponse.json({
        isConnected: false,
        account: getDemoAccount(),
        isDemo: true,
    });
}

// POST — connect using a manually provided access token
export async function POST(request) {
    try {
        const { accessToken } = await request.json();
        if (!accessToken) {
            return NextResponse.json({ error: 'Access token required' }, { status: 400 });
        }

        // Get Instagram account linked to this token
        const { igAccountId, pageId, pageToken } = await getInstagramAccountId(accessToken);

        if (!igAccountId) {
            return NextResponse.json({
                error: 'No Instagram Business/Creator account found linked to this token. Make sure your Instagram is connected to a Facebook Page.'
            }, { status: 400 });
        }

        // Get profile info
        const profile = await getUserProfile(igAccountId, accessToken);

        // Store session
        setSession({
            accessToken,
            igAccountId,
            pageId,
            pageToken,
            profile,
            connectedAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, profile });
    } catch (err) {
        const msg = err?.response?.data?.error?.message || err?.message || 'Failed to connect';
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}

// DELETE — disconnect / logout
export async function DELETE() {
    const { setSession } = await import('@/lib/store');
    setSession(null);
    return NextResponse.json({ success: true });
}
