import { NextResponse } from 'next/server';
import { analyticsStore, AnalyticsEventType } from '@/lib/analytics/tracker';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, payload } = body;

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    analyticsStore.record(event as AnalyticsEventType, payload || {});
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const summary = analyticsStore.getSummary();
  return NextResponse.json({ success: true, summary });
}
