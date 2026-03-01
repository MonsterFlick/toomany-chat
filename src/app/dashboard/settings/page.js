'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [settings, setSettings] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/settings')
            .then(r => r.json())
            .then(data => {
                setSettings(data.settings);
                setAccount(data.account);
                setIsConnected(data.isConnected);
            });
    }, []);

    function showToast(message, type = 'success') {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }

    async function handleSave() {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                showToast('Settings saved successfully');
            }
        } catch {
            showToast('Error saving settings', 'error');
        }
        setSaving(false);
    }

    if (!settings) return null;

    return (
        <>
            <header className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Settings</h1>
                        <p className="page-subtitle">Configure your automation preferences</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? '⏳ Saving...' : '💾 Save Settings'}
                    </button>
                </div>
            </header>

            <div className="page-content">
                <div className="settings-grid">
                    {/* Account Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">👤 Account</h3>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '20px',
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'var(--gradient-instagram)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: 700,
                                flexShrink: 0,
                            }}>
                                {account?.username?.[0]?.toUpperCase() || 'O'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                                    @{account?.username || 'omthakur'}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {account?.name || 'Om Thakur'}
                                </div>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.75rem',
                                    color: isConnected ? 'var(--status-success)' : 'var(--status-warning)',
                                    marginTop: '4px',
                                }}>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: isConnected ? 'var(--status-success)' : 'var(--status-warning)',
                                    }} />
                                    {isConnected ? 'Connected' : 'Demo Mode'}
                                </div>
                            </div>
                        </div>

                        {!isConnected && (
                            <a href="/api/auth/instagram" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                🔗 Connect Instagram Account
                            </a>
                        )}

                        {account && (
                            <div style={{ marginTop: '16px' }}>
                                <div className="settings-row">
                                    <div className="settings-row-label">Followers</div>
                                    <span style={{ fontWeight: 700 }}>{account.followers_count?.toLocaleString() || '24,500'}</span>
                                </div>
                                <div className="settings-row">
                                    <div className="settings-row-label">Following</div>
                                    <span style={{ fontWeight: 700 }}>{account.follows_count?.toLocaleString() || '890'}</span>
                                </div>
                                <div className="settings-row">
                                    <div className="settings-row-label">Posts</div>
                                    <span style={{ fontWeight: 700 }}>{account.media_count?.toLocaleString() || '156'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* URL Configuration */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">🔗 Default URL</h3>
                        <div className="form-group">
                            <label className="form-label">Reward URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={settings.defaultUrl}
                                onChange={e => setSettings({ ...settings, defaultUrl: e.target.value })}
                            />
                            <p className="form-hint">
                                This URL will be sent in DMs when no rule-specific URL is set.
                                You can override this per-rule in the Automation page.
                            </p>
                        </div>

                        <div style={{
                            padding: '14px 16px',
                            background: 'rgba(131, 58, 180, 0.08)',
                            border: '1px solid rgba(131, 58, 180, 0.15)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.82rem',
                            color: 'var(--text-secondary)',
                        }}>
                            💡 <strong>Current URL:</strong>{' '}
                            <span style={{ color: 'var(--status-info)', fontFamily: 'monospace' }}>
                                {settings.defaultUrl}
                            </span>
                        </div>
                    </div>

                    {/* Automation Settings */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">🤖 Automation</h3>

                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Auto-Reply to Comments</div>
                                <div className="settings-row-desc">Automatically respond when keywords are detected</div>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.autoReplyEnabled}
                                    onChange={e => setSettings({ ...settings, autoReplyEnabled: e.target.checked })}
                                />
                                <span className="toggle-slider" />
                            </label>
                        </div>

                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Follow Gate</div>
                                <div className="settings-row-desc">Require users to follow before receiving URL</div>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.followGateEnabled}
                                    onChange={e => setSettings({ ...settings, followGateEnabled: e.target.checked })}
                                />
                                <span className="toggle-slider" />
                            </label>
                        </div>

                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Polling Interval</div>
                                <div className="settings-row-desc">How often to check for new comments (seconds)</div>
                            </div>
                            <input
                                type="number"
                                className="form-input"
                                style={{ width: '80px', textAlign: 'center' }}
                                min={10}
                                max={300}
                                value={settings.pollingInterval}
                                onChange={e => setSettings({ ...settings, pollingInterval: parseInt(e.target.value) || 30 })}
                            />
                        </div>

                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">DM Rate Limit</div>
                                <div className="settings-row-desc">Max DMs per hour (Instagram limit: 200)</div>
                            </div>
                            <input
                                type="number"
                                className="form-input"
                                style={{ width: '80px', textAlign: 'center' }}
                                min={1}
                                max={200}
                                value={settings.dmRateLimit}
                                onChange={e => setSettings({ ...settings, dmRateLimit: parseInt(e.target.value) || 200 })}
                            />
                        </div>
                    </div>

                    {/* Webhook Info */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">🔔 Webhook</h3>

                        <div className="form-group">
                            <label className="form-label">Webhook URL</label>
                            <input
                                type="text"
                                className="form-input"
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook`}
                                readOnly
                                onClick={e => {
                                    e.target.select();
                                    navigator.clipboard?.writeText(e.target.value);
                                    showToast('Webhook URL copied!', 'info');
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                            <p className="form-hint">
                                Click to copy. Use this URL in your Meta Developer App webhook settings.
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Verify Token</label>
                            <input
                                type="text"
                                className="form-input"
                                value={process.env.NEXT_PUBLIC_WEBHOOK_VERIFY_TOKEN || '••••••••••••'}
                                readOnly
                                style={{ fontFamily: 'monospace' }}
                            />
                            <p className="form-hint">
                                Set in your .env.local file as WEBHOOK_VERIFY_TOKEN
                            </p>
                        </div>

                        <div style={{
                            padding: '14px 16px',
                            background: 'rgba(67, 233, 123, 0.08)',
                            border: '1px solid rgba(67, 233, 123, 0.15)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.82rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                        }}>
                            <strong>📋 Setup Guide:</strong><br />
                            1. Go to <a href="https://developers.facebook.com" target="_blank" style={{ color: 'var(--status-info)' }}>developers.facebook.com</a><br />
                            2. Select your app → Webhooks<br />
                            3. Subscribe to &quot;Instagram&quot; → &quot;comments&quot; field<br />
                            4. Paste the Webhook URL and Verify Token above
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === 'success' ? '✅' : toast.type === 'info' ? 'ℹ️' : '❌'} {toast.message}
                </div>
            )}
        </>
    );
}
