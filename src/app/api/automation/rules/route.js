// Automation Rules API — CRUD for automation rules
import { NextResponse } from 'next/server';
import { getRules, addRule, updateRule, deleteRule } from '@/lib/store';

export async function GET() {
    return NextResponse.json({ rules: getRules() });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const rule = addRule(body);
        return NextResponse.json({ rule }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        const rule = updateRule(id, updates);
        if (!rule) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }
        return NextResponse.json({ rule });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        deleteRule(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
