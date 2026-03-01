// Instagram OAuth — Start Authorization
import { NextResponse } from 'next/server';
import { getOAuthUrl } from '@/lib/instagram';

export async function GET() {
    const url = getOAuthUrl();
    return NextResponse.redirect(url);
}
