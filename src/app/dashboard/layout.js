'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navItems = [
    { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/dashboard/analytics', icon: '🎬', label: 'Analytics' },
    { href: '/dashboard/automation', icon: '🤖', label: 'Automation' },
    { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const [account, setAccount] = useState(null);

    useEffect(() => {
        fetch('/api/account')
            .then(r => r.json())
            .then(data => setAccount(data))
            .catch(() => { });
    }, []);

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">💬</div>
                    <span className="sidebar-brand">TooMany Chat</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="sidebar-link-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {account?.account?.username?.[0]?.toUpperCase() || 'O'}
                        </div>
                        <div>
                            <div className="sidebar-username">
                                @{account?.account?.username || 'omthakur'}
                            </div>
                            <div className="sidebar-status">
                                {account?.isConnected ? 'Connected' : 'Demo Mode'}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
