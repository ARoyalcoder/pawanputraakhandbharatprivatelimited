/**
 * Central Privacy-Conscious Analytics Engine
 * Tracks essential business conversions and page engagement without storing PII
 */

export const ANALYTICS_EVENTS = [
  'page_view',
  'solution_view',
  'industry_view',
  'project_view',
  'blog_view',
  'cta_click',
  'call_click',
  'whatsapp_click',
  'contact_form_submit',
  'cctv_lead_submit',
  'solar_lead_submit',
  'digital_lead_submit',
  'connect_lead_submit',
  'space_lead_submit',
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENTS)[number];

export interface AnalyticsEventPayload {
  path?: string;
  division?: string;
  source?: string;
  category?: string;
  slug?: string;
  referenceId?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface StoredAnalyticsEvent {
  id: string;
  event: AnalyticsEventType;
  payload: AnalyticsEventPayload;
  createdAt: string;
}

// In-memory buffer for server-side analytics aggregation
class AnalyticsStore {
  private events: StoredAnalyticsEvent[] = [];
  private maxEvents = 1000;

  public record(event: AnalyticsEventType, payload: AnalyticsEventPayload = {}): void {
    const record: StoredAnalyticsEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      event,
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    this.events.unshift(record);
    if (this.events.length > this.maxEvents) this.events.length = this.maxEvents;
  }

  public getEvents(): StoredAnalyticsEvent[] {
    return [...this.events];
  }

  public getSummary() {
    const counts: Record<string, number> = {};
    const divisionCounts: Record<string, number> = {};

    for (const ev of this.events) {
      counts[ev.event] = (counts[ev.event] || 0) + 1;
      if (ev.payload.division && typeof ev.payload.division === 'string') {
        const div = ev.payload.division;
        divisionCounts[div] = (divisionCounts[div] || 0) + 1;
      }
    }

    return {
      totalEvents: this.events.length,
      counts,
      divisionCounts,
    };
  }

  public clear(): void {
    this.events = [];
  }
}

export const analyticsStore = new AnalyticsStore();

/**
 * Client-safe analytics tracking dispatcher
 */
export async function trackEvent(
  event: AnalyticsEventType,
  payload: AnalyticsEventPayload = {}
): Promise<void> {
  // Always record in local store for synchronous availability & test verification
  analyticsStore.record(event, payload);

  // If in browser and not a test runner, dispatch to backend /api/analytics/event
  if (typeof window !== 'undefined' && typeof process === 'undefined') {
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({ event, payload })], {
          type: 'application/json',
        });
        navigator.sendBeacon('/api/analytics/event', blob);
      } else if (typeof fetch !== 'undefined') {
        fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, payload }),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking fail
    }
  }
}
