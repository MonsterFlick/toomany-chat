'use client';

import { useState, useEffect } from 'react';

const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5', 'gradient-6'];

function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AnalyticsPage() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/media')
            .then(r => r.json())
            .then(data => {
                if (data.notConnected) {
                    setError('not_connected');
                } else if (data.error) {
                    setError(data.error);
                }
                setMedia(data.media || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const totalLikes = media.reduce((sum, m) => sum + (m.like_count || 0), 0);
    const totalComments = media.reduce((sum, m) => sum + (m.comments_count || 0), 0);

    if (!loading && error === 'not_connected') {
        return (
            <>
                <header className="page-header">
                    <div className="page-header-row">
                        <div><h1 className="page-title">Analytics</h1></div>
                    </div>
                </header>
                <div className="page-content">
                    <div className="empty-state" style={{ marginTop: '60px' }}>
                        <div className="empty-state-icon">🔌</div>
                        <h3 className="empty-state-title">Not Connected</h3>
                        <p className="empty-state-text">Connect your Instagram account to see your analytics.</p>
                        <a href="/" className="btn btn-primary">Connect Instagram</a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Analytics</h1>
                        <p className="page-subtitle">Your posts &amp; reels performance</p>
                    </div>
                    <span className="page-badge">🎬 {media.length} posts</span>
                </div>
            </header>

            <div className="page-content">
                {/* Summary Stats — only real available metrics */}
                <div className="stats-grid" style={{ marginBottom: '28px' }}>
                    <div className="stat-card">
                        <div className="stat-card-header"><div className="stat-card-icon">📸</div></div>
                        <div className="stat-card-value">{media.length}</div>
                        <div className="stat-card-label">Total Posts</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header"><div className="stat-card-icon">❤️</div></div>
                        <div className="stat-card-value">{formatNumber(totalLikes)}</div>
                        <div className="stat-card-label">Total Likes</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header"><div className="stat-card-icon">💬</div></div>
                        <div className="stat-card-value">{formatNumber(totalComments)}</div>
                        <div className="stat-card-label">Total Comments</div>
                    </div>
                </div>

                {error && error !== 'not_connected' && (
                    <div style={{ padding: '14px 18px', background: 'rgba(253,29,29,0.08)', border: '1px solid rgba(253,29,29,0.2)', borderRadius: 'var(--radius-md)', color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '20px' }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Media Grid */}
                {loading ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ animation: 'logoPulse 1.5s infinite' }}>⏳</div><p className="empty-state-text">Loading your posts...</p></div>
                ) : media.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3 className="empty-state-title">No posts found</h3>
                        <p className="empty-state-text">Your posts will appear here once loaded from Instagram.</p>
                    </div>
                ) : (
                    <div className="media-grid">
                        {media.map((item, index) => (
                            <a
                                key={item.id}
                                href={item.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="media-card">
                                    <div className="media-card-thumbnail">
                                        {item.thumbnail_url || item.media_url ? (
                                            <img
                                                src={item.thumbnail_url || item.media_url}
                                                alt="Post thumbnail"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className={`media-card-thumbnail-bg ${gradients[index % gradients.length]}`}>
                                                {item.media_type === 'VIDEO' ? '🎬' : '📸'}
                                            </div>
                                        )}
                                        <div className="media-card-overlay">
                                            <span className="media-card-stat">❤️ {formatNumber(item.like_count)}</span>
                                            <span className="media-card-stat">💬 {formatNumber(item.comments_count)}</span>
                                        </div>
                                    </div>

                                    <div className="media-card-body">
                                        <p className="media-card-caption">{item.caption || '(no caption)'}</p>
                                        <span className="media-card-date">{formatDate(item.timestamp)}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
