// Account / Session API
import { NextResponse } from 'next/server';
import { getSession, getDemoAccount } from '@/lib/store';

export async function GET() {
    const session = getSession();
    if (session) {
        return NextResponse.json({
            isConnected: true,
            account: session.profile,
            connectedAt: session.connectedAt,
        });
    }
    return NextResponse.json({
        isConnected: false,
        account: getDemoAccount(),
        isDemo: true,
    });
}
