import { NextResponse } from 'next/server';
import { ANALYTICS_EVENTS, analyticsStore, type AnalyticsEventPayload, type AnalyticsEventType } from '@/lib/analytics/tracker';
import { getClientIp, rateLimiter } from '@/lib/security/rate-limiter';

/** An event is a name and a few short labels. */
const MAX_BODY_BYTES = 2 * 1024;
const MAX_FIELDS = 8;
const MAX_VALUE_LENGTH = 200;
const EVENTS_PER_MINUTE = 120;

/** Keep only short text, number and boolean fields, so a client cannot store arbitrary data. */
function cleanPayload(payload: unknown): AnalyticsEventPayload {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return {};
  const clean: AnalyticsEventPayload = {};
  for (const [key, value] of Object.entries(payload).slice(0, MAX_FIELDS)) {
    if (typeof value === 'string') clean[key.slice(0, 40)] = value.slice(0, MAX_VALUE_LENGTH);
    else if (typeof value === 'number' || typeof value === 'boolean') clean[key.slice(0, 40)] = value;
  }
  return clean;
}

export async function POST(req: Request) {
  if (!rateLimiter.check(`analytics-${getClientIp(req)}`, EVENTS_PER_MINUTE, 60 * 1000).success) {
    return NextResponse.json({ error: 'Too many events' }, { status: 429 });
  }
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }
  try {
    const body = await req.json();
    const { event, payload } = body;

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }
    if (!(ANALYTICS_EVENTS as readonly string[]).includes(event)) {
      return NextResponse.json({ error: 'Unknown event' }, { status: 400 });
    }

    analyticsStore.record(event as AnalyticsEventType, cleanPayload(payload));
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
