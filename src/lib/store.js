// Minimal in-memory store — no demo data, real data only
const store = {
  // Current authenticated user session
  session: null,

  // Automation rules
  rules: [],

  // Activity log
  activityLog: [],

  // Settings
  settings: {
    defaultUrl: process.env.DEFAULT_REWARD_URL || 'https://omthakur.in',
    pollingInterval: 30,
    dmRateLimit: 200,
    autoReplyEnabled: true,
    followGateEnabled: true,
  },

  // DM rate limiting
  dmQueue: [],
  dmsSentThisHour: 0,
  lastHourReset: Date.now(),
};

export function getStore() { return store; }
export function getSession() { return store.session; }
export function setSession(session) { store.session = session; }

export function getRules() { return store.rules; }
export function addRule(rule) {
  const newRule = { ...rule, id: Date.now().toString(), createdAt: new Date().toISOString(), triggers: 0, successfulDMs: 0 };
  store.rules.push(newRule);
  return newRule;
}
export function updateRule(id, updates) {
  const i = store.rules.findIndex(r => r.id === id);
  if (i !== -1) { store.rules[i] = { ...store.rules[i], ...updates }; return store.rules[i]; }
  return null;
}
export function deleteRule(id) { store.rules = store.rules.filter(r => r.id !== id); }

export function addActivity(activity) {
  store.activityLog.unshift({ ...activity, id: Date.now().toString(), timestamp: new Date().toISOString() });
  if (store.activityLog.length > 100) store.activityLog = store.activityLog.slice(0, 100);
}
export function getActivity() { return store.activityLog; }

export function getSettings() { return store.settings; }
export function updateSettings(updates) { store.settings = { ...store.settings, ...updates }; return store.settings; }

export default store;
