// In-memory data store for TooMany Chat
// In production, replace with a database (MongoDB, PostgreSQL, etc.)

const store = {
  // Current authenticated user session
  session: null,

  // Automation rules
  rules: [
    {
      id: '1',
      name: 'Free Resource Giveaway',
      triggerKeyword: 'FREE',
      message: '🎉 Thanks for commenting! Here\'s your exclusive link: {{URL}}',
      url: process.env.DEFAULT_REWARD_URL || 'https://omthakur.in',
      requireFollow: true,
      followMessage: '👋 Hey! Please follow us first to receive your free resource. Once you follow, comment again and we\'ll send it right away!',
      isActive: true,
      createdAt: new Date().toISOString(),
      triggers: 0,
      successfulDMs: 0,
    },
    {
      id: '2',
      name: 'Course Link',
      triggerKeyword: 'COURSE',
      message: '📚 Here\'s your course access link: {{URL}}',
      url: process.env.DEFAULT_REWARD_URL || 'https://omthakur.in',
      requireFollow: true,
      followMessage: '❤️ Follow us to unlock your course link! Comment again after following.',
      isActive: false,
      createdAt: new Date().toISOString(),
      triggers: 0,
      successfulDMs: 0,
    }
  ],

  // Activity log (recent automation events)
  activityLog: [
    {
      id: '1',
      type: 'comment_detected',
      username: 'demo_user',
      mediaId: '123',
      keyword: 'FREE',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'success',
      message: 'Comment detected with keyword "FREE"'
    },
    {
      id: '2',
      type: 'follow_check',
      username: 'demo_user',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      status: 'success',
      message: 'User follows the account ✓'
    },
    {
      id: '3',
      type: 'dm_sent',
      username: 'demo_user',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      status: 'success',
      message: 'DM sent with URL: https://omthakur.in'
    },
    {
      id: '4',
      type: 'comment_detected',
      username: 'another_user',
      mediaId: '456',
      keyword: 'FREE',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'warning',
      message: 'Comment detected but user doesn\'t follow'
    },
    {
      id: '5',
      type: 'follow_request',
      username: 'another_user',
      timestamp: new Date(Date.now() - 1700000).toISOString(),
      status: 'info',
      message: 'Follow request DM sent to user'
    }
  ],

  // Settings
  settings: {
    defaultUrl: process.env.DEFAULT_REWARD_URL || 'https://omthakur.in',
    pollingInterval: 30, // seconds
    dmRateLimit: 200, // per hour
    autoReplyEnabled: true,
    followGateEnabled: true,
  },

  // DM queue for rate limiting
  dmQueue: [],
  dmsSentThisHour: 0,
  lastHourReset: Date.now(),

  // Demo media data
  demoMedia: [
    {
      id: 'demo_1',
      caption: '🔥 New tutorial dropping! Comment "FREE" to get the link! #coding #tutorial',
      media_type: 'VIDEO',
      media_url: null,
      thumbnail_url: null,
      timestamp: '2026-02-28T10:00:00Z',
      like_count: 2847,
      comments_count: 342,
      permalink: 'https://instagram.com/p/demo1',
      insights: {
        reach: 45200,
        impressions: 67800,
        saved: 891,
        shares: 234,
        plays: 52100,
        engagement: 4314,
      }
    },
    {
      id: 'demo_2',
      caption: '💡 5 tips every developer needs to know! Save this for later 🔖',
      media_type: 'VIDEO',
      media_url: null,
      thumbnail_url: null,
      timestamp: '2026-02-25T14:30:00Z',
      like_count: 5621,
      comments_count: 489,
      permalink: 'https://instagram.com/p/demo2',
      insights: {
        reach: 82400,
        impressions: 124600,
        saved: 2340,
        shares: 567,
        plays: 95300,
        engagement: 9017,
      }
    },
    {
      id: 'demo_3',
      caption: '🚀 From 0 to 10K followers — my journey! Comment "COURSE" for the guide',
      media_type: 'VIDEO',
      media_url: null,
      thumbnail_url: null,
      timestamp: '2026-02-22T09:15:00Z',
      like_count: 8934,
      comments_count: 1205,
      permalink: 'https://instagram.com/p/demo3',
      insights: {
        reach: 156000,
        impressions: 234000,
        saved: 4521,
        shares: 1890,
        plays: 178000,
        engagement: 16550,
      }
    },
    {
      id: 'demo_4',
      caption: '🎯 Day in the life of a creator. What do you want to see next? 👇',
      media_type: 'VIDEO',
      media_url: null,
      thumbnail_url: null,
      timestamp: '2026-02-19T16:45:00Z',
      like_count: 3456,
      comments_count: 678,
      permalink: 'https://instagram.com/p/demo4',
      insights: {
        reach: 58900,
        impressions: 89200,
        saved: 1234,
        shares: 345,
        plays: 67400,
        engagement: 5713,
      }
    },
    {
      id: 'demo_5',
      caption: '✨ Biggest mistake creators make — and how to fix it! #growth',
      media_type: 'VIDEO',
      media_url: null,
      thumbnail_url: null,
      timestamp: '2026-02-16T11:00:00Z',
      like_count: 6789,
      comments_count: 890,
      permalink: 'https://instagram.com/p/demo5',
      insights: {
        reach: 112000,
        impressions: 168000,
        saved: 3456,
        shares: 1234,
        plays: 130000,
        engagement: 12369,
      }
    },
    {
      id: 'demo_6',
      caption: '🎬 Behind the scenes of my content creation process',
      media_type: 'VIDEO',
      media_url: null,
      thumbnail_url: null,
      timestamp: '2026-02-13T08:30:00Z',
      like_count: 4123,
      comments_count: 567,
      permalink: 'https://instagram.com/p/demo6',
      insights: {
        reach: 72100,
        impressions: 98400,
        saved: 1678,
        shares: 456,
        plays: 83200,
        engagement: 6824,
      }
    }
  ],

  // Demo account stats
  demoAccount: {
    username: 'omthakur',
    name: 'Om Thakur',
    profile_picture: null,
    followers_count: 24500,
    follows_count: 890,
    media_count: 156,
    biography: '🚀 Creator | Developer | Educator\n📩 DM for collabs\n🔗 omthakur.in',
  }
};

// Helper functions
export function getStore() {
  return store;
}

export function getSession() {
  return store.session;
}

export function setSession(session) {
  store.session = session;
}

export function getRules() {
  return store.rules;
}

export function addRule(rule) {
  const newRule = {
    ...rule,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    triggers: 0,
    successfulDMs: 0,
  };
  store.rules.push(newRule);
  return newRule;
}

export function updateRule(id, updates) {
  const index = store.rules.findIndex(r => r.id === id);
  if (index !== -1) {
    store.rules[index] = { ...store.rules[index], ...updates };
    return store.rules[index];
  }
  return null;
}

export function deleteRule(id) {
  store.rules = store.rules.filter(r => r.id !== id);
}

export function addActivity(activity) {
  store.activityLog.unshift({
    ...activity,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  });
  // Keep only last 100 activities
  if (store.activityLog.length > 100) {
    store.activityLog = store.activityLog.slice(0, 100);
  }
}

export function getActivity() {
  return store.activityLog;
}

export function getSettings() {
  return store.settings;
}

export function updateSettings(updates) {
  store.settings = { ...store.settings, ...updates };
  return store.settings;
}

export function getDemoMedia() {
  return store.demoMedia;
}

export function getDemoAccount() {
  return store.demoAccount;
}

export default store;
