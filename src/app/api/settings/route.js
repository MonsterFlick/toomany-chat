// Settings API
import { NextResponse } from 'next/server';
import { getSettings, updateSettings, getSession, getDemoAccount } from '@/lib/store';

export async function GET() {
    const session = getSession();
    return NextResponse.json({
        settings: getSettings(),
        account: session?.profile || getDemoAccount(),
        isConnected: !!session,
    });
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const settings = updateSettings(body);
        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
