'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function HomeContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

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

        {error && (
          <div style={{
            padding: '14px 20px',
            background: 'rgba(253, 29, 29, 0.1)',
            border: '1px solid rgba(253, 29, 29, 0.3)',
            borderRadius: '12px',
            color: '#ff6b6b',
            fontSize: '0.88rem',
            marginBottom: '24px',
            textAlign: 'left',
            wordBreak: 'break-word',
          }}>
            ❌ <strong>Auth Error:</strong> {decodeURIComponent(error)}
          </div>
        )}

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

        <div className="landing-buttons">
          <a href="/api/auth/instagram" className="btn-instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Connect Instagram
          </a>
          <Link href="/dashboard" className="btn-demo">
            🎯 Try Demo
          </Link>
        </div>

        <div className="landing-badge">
          <span>🔒</span> Secure OAuth2 · No passwords stored
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f' }} />}>
      <HomeContent />
    </Suspense>
  );
}
