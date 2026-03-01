// Automation Engine — Core logic for comment-triggered DM automation
import { getRules, addActivity, getSettings, getStore } from './store';
import { sendDM, checkFollower } from './instagram';

const DM_RATE_LIMIT = 200; // per hour

/**
 * Process a new comment and trigger automation if rules match
 */
export async function processComment({ commentId, commentText, username, userId, mediaId, igAccountId, accessToken }) {
    const rules = getRules().filter(r => r.isActive);
    const settings = getSettings();
    const store = getStore();

    // Check rate limit
    resetHourlyCounterIfNeeded(store);
    if (store.dmsSentThisHour >= DM_RATE_LIMIT) {
        addActivity({
            type: 'rate_limit',
            username,
            mediaId,
            status: 'warning',
            message: `Rate limit reached (${DM_RATE_LIMIT}/hour). DM queued.`,
        });
        store.dmQueue.push({ commentId, commentText, username, userId, mediaId, igAccountId, accessToken });
        return { queued: true };
    }

    // Find matching rule
    const matchingRule = rules.find(rule => {
        const keyword = rule.triggerKeyword.toLowerCase();
        const text = commentText.toLowerCase();
        return text.includes(keyword);
    });

    if (!matchingRule) {
        return { matched: false };
    }

    // Log trigger
    addActivity({
        type: 'comment_detected',
        username,
        mediaId,
        keyword: matchingRule.triggerKeyword,
        status: 'success',
        message: `Comment detected with keyword "${matchingRule.triggerKeyword}"`,
    });

    // Increment trigger count
    matchingRule.triggers++;

    // Check if follow is required
    if (matchingRule.requireFollow && settings.followGateEnabled) {
        const isFollower = await checkFollower(igAccountId, userId, accessToken);

        addActivity({
            type: 'follow_check',
            username,
            status: isFollower ? 'success' : 'warning',
            message: isFollower ? 'User follows the account ✓' : 'User does not follow the account',
        });

        if (!isFollower) {
            // Send follow request message
            const followMsg = matchingRule.followMessage || settings.defaultFollowMessage ||
                '👋 Please follow us first to receive your resource! Comment again after following.';

            await sendDM(igAccountId, userId, followMsg, accessToken);
            store.dmsSentThisHour++;

            addActivity({
                type: 'follow_request',
                username,
                status: 'info',
                message: 'Follow request DM sent to user',
            });

            return { matched: true, followRequired: true, dmSent: true };
        }
    }

    // Send the reward DM with URL
    const url = matchingRule.url || settings.defaultUrl;
    const message = matchingRule.message.replace('{{URL}}', url);

    const result = await sendDM(igAccountId, userId, message, accessToken);
    store.dmsSentThisHour++;

    if (result.success) {
        matchingRule.successfulDMs++;
        addActivity({
            type: 'dm_sent',
            username,
            status: 'success',
            message: `DM sent with URL: ${url}`,
        });
    } else {
        addActivity({
            type: 'dm_failed',
            username,
            status: 'error',
            message: `Failed to send DM: ${JSON.stringify(result.error)}`,
        });
    }

    return { matched: true, dmSent: result.success, url };
}

/**
 * Reset hourly DM counter if needed
 */
function resetHourlyCounterIfNeeded(store) {
    const now = Date.now();
    if (now - store.lastHourReset >= 3600000) {
        store.dmsSentThisHour = 0;
        store.lastHourReset = now;
    }
}

/**
 * Process queued DMs (called periodically)
 */
export async function processQueue() {
    const store = getStore();
    resetHourlyCounterIfNeeded(store);

    while (store.dmQueue.length > 0 && store.dmsSentThisHour < DM_RATE_LIMIT) {
        const item = store.dmQueue.shift();
        await processComment(item);
    }
}

export default { processComment, processQueue };
