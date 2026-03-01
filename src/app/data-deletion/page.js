export const metadata = {
    title: "Data Deletion — TooMany Chat",
};

export default function DataDeletion() {
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
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 800 }}>Data Deletion</h1>
            <p style={{ color: '#8e8ea0', marginBottom: '32px' }}>How to delete your data from TooMany Chat</p>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>How to Request Data Deletion</h2>
            <p style={{ color: '#b0b0c0' }}>
                If you wish to delete your data from TooMany Chat, you can do so by:
            </p>
            <ol style={{ color: '#b0b0c0', paddingLeft: '24px', marginTop: '12px' }}>
                <li style={{ marginBottom: '8px' }}>Disconnecting your Instagram account from TooMany Chat in Settings.</li>
                <li style={{ marginBottom: '8px' }}>Removing the TooMany Chat app from your Instagram authorized apps.</li>
                <li style={{ marginBottom: '8px' }}>Contacting us at <a href="https://omthakur.in" style={{ color: '#833ab4' }}>omthakur.in</a> to request full data deletion.</li>
            </ol>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>What Gets Deleted</h2>
            <p style={{ color: '#b0b0c0' }}>
                Upon data deletion request, we will remove all stored data including access tokens,
                session information, automation rules, and activity logs. This process is immediate
                and irreversible.
            </p>

            <h2 style={{ fontSize: '1.2rem', marginTop: '28px', marginBottom: '8px' }}>Confirmation</h2>
            <p style={{ color: '#b0b0c0' }}>
                You will receive confirmation once your data has been deleted. If you have any
                questions, contact us at <a href="https://omthakur.in" style={{ color: '#833ab4' }}>omthakur.in</a>.
            </p>
        </div>
    );
}
