// Media API — reads token from cookie, fully stateless
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    const token = request.cookies.get('ig_token')?.value;

    if (!token) {
        return NextResponse.json({ media: [], notConnected: true });
    }

    try {
        const res = await axios.get('https://graph.instagram.com/me/media', {
            params: {
                fields: 'id,caption,media_type,thumbnail_url,media_url,timestamp,like_count,comments_count,permalink',
                limit: 25,
                access_token: token,
            }
        });
        return NextResponse.json({ media: res.data?.data || [] });
    } catch (err) {
        const msg = err?.response?.data?.error?.message || err?.message;
        return NextResponse.json({ media: [], error: msg });
    }
}
