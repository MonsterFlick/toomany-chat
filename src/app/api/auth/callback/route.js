// Instagram OAuth Callback
import { NextResponse } from 'next/server';
import { exchangeCodeForToken, getLongLivedToken, getInstagramAccountId, getUserProfile } from '@/lib/instagram';
import { setSession } from '@/lib/store';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=auth_failed`);
    }

    try {
        // Exchange code for token
        const tokenData = await exchangeCodeForToken(code);

        // Get long-lived token
        const longLivedToken = await getLongLivedToken(tokenData.access_token);

        // Get Instagram account ID
        const { igAccountId, pageId, pageToken } = await getInstagramAccountId(longLivedToken.access_token);

        if (!igAccountId) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=no_ig_account`);
        }

        // Get user profile
        const profile = await getUserProfile(igAccountId, longLivedToken.access_token);

        // Store session
        setSession({
            accessToken: longLivedToken.access_token,
            igAccountId,
            pageId,
            pageToken,
            profile,
            connectedAt: new Date().toISOString(),
        });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
    } catch (err) {
        console.error('OAuth callback error:', err);
        // Return detailed error for debugging
        const errorMessage = err?.response?.data?.error?.message || err?.message || 'Unknown error';
        const errorType = err?.response?.data?.error?.type || '';
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}?error=${encodeURIComponent(errorMessage)}&type=${encodeURIComponent(errorType)}`
        );
    }
}
