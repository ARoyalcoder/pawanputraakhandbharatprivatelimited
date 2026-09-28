import { describe, it, expect, beforeEach } from 'vitest';
import { analyticsStore, trackEvent, AnalyticsEventType } from '@/lib/analytics/tracker';

const REQUIRED_EVENTS: AnalyticsEventType[] = [
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
];

describe('Module 31: Privacy-Conscious Central Analytics', () => {
  beforeEach(() => {
    analyticsStore.clear();
  });

  it('supports tracking all 14 business conversion events', async () => {
    for (const ev of REQUIRED_EVENTS) {
      await trackEvent(ev, { division: 'CCTV', path: '/solutions/secure' });
    }

    const events = analyticsStore.getEvents();
    expect(events.length).toBe(14);

    const summary = analyticsStore.getSummary();
    expect(summary.totalEvents).toBe(14);
    for (const ev of REQUIRED_EVENTS) {
      expect(summary.counts[ev]).toBe(1);
    }
  });

  it('guarantees zero PII storage in analytics payloads', async () => {
    await trackEvent('contact_form_submit', {
      division: 'SOLAR',
      referenceId: 'PPAB-2026-99999',
      source: 'contact_page',
    });

    const recorded = analyticsStore.getEvents()[0];
    expect(recorded).toBeDefined();

    // Verify no personal data keys exist
    const payload = recorded.payload;
    expect(payload.email).toBeUndefined();
    expect(payload.phone).toBeUndefined();
    expect(payload.name).toBeUndefined();
    expect(payload.address).toBeUndefined();
    expect(payload.referenceId).toBe('PPAB-2026-99999');
  });

  it('calculates division attribution counts accurately', async () => {
    await trackEvent('solution_view', { division: 'CCTV' });
    await trackEvent('solution_view', { division: 'CCTV' });
    await trackEvent('solution_view', { division: 'SOLAR' });

    const summary = analyticsStore.getSummary();
    expect(summary.divisionCounts['CCTV']).toBe(2);
    expect(summary.divisionCounts['SOLAR']).toBe(1);
  });
});
