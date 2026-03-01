'use client';

import { useState, useEffect } from 'react';

const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5', 'gradient-6'];
const icons = ['🎬', '🎥', '📹', '🎞️', '🎯', '🚀'];

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function AnalyticsPage() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);

    useEffect(() => {
        fetch('/api/media')
            .then(r => r.json())
            .then(data => {
                setMedia(data.media || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const totalReach = media.reduce((sum, m) => sum + (m.insights?.reach || 0), 0);
    const totalPlays = media.reduce((sum, m) => sum + (m.insights?.plays || 0), 0);
    const avgEngagement = media.length > 0
        ? (media.reduce((sum, m) => sum + (m.insights?.engagement || m.insights?.total_interactions || 0), 0) / media.length).toFixed(0)
        : 0;

    return (
        <>
            <header className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Analytics</h1>
                        <p className="page-subtitle">Track your reels &amp; video performance</p>
                    </div>
                    <span className="page-badge">🎬 {media.length} Videos</span>
                </div>
            </header>

            <div className="page-content">
                {/* Summary Stats */}
                <div className="stats-grid" style={{ marginBottom: '28px' }}>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">👁️</div>
                            <span className="stat-card-trend up">+14.2%</span>
                        </div>
                        <div className="stat-card-value">{formatNumber(totalReach)}</div>
                        <div className="stat-card-label">Total Reach</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">▶️</div>
                            <span className="stat-card-trend up">+21.8%</span>
                        </div>
                        <div className="stat-card-value">{formatNumber(totalPlays)}</div>
                        <div className="stat-card-label">Total Plays</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">💡</div>
                            <span className="stat-card-trend up">+9.4%</span>
                        </div>
                        <div className="stat-card-value">{formatNumber(avgEngagement)}</div>
                        <div className="stat-card-label">Avg. Engagement</div>
                    </div>
                </div>

                {/* Media Grid */}
                <div className="media-grid">
                    {media.map((item, index) => (
                        <div
                            key={item.id}
                            className="media-card"
                            onClick={() => setSelectedMedia(selectedMedia?.id === item.id ? null : item)}
                        >
                            <div className="media-card-thumbnail">
                                <div className={`media-card-thumbnail-bg ${gradients[index % gradients.length]}`}>
                                    {icons[index % icons.length]}
                                </div>
                                <div className="media-card-overlay">
                                    <span className="media-card-stat">❤️ {formatNumber(item.like_count)}</span>
                                    <span className="media-card-stat">💬 {formatNumber(item.comments_count)}</span>
                                    <span className="media-card-stat">▶️ {formatNumber(item.insights?.plays)}</span>
                                </div>
                            </div>

                            <div className="media-card-body">
                                <p className="media-card-caption">{item.caption}</p>
                                <span className="media-card-date">{formatDate(item.timestamp)}</span>
                            </div>

                            {item.insights && (
                                <div className="media-card-insights">
                                    <div className="media-insight">
                                        <div className="media-insight-value">{formatNumber(item.insights.reach)}</div>
                                        <div className="media-insight-label">Reach</div>
                                    </div>
                                    <div className="media-insight">
                                        <div className="media-insight-value">{formatNumber(item.insights.saved)}</div>
                                        <div className="media-insight-label">Saves</div>
                                    </div>
                                    <div className="media-insight">
                                        <div className="media-insight-value">{formatNumber(item.insights.shares)}</div>
                                        <div className="media-insight-label">Shares</div>
                                    </div>
                                </div>
                            )}

                            {/* Expanded details */}
                            {selectedMedia?.id === item.id && item.insights && (
                                <div style={{
                                    padding: '16px',
                                    borderTop: '1px solid var(--border-color)',
                                    background: 'var(--bg-glass)',
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                        <div className="media-insight">
                                            <div className="media-insight-value">{formatNumber(item.insights.impressions)}</div>
                                            <div className="media-insight-label">Impressions</div>
                                        </div>
                                        <div className="media-insight">
                                            <div className="media-insight-value">{formatNumber(item.insights.engagement || item.insights.total_interactions)}</div>
                                            <div className="media-insight-label">Engagement</div>
                                        </div>
                                    </div>
                                    <a
                                        href={item.permalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary btn-sm"
                                        style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        🔗 View on Instagram
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {media.length === 0 && !loading && (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎬</div>
                        <h3 className="empty-state-title">No media found</h3>
                        <p className="empty-state-text">
                            Connect your Instagram account to see your video analytics here.
                        </p>
                        <a href="/api/auth/instagram" className="btn btn-primary">
                            Connect Instagram
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
