'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  async function handleConnect() {
    if (!token.trim()) {
      setError('Please paste your access token');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to connect');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Network error — please try again');
    }
    setLoading(false);
  }

  return (
    <div className="landing-page">
      <div className="landing-bg" />
      <div className="landing-content">
        <div className="landing-logo">
          <div className="landing-logo-icon">💬</div>
        </div>
        <h1 className="landing-title">TooMany Chat</h1>
        <p className="landing-subtitle">
          Your all-in-one Instagram automation &amp; analytics platform.
          Track your reel performance, automate DMs, and grow your audience —
          all from a single beautiful dashboard.
        </p>

        <div className="landing-features">
          <div className="landing-feature">
            <div className="landing-feature-icon">📊</div>
            <div className="landing-feature-text">Video &amp; Reel Analytics</div>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">🤖</div>
            <div className="landing-feature-text">Comment Automation</div>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">📩</div>
            <div className="landing-feature-text">Auto DM with Follow Gate</div>
          </div>
        </div>

        {!showTokenInput ? (
          <div className="landing-buttons">
            <button
              className="btn-instagram"
              onClick={() => setShowTokenInput(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Connect Instagram
            </button>
            <Link href="/dashboard" className="btn-demo">
              🎯 Try Demo
            </Link>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
            {/* How to get token */}
            <div style={{
              padding: '16px 20px',
              background: 'rgba(131, 58, 180, 0.08)',
              border: '1px solid rgba(131, 58, 180, 0.2)',
              borderRadius: '12px',
              marginBottom: '16px',
              textAlign: 'left',
              fontSize: '0.83rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                📋 How to get your Access Token (2 min):
              </div>
              <ol style={{ paddingLeft: '18px' }}>
                <li>Go to <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer" style={{ color: '#b388ff' }}>Graph API Explorer</a></li>
                <li>Select your <strong>App</strong> from the dropdown</li>
                <li>Click <strong>"Generate Access Token"</strong></li>
                <li>Grant <strong>all Instagram permissions</strong></li>
                <li>Click <strong>"Generate Long-Lived Token"</strong> to get a 60-day token</li>
                <li>Copy and paste the token below</li>
              </ol>
            </div>

            <div className="form-group">
              <textarea
                className="form-input"
                placeholder="Paste your long-lived Instagram access token here..."
                value={token}
                onChange={e => setToken(e.target.value)}
                style={{ minHeight: '90px', fontSize: '0.82rem', fontFamily: 'monospace' }}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(253, 29, 29, 0.1)',
                border: '1px solid rgba(253, 29, 29, 0.3)',
                borderRadius: '10px',
                color: '#ff6b6b',
                fontSize: '0.83rem',
                marginBottom: '14px',
              }}>
                ❌ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleConnect}
                className="btn-instagram"
                disabled={loading}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {loading ? '⏳ Connecting...' : '🔗 Connect'}
              </button>
              <button
                onClick={() => { setShowTokenInput(false); setError(''); setToken(''); }}
                className="btn-demo"
                style={{ flexShrink: 0 }}
              >
                Cancel
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link href="/dashboard" style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                Skip — use demo mode instead →
              </Link>
            </div>
          </div>
        )}

        <div className="landing-badge" style={{ marginTop: '28px' }}>
          <span>🔒</span> Token stored securely · No passwords needed
        </div>
      </div>
    </div>
  );
}
