// Media API — Fetch all media with insights
import { NextResponse } from 'next/server';
import { getSession, getDemoMedia } from '@/lib/store';
import { getMedia, getMediaInsights } from '@/lib/instagram';

export async function GET() {
    const session = getSession();

    // If no session, return demo data
    if (!session) {
        return NextResponse.json({
            media: getDemoMedia(),
            isDemo: true,
        });
    }

    try {
        const media = await getMedia(session.igAccountId, session.accessToken);

        // Fetch insights for each media item
        const mediaWithInsights = await Promise.all(
            media.map(async (item) => {
                const insights = await getMediaInsights(item.id, session.accessToken, item.media_type);
                return { ...item, insights };
            })
        );

        return NextResponse.json({
            media: mediaWithInsights,
            isDemo: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json({
            media: getDemoMedia(),
            isDemo: true,
            error: 'Failed to fetch live data, showing demo data',
        });
    }
}
