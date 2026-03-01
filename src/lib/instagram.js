// Instagram Graph API wrapper
import axios from 'axios';

const GRAPH_API_BASE = 'https://graph.instagram.com';
const GRAPH_API_VERSION = 'v21.0';
const FACEBOOK_GRAPH = 'https://graph.facebook.com';

/**
 * Get the Instagram OAuth URL
 */
export function getOAuthUrl() {
    const appId = process.env.INSTAGRAM_APP_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;
    const scope = 'instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_manage_messages,pages_show_list';

    return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code) {
    const response = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/oauth/access_token`, {
        params: {
            client_id: process.env.INSTAGRAM_APP_ID,
            client_secret: process.env.INSTAGRAM_APP_SECRET,
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
            code,
        }
    });
    return response.data;
}

/**
 * Get long-lived access token
 */
export async function getLongLivedToken(shortToken) {
    const response = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/oauth/access_token`, {
        params: {
            grant_type: 'fb_exchange_token',
            client_id: process.env.INSTAGRAM_APP_ID,
            client_secret: process.env.INSTAGRAM_APP_SECRET,
            fb_exchange_token: shortToken,
        }
    });
    return response.data;
}

/**
 * Get Instagram Business Account ID from Facebook Pages
 */
export async function getInstagramAccountId(accessToken) {
    // Get Facebook Pages
    const pagesResponse = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/me/accounts`, {
        params: { access_token: accessToken }
    });

    if (!pagesResponse.data.data || pagesResponse.data.data.length === 0) {
        throw new Error('No Facebook Pages found');
    }

    const pageId = pagesResponse.data.data[0].id;
    const pageToken = pagesResponse.data.data[0].access_token;

    // Get Instagram Business Account linked to the page
    const igResponse = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/${pageId}`, {
        params: {
            fields: 'instagram_business_account',
            access_token: pageToken,
        }
    });

    return {
        igAccountId: igResponse.data.instagram_business_account?.id,
        pageId,
        pageToken,
    };
}

/**
 * Get user profile info
 */
export async function getUserProfile(igAccountId, accessToken) {
    const response = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/${igAccountId}`, {
        params: {
            fields: 'username,name,profile_picture_url,followers_count,follows_count,media_count,biography',
            access_token: accessToken,
        }
    });
    return response.data;
}

/**
 * Get all media (posts, reels, videos)
 */
export async function getMedia(igAccountId, accessToken, limit = 25) {
    const response = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/${igAccountId}/media`, {
        params: {
            fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink',
            limit,
            access_token: accessToken,
        }
    });
    return response.data.data;
}

/**
 * Get insights for a specific media item
 */
export async function getMediaInsights(mediaId, accessToken, mediaType = 'VIDEO') {
    const metrics = mediaType === 'VIDEO' || mediaType === 'REELS'
        ? 'reach,impressions,saved,shares,plays,total_interactions'
        : 'reach,impressions,saved,shares,total_interactions';

    try {
        const response = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/${mediaId}/insights`, {
            params: {
                metric: metrics,
                access_token: accessToken,
            }
        });

        const insights = {};
        response.data.data.forEach(metric => {
            insights[metric.name] = metric.values[0]?.value || 0;
        });
        return insights;
    } catch (error) {
        console.error('Error fetching media insights:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Get account-level insights
 */
export async function getAccountInsights(igAccountId, accessToken) {
    try {
        const response = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/${igAccountId}/insights`, {
            params: {
                metric: 'reach,impressions,accounts_engaged,profile_views',
                period: 'day',
                access_token: accessToken,
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching account insights:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Get recent comments on a media item
 */
export async function getMediaComments(mediaId, accessToken) {
    const response = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/${mediaId}/comments`, {
        params: {
            fields: 'id,text,username,timestamp,from',
            access_token: accessToken,
        }
    });
    return response.data.data;
}

/**
 * Check if a user follows the account
 * Note: Instagram Graph API doesn't have a direct "check follower" endpoint.
 * We use the conversation/messaging approach — if user has DMed us before, we check.
 * For comment-based flows, we'll try sending a DM and check the response.
 */
export async function checkFollower(igAccountId, userId, accessToken) {
    try {
        // Try to get conversations with the user
        const response = await axios.get(`${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/${igAccountId}/conversations`, {
            params: {
                user_id: userId,
                access_token: accessToken,
            }
        });
        // If we can get conversation, user has interacted
        return response.data.data && response.data.data.length > 0;
    } catch (error) {
        // If error, assume not a follower for safety
        return false;
    }
}

/**
 * Send a DM to a user
 */
export async function sendDM(igAccountId, recipientId, message, accessToken) {
    try {
        const response = await axios.post(
            `${FACEBOOK_GRAPH}/${GRAPH_API_VERSION}/${igAccountId}/messages`,
            {
                recipient: { id: recipientId },
                message: { text: message },
            },
            {
                params: { access_token: accessToken },
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error sending DM:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
}

export default {
    getOAuthUrl,
    exchangeCodeForToken,
    getLongLivedToken,
    getInstagramAccountId,
    getUserProfile,
    getMedia,
    getMediaInsights,
    getAccountInsights,
    getMediaComments,
    checkFollower,
    sendDM,
};
