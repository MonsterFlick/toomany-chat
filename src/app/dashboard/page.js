'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const EngagementChart = dynamic(() => import('@/components/EngagementChart'), { ssr: false });

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
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
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const totalReach = media.reduce((sum, m) => sum + (m.insights?.reach || 0), 0);
    const totalImpressions = media.reduce((sum, m) => sum + (m.insights?.impressions || 0), 0);
    const totalEngagement = media.reduce((sum, m) => sum + (m.insights?.engagement || m.insights?.total_interactions || 0), 0);
    const totalPlays = media.reduce((sum, m) => sum + (m.insights?.plays || 0), 0);
    const activeRules = rules.filter(r => r.isActive).length;

    return (
        <>
            <header className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle">
                            Welcome back, @{account?.account?.username || 'omthakur'} 👋
                        </p>
                    </div>
                    {account?.isDemo && (
                        <span className="page-badge">🎭 Demo Mode</span>
                    )}
                </div>
            </header>

            <div className="page-content">
                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">👥</div>
                            <span className="stat-card-trend up">+12.5%</span>
                        </div>
                        <div className="stat-card-value">{formatNumber(account?.account?.followers_count || 24500)}</div>
                        <div className="stat-card-label">Followers</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">👁️</div>
                            <span className="stat-card-trend up">+8.3%</span>
                        </div>
                        <div className="stat-card-value">{formatNumber(totalReach)}</div>
                        <div className="stat-card-label">Total Reach</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">📈</div>
                            <span className="stat-card-trend up">+15.2%</span>
                        </div>
                        <div className="stat-card-value">{formatNumber(totalImpressions)}</div>
                        <div className="stat-card-label">Impressions</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">🔥</div>
                            <span className="stat-card-trend up">+22.1%</span>
                        </div>
                        <div className="stat-card-value">{formatNumber(totalEngagement)}</div>
                        <div className="stat-card-label">Engagement</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">▶️</div>
                            <span className="stat-card-trend up">+18.7%</span>
                        </div>
                        <div className="stat-card-value">{formatNumber(totalPlays)}</div>
                        <div className="stat-card-label">Total Plays</div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="two-col-grid">
                    {/* Engagement Chart */}
                    <div className="glass-panel">
                        <div className="glass-panel-header">
                            <h3 className="glass-panel-title">📈 Engagement Trend</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Last 6 posts</span>
                        </div>
                        <div className="glass-panel-body">
                            <div className="chart-container">
                                <EngagementChart media={media} />
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-panel">
                        <div className="glass-panel-header">
                            <h3 className="glass-panel-title">⚡ Recent Activity</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{activeRules} active rules</span>
                        </div>
                        <div className="glass-panel-body" style={{ padding: '8px 12px', maxHeight: '340px', overflowY: 'auto' }}>
                            <div className="activity-list">
                                {activity.slice(0, 8).map((item) => (
                                    <div key={item.id} className="activity-item">
                                        <div className={`activity-dot ${item.status}`} />
                                        <div className="activity-content">
                                            <div className="activity-message">{item.message}</div>
                                            <div className="activity-meta">
                                                <span>@{item.username}</span>
                                            </div>
                                        </div>
                                        <span className="activity-time">{timeAgo(item.timestamp)}</span>
                                    </div>
                                ))}
                                {activity.length === 0 && (
                                    <div className="empty-state" style={{ padding: '30px' }}>
                                        <div className="empty-state-icon">🔕</div>
                                        <div className="empty-state-text">No activity yet</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Automation Flow Visualization */}
                <div className="glass-panel" style={{ marginTop: '24px' }}>
                    <div className="glass-panel-header">
                        <h3 className="glass-panel-title">🔄 Automation Flow</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>How it works</span>
                    </div>
                    <div className="flow-diagram">
                        <div className="flow-step">
                            <div className="flow-step-icon">💬</div>
                            <div>User Comments</div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-step-icon">🔍</div>
                            <div>Keyword Match</div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-step-icon">✅</div>
                            <div>Follow Check</div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-step-icon">📩</div>
                            <div>Send DM</div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-step-icon">🔗</div>
                            <div>Deliver URL</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
