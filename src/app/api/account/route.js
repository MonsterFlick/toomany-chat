// Account / Session API — token stored in cookie, stateless serverless
import { NextResponse } from 'next/server';
import axios from 'axios';

const COOKIE_NAME = 'ig_token';

// Helper to read token from request cookie
function getTokenFromRequest(request) {
    return request.cookies.get(COOKIE_NAME)?.value || null;
}

export async function GET(request) {
    const token = getTokenFromRequest(request);
    if (!token) {
        return NextResponse.json({ isConnected: false, account: null });
    }

    try {
        const res = await axios.get('https://graph.instagram.com/me', {
            params: {
                fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count',
                access_token: token,
            }
        });
        return NextResponse.json({ isConnected: true, account: res.data });
    } catch {
        // Token invalid/expired — clear it
        const response = NextResponse.json({ isConnected: false, account: null });
        response.cookies.delete(COOKIE_NAME);
        return response;
    }
}

// POST — validate token, set cookie
export async function POST(request) {
    try {
        const { accessToken } = await request.json();
        if (!accessToken) {
            return NextResponse.json({ error: 'Access token required' }, { status: 400 });
        }

        let profile = null;

        // Strategy 1: Direct Instagram token
        try {
            const res = await axios.get('https://graph.instagram.com/me', {
                params: {
                    fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count',
                    access_token: accessToken,
                }
            });
            if (res.data?.id) profile = res.data;
        } catch { /* try next */ }

        // Strategy 2: Facebook User token → find linked IG account
        if (!profile) {
            try {
                const pagesRes = await axios.get('https://graph.facebook.com/v21.0/me/accounts', {
                    params: { access_token: accessToken }
                });
                const pages = pagesRes.data?.data || [];
                if (pages.length === 0) {
                    return NextResponse.json({
                        error: 'No Facebook Pages found. Use the token from Meta App → Instagram → Generate token.'
                    }, { status: 400 });
                }
                for (const page of pages) {
                    try {
                        const igRes = await axios.get(`https://graph.facebook.com/v21.0/${page.id}`, {
                            params: { fields: 'instagram_business_account', access_token: page.access_token }
                        });
                        if (igRes.data?.instagram_business_account?.id) {
                            const igId = igRes.data.instagram_business_account.id;
                            const profileRes = await axios.get(`https://graph.facebook.com/v21.0/${igId}`, {
                                params: {
                                    fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count',
                                    access_token: accessToken,
                                }
                            });
                            profile = profileRes.data;
                            break;
                        }
                    } catch { /* try next */ }
                }
            } catch (err) {
                const msg = err?.response?.data?.error?.message || err?.message;
                return NextResponse.json({ error: `Token error: ${msg}` }, { status: 400 });
            }
        }

        if (!profile) {
            return NextResponse.json({
                error: 'Could not find an Instagram account. Make sure it is a Business or Creator account.'
            }, { status: 400 });
        }

        // Set token in httpOnly cookie (7 days)
        const response = NextResponse.json({ success: true, profile });
        response.cookies.set(COOKIE_NAME, accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
        return response;

    } catch (err) {
        const msg = err?.response?.data?.error?.message || err?.message || 'Failed to connect';
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}

// DELETE — clear cookie
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(COOKIE_NAME);
    return response;
}
