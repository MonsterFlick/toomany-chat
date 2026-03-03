// Account / Session API — supports direct Instagram tokens AND Facebook User tokens
import { NextResponse } from 'next/server';
import { getSession, setSession } from '@/lib/store';
import axios from 'axios';

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
// Supports two token types:
//   1. Direct Instagram token (from Instagram API setup page) → calls graph.instagram.com
//   2. Facebook User token (from Graph API Explorer) → looks up linked Facebook Pages
export async function POST(request) {
    try {
        const { accessToken } = await request.json();
        if (!accessToken) {
            return NextResponse.json({ error: 'Access token required' }, { status: 400 });
        }

        let igAccountId, profile;

        // ── Strategy 1: Direct Instagram token (graph.instagram.com) ──
        try {
            const meRes = await axios.get('https://graph.instagram.com/me', {
                params: {
                    fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography',
                    access_token: accessToken,
                }
            });
            if (meRes.data?.id) {
                igAccountId = meRes.data.id;
                profile = meRes.data;
                console.log('Connected via direct Instagram token:', profile.username);
            }
        } catch {
            // Not a direct Instagram token — try Facebook approach below
        }

        // ── Strategy 2: Facebook User token → find linked Instagram Business Account ──
        if (!igAccountId) {
            try {
                const pagesRes = await axios.get('https://graph.facebook.com/v21.0/me/accounts', {
                    params: { access_token: accessToken }
                });

                const pages = pagesRes.data?.data || [];
                if (pages.length === 0) {
                    return NextResponse.json({
                        error: 'No Facebook Pages found linked to this token. Try using the token from the Instagram API setup page instead (in your Meta App → Instagram → Generate token).'
                    }, { status: 400 });
                }

                // Find a page that has an Instagram Business Account
                for (const page of pages) {
                    try {
                        const igRes = await axios.get(`https://graph.facebook.com/v21.0/${page.id}`, {
                            params: {
                                fields: 'instagram_business_account',
                                access_token: page.access_token,
                            }
                        });
                        if (igRes.data?.instagram_business_account?.id) {
                            igAccountId = igRes.data.instagram_business_account.id;

                            // Get profile
                            const profileRes = await axios.get(`https://graph.facebook.com/v21.0/${igAccountId}`, {
                                params: {
                                    fields: 'username,name,profile_picture_url,followers_count,follows_count,media_count,biography',
                                    access_token: accessToken,
                                }
                            });
                            profile = profileRes.data;
                            break;
                        }
                    } catch { /* try next page */ }
                }
            } catch (err) {
                const msg = err?.response?.data?.error?.message || err?.message;
                return NextResponse.json({ error: `Token error: ${msg}` }, { status: 400 });
            }
        }

        if (!igAccountId) {
            return NextResponse.json({
                error: 'Could not find an Instagram account linked to this token. Make sure your Instagram is a Business or Creator account.'
            }, { status: 400 });
        }

        // Store session
        setSession({
            accessToken,
            igAccountId,
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
    setSession(null);
    return NextResponse.json({ success: true });
}
