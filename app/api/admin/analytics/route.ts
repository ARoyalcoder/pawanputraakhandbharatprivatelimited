import { NextResponse } from 'next/server';
import { analyticsStore } from '@/lib/analytics/tracker';
import { leadRepository } from '@/lib/db/lead.repository';

export async function GET() {
  try {
    const summary = analyticsStore.getSummary();
    const recentEvents = analyticsStore.getEvents().slice(0, 50);
    const leadStats = await leadRepository.getStats();

    return NextResponse.json({
      success: true,
      data: {
        summary,
        recentEvents,
        leadStats,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics metrics' },
      { status: 500 }
    );
  }
}
