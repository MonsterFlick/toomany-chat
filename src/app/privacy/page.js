export const metadata = {
    title: "Privacy Policy — TooMany Chat",
};

export default function PrivacyPolicy() {
    return (
        <div style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '60px 24px',
            fontFamily: 'Inter, sans-serif',
            color: '#f0f0f5',
            background: '#0a0a0f',
            minHeight: '100vh',
            lineHeight: 1.8,
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 800 }}>Privacy Policy</h1>
            <p style={{ color: '#8e8ea0', marginBottom: '32px' }}>Last updated: March 1, 2026</p>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>1. Information We Collect</h2>
            <p style={{ color: '#b0b0c0' }}>
                When you connect your Instagram account, we access your public profile information,
                media data (posts, reels, videos), comments, and messaging capabilities through the
                Instagram Graph API. We only access data that you explicitly authorize.
            </p>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>2. How We Use Your Data</h2>
            <p style={{ color: '#b0b0c0' }}>
                Your data is used solely to provide the TooMany Chat platform features: displaying
                analytics and insights for your media, automating direct message responses based on
                your configured rules, and managing comment interactions on your behalf.
            </p>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>3. Data Storage</h2>
            <p style={{ color: '#b0b0c0' }}>
                We store your access tokens securely to maintain your session. Media data and insights
                are fetched in real-time from Instagram and are not permanently stored on our servers.
                Automation rules and activity logs are stored temporarily during your active session.
            </p>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>4. Data Sharing</h2>
            <p style={{ color: '#b0b0c0' }}>
                We do not sell, trade, or share your personal data with any third parties. Your
                Instagram data is used exclusively within the TooMany Chat platform.
            </p>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>5. Data Deletion</h2>
            <p style={{ color: '#b0b0c0' }}>
                You can disconnect your Instagram account at any time. Upon disconnection, all stored
                session data and tokens are immediately deleted. You may also request complete data
                deletion by contacting us.
            </p>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>6. Contact</h2>
            <p style={{ color: '#b0b0c0' }}>
                For questions about this privacy policy, contact us at{' '}
                <a href="https://omthakur.in" style={{ color: '#833ab4' }}>omthakur.in</a>.
            </p>
        </div>
    );
}
