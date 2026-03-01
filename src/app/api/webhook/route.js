// Webhook receiver for Instagram comments
import { NextResponse } from 'next/server';
import { processComment } from '@/lib/automation-engine';
import { getSession, addActivity } from '@/lib/store';

// GET — Webhook verification (Meta sends a challenge)
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        console.log('Webhook verified!');
        return new Response(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// POST — Receive webhook events
export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Webhook received:', JSON.stringify(body, null, 2));

        const session = getSession();
        if (!session) {
            console.log('No session — cannot process webhook');
            return NextResponse.json({ received: true });
        }

        // Process comment events
        if (body.object === 'instagram') {
            for (const entry of body.entry || []) {
                for (const change of entry.changes || []) {
                    if (change.field === 'comments') {
                        const comment = change.value;

                        addActivity({
                            type: 'webhook_received',
                            username: comment.from?.username || 'unknown',
                            mediaId: comment.media?.id,
                            status: 'info',
                            message: `Webhook: New comment on media`,
                        });

                        await processComment({
                            commentId: comment.id,
                            commentText: comment.text,
                            username: comment.from?.username,
                            userId: comment.from?.id,
                            mediaId: comment.media?.id,
                            igAccountId: session.igAccountId,
                            accessToken: session.accessToken,
                        });
                    }
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ received: true });
    }
}
