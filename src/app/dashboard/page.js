'use client';

import { useState, useEffect } from 'react';

function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

export default function DashboardPage() {
    const [account, setAccount] = useState(null);
    const [media, setMedia] = useState([]);
    const [activity, setActivity] = useState([]);
    const [rules, setRules] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch('/api/account').then(r => r.json()),
            fetch('/api/media').then(r => r.json()),
            fetch('/api/automation/activity').then(r => r.json()),
            fetch('/api/automation/rules').then(r => r.json()),
        ]).then(([accountData, mediaData, activityData, rulesData]) => {
            setAccount(accountData);
            setMedia(mediaData.media || []);
            setActivity(activityData.activity || []);
            setRules(rulesData.rules || []);
        });
    }, []);

    const totalLikes = media.reduce((sum, m) => sum + (m.like_count || 0), 0);
    const totalComments = media.reduce((sum, m) => sum + (m.comments_count || 0), 0);
    const activeRules = rules.filter(r => r.isActive).length;
    const acc = account?.account;

    return (
        <>
            <header className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle">
                            Welcome back, @{acc?.username || '...'} 👋
                        </p>
                    </div>
                    {!account?.isConnected && (
                        <span className="page-badge">🎭 Not Connected</span>
                    )}
                </div>
            </header>

            <div className="page-content">
                {/* Stats — only show real available data */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">👥</div>
                        </div>
                        <div className="stat-card-value">{formatNumber(acc?.followers_count)}</div>
                        <div className="stat-card-label">Followers</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">📸</div>
                        </div>
                        <div className="stat-card-value">{formatNumber(acc?.media_count)}</div>
                        <div className="stat-card-label">Total Posts</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">❤️</div>
                        </div>
                        <div className="stat-card-value">{formatNumber(totalLikes)}</div>
                        <div className="stat-card-label">Total Likes</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">💬</div>
                        </div>
                        <div className="stat-card-value">{formatNumber(totalComments)}</div>
                        <div className="stat-card-label">Total Comments</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">🤖</div>
                        </div>
                        <div className="stat-card-value">{activeRules}</div>
                        <div className="stat-card-label">Active Rules</div>
                    </div>
                </div>

                <div className="two-col-grid">
                    {/* Recent Posts */}
                    <div className="glass-panel">
                        <div className="glass-panel-header">
                            <h3 className="glass-panel-title">📸 Recent Posts</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{media.length} posts</span>
                        </div>
                        <div className="glass-panel-body" style={{ padding: '8px 12px', maxHeight: '380px', overflowY: 'auto' }}>
                            {media.length === 0 ? (
                                <div className="empty-state" style={{ padding: '30px' }}>
                                    <div className="empty-state-icon">📭</div>
                                    <p className="empty-state-text">No posts found</p>
                                </div>
                            ) : (
                                media.slice(0, 8).map((item) => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-sm)',
                                        transition: 'background 0.15s',
                                        cursor: 'pointer',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        onClick={() => window.open(item.permalink, '_blank')}
                                    >
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--gradient-instagram)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px',
                                            flexShrink: 0,
                                        }}>
                                            {item.media_type === 'VIDEO' ? '🎬' : '📸'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: '0.83rem',
                                                color: 'var(--text-secondary)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {item.caption || '(no caption)'}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                                                ❤️ {formatNumber(item.like_count)} · 💬 {formatNumber(item.comments_count)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="glass-panel">
                        <div className="glass-panel-header">
                            <h3 className="glass-panel-title">⚡ Automation Activity</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{activeRules} active rules</span>
                        </div>
                        <div className="glass-panel-body" style={{ padding: '8px 12px', maxHeight: '380px', overflowY: 'auto' }}>
                            <div className="activity-list">
                                {activity.length === 0 ? (
                                    <div className="empty-state" style={{ padding: '30px' }}>
                                        <div className="empty-state-icon">🔕</div>
                                        <p className="empty-state-text">No activity yet. Set up an automation rule to get started.</p>
                                    </div>
                                ) : activity.slice(0, 10).map((item) => (
                                    <div key={item.id} className="activity-item">
                                        <div className={`activity-dot ${item.status}`} />
                                        <div className="activity-content">
                                            <div className="activity-message">{item.message}</div>
                                            <div className="activity-meta"><span>@{item.username}</span></div>
                                        </div>
                                        <span className="activity-time">{timeAgo(item.timestamp)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Automation Flow */}
                <div className="glass-panel" style={{ marginTop: '24px' }}>
                    <div className="glass-panel-header">
                        <h3 className="glass-panel-title">🔄 Automation Flow</h3>
                    </div>
                    <div className="flow-diagram">
                        <div className="flow-step"><div className="flow-step-icon">💬</div><div>User Comments</div></div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step"><div className="flow-step-icon">🔍</div><div>Keyword Match</div></div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step"><div className="flow-step-icon">✅</div><div>Follow Check</div></div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step"><div className="flow-step-icon">📩</div><div>Send DM</div></div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step"><div className="flow-step-icon">🔗</div><div>Deliver URL</div></div>
                    </div>
                </div>
            </div>
        </>
    );
}
