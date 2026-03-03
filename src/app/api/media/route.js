// Media API — fetch real media via Instagram Graph API
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/store';
import axios from 'axios';

export async function GET() {
    const session = getSession();

    if (!session) {
        return NextResponse.json({ media: [], notConnected: true });
    }

    try {
        // Fetch media using direct Instagram token
        const mediaRes = await axios.get('https://graph.instagram.com/me/media', {
            params: {
                fields: 'id,caption,media_type,thumbnail_url,media_url,timestamp,like_count,comments_count,permalink',
                limit: 25,
                access_token: session.accessToken,
            }
        });

        const media = mediaRes.data?.data || [];

        return NextResponse.json({ media });
    } catch (err) {
        const msg = err?.response?.data?.error?.message || err?.message;
        return NextResponse.json({ media: [], error: msg });
    }
}
