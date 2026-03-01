'use client';

import { useState, useEffect } from 'react';

function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

export default function AutomationPage() {
    const [rules, setRules] = useState([]);
    const [activity, setActivity] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        name: '',
        triggerKeyword: '',
        message: '🎉 Here\'s your exclusive link: {{URL}}',
        url: 'https://omthakur.in',
        requireFollow: true,
        followMessage: '👋 Please follow us first to receive this resource!',
        isActive: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        Promise.all([
            fetch('/api/automation/rules').then(r => r.json()),
            fetch('/api/automation/activity').then(r => r.json()),
        ]).then(([rulesData, activityData]) => {
            setRules(rulesData.rules || []);
            setActivity(activityData.activity || []);
        });
    }

    function showToast(message, type = 'success') {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }

    async function handleSave() {
        if (!form.name || !form.triggerKeyword) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            if (editingRule) {
                await fetch('/api/automation/rules', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingRule.id, ...form }),
                });
                showToast('Rule updated successfully');
            } else {
                await fetch('/api/automation/rules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
                showToast('Rule created successfully');
            }
            setShowModal(false);
            setEditingRule(null);
            resetForm();
            fetchData();
        } catch {
            showToast('Error saving rule', 'error');
        }
    }

    async function handleToggle(rule) {
        await fetch('/api/automation/rules', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: rule.id, isActive: !rule.isActive }),
        });
        fetchData();
    }

    async function handleDelete(id) {
        await fetch(`/api/automation/rules?id=${id}`, { method: 'DELETE' });
        showToast('Rule deleted');
        fetchData();
    }

    function handleEdit(rule) {
        setEditingRule(rule);
        setForm({
            name: rule.name,
            triggerKeyword: rule.triggerKeyword,
            message: rule.message,
            url: rule.url,
            requireFollow: rule.requireFollow,
            followMessage: rule.followMessage || '',
            isActive: rule.isActive,
        });
        setShowModal(true);
    }

    function resetForm() {
        setForm({
            name: '',
            triggerKeyword: '',
            message: '🎉 Here\'s your exclusive link: {{URL}}',
            url: 'https://omthakur.in',
            requireFollow: true,
            followMessage: '👋 Please follow us first to receive this resource!',
            isActive: true,
        });
    }

    return (
        <>
            <header className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Automation</h1>
                        <p className="page-subtitle">Manage comment-triggered DM rules</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => { resetForm(); setEditingRule(null); setShowModal(true); }}
                    >
                        ➕ New Rule
                    </button>
                </div>
            </header>

            <div className="page-content">
                {/* Automation Flow */}
                <div className="glass-panel" style={{ marginBottom: '24px' }}>
                    <div className="flow-diagram">
                        <div className="flow-step">
                            <div className="flow-step-icon">💬</div>
                            <div>User Comments<br /><small style={{ color: 'var(--text-tertiary)' }}>with keyword</small></div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-step-icon">🔍</div>
                            <div>Keyword Match<br /><small style={{ color: 'var(--text-tertiary)' }}>trigger rule</small></div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-step-icon">✅</div>
                            <div>Follow Gate<br /><small style={{ color: 'var(--text-tertiary)' }}>verify follower</small></div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-step-icon">📩</div>
                            <div>Send DM<br /><small style={{ color: 'var(--text-tertiary)' }}>with URL</small></div>
                        </div>
                    </div>
                </div>

                <div className="two-col-grid">
                    {/* Rules */}
                    <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📋 Rules
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                                ({rules.filter(r => r.isActive).length} active)
                            </span>
                        </h3>

                        <div className="rules-list">
                            {rules.map((rule) => (
                                <div key={rule.id} className="rule-card">
                                    <div className="rule-card-header">
                                        <div className="rule-card-title">
                                            {rule.name}
                                            <span className="rule-card-keyword">{rule.triggerKeyword}</span>
                                        </div>
                                        <div className="rule-card-actions">
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(rule)}>✏️</button>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(rule.id)}>🗑️</button>
                                        </div>
                                    </div>

                                    <div className="rule-card-body">
                                        <p className="rule-card-message">{rule.message}</p>
                                        <div className="rule-card-stats">
                                            <div className="rule-stat">
                                                <div className="rule-stat-value">{rule.triggers}</div>
                                                <div className="rule-stat-label">Triggers</div>
                                            </div>
                                            <div className="rule-stat">
                                                <div className="rule-stat-value">{rule.successfulDMs}</div>
                                                <div className="rule-stat-label">DMs Sent</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rule-card-footer">
                                        <span className="rule-card-url">🔗 {rule.url}</span>
                                        <label className="rule-card-toggle-label">
                                            {rule.requireFollow && <span>🔒 Follow Gate</span>}
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={rule.isActive}
                                                    onChange={() => handleToggle(rule)}
                                                />
                                                <span className="toggle-slider" />
                                            </label>
                                        </label>
                                    </div>
                                </div>
                            ))}

                            {rules.length === 0 && (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🤖</div>
                                    <h3 className="empty-state-title">No automation rules yet</h3>
                                    <p className="empty-state-text">Create your first rule to start automating DMs</p>
                                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                        ➕ Create Rule
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                            ⚡ Activity Log
                        </h3>
                        <div className="glass-panel">
                            <div className="glass-panel-body" style={{ padding: '8px 12px', maxHeight: '600px', overflowY: 'auto' }}>
                                <div className="activity-list">
                                    {activity.map((item) => (
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
                                        <div className="empty-state" style={{ padding: '40px' }}>
                                            <div className="empty-state-icon">📭</div>
                                            <p className="empty-state-text">No activity yet. Activity will appear here when rules trigger.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Rule Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingRule ? '✏️ Edit Rule' : '➕ New Automation Rule'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Rule Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Free Resource Giveaway"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Trigger Keyword *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., FREE"
                                    value={form.triggerKeyword}
                                    onChange={e => setForm({ ...form, triggerKeyword: e.target.value })}
                                />
                                <p className="form-hint">When a comment contains this keyword, the rule will trigger</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">DM Message Template</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Use {{URL}} as a placeholder for the link"
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                />
                                <p className="form-hint">{'Use {{URL}} to insert the link automatically'}</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">URL to Send</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    placeholder="https://omthakur.in"
                                    value={form.url}
                                    onChange={e => setForm({ ...form, url: e.target.value })}
                                />
                            </div>

                            <div className="settings-row">
                                <div>
                                    <div className="settings-row-label">Require Follow</div>
                                    <div className="settings-row-desc">Only send URL to users who follow you</div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={form.requireFollow}
                                        onChange={e => setForm({ ...form, requireFollow: e.target.checked })}
                                    />
                                    <span className="toggle-slider" />
                                </label>
                            </div>

                            {form.requireFollow && (
                                <div className="form-group" style={{ marginTop: '16px' }}>
                                    <label className="form-label">Follow Request Message</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Message sent to non-followers"
                                        value={form.followMessage}
                                        onChange={e => setForm({ ...form, followMessage: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                {editingRule ? 'Save Changes' : 'Create Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}
        </>
    );
}
