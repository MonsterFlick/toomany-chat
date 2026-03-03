// Webhook receiver for Instagram comments — stateless, reads token from env
import { NextResponse } from 'next/server';
import { addActivity } from '@/lib/store';
import axios from 'axios';

// GET — Webhook verification
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    }
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// POST — Receive webhook events
export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Webhook received:', JSON.stringify(body));

        // Use the IG access token stored in env for server-side processing
        const accessToken = process.env.IG_ACCESS_TOKEN;
        if (!accessToken) {
            console.log('No IG_ACCESS_TOKEN env var — cannot process webhook');
            return NextResponse.json({ received: true });
        }

        if (body.object === 'instagram') {
            for (const entry of body.entry || []) {
                for (const change of entry.changes || []) {
                    if (change.field === 'comments') {
                        const comment = change.value;
                        const commentText = (comment.text || '').toLowerCase();

                        addActivity({
                            type: 'webhook_received',
                            username: comment.from?.username || 'unknown',
                            status: 'info',
                            message: `Comment received: "${comment.text}"`,
                        });

                        // Check rules from store (works within single invocation)
                        const { getRules, getSettings, addActivity: logActivity } = await import('@/lib/store');
                        const rules = getRules();
                        const settings = getSettings();

                        for (const rule of rules) {
                            if (!rule.isActive) continue;
                            const keywords = (rule.keywords || '').toLowerCase().split(',').map(k => k.trim());
                            const matched = keywords.some(kw => kw && commentText.includes(kw));
                            if (!matched) continue;

                            const rewardUrl = rule.rewardUrl || settings.defaultUrl;
                            const userId = comment.from?.id;
                            const username = comment.from?.username;

                            logActivity({
                                type: 'keyword_matched',
                                username,
                                status: 'success',
                                message: `Keyword matched for @${username} — sending DM`,
                            });

                            try {
                                await axios.post(`https://graph.instagram.com/v21.0/me/messages`, {
                                    recipient: { id: userId },
                                    message: { text: `Hey @${username}! Here's your link: ${rewardUrl}` },
                                }, { params: { access_token: accessToken } });

                                logActivity({
                                    type: 'dm_sent',
                                    username,
                                    status: 'success',
                                    message: `DM sent to @${username} with URL: ${rewardUrl}`,
                                });
                            } catch (dmErr) {
                                logActivity({
                                    type: 'dm_failed',
                                    username,
                                    status: 'error',
                                    message: `DM failed for @${username}: ${dmErr?.response?.data?.error?.message || dmErr.message}`,
                                });
                            }
                        }
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
