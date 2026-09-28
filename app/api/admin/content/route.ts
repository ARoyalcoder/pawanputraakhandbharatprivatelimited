import { NextRequest, NextResponse } from 'next/server';
import { cmsContentService } from '@/lib/cms/content.service';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section') || 'hero';

  const content = await cmsContentService.getSiteContent(section);
  return NextResponse.json({ success: true, section, data: content });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { success: false, error: 'Section and data are required' },
        { status: 400 }
      );
    }

    const updated = await cmsContentService.updateSiteContent(section, data);
    return NextResponse.json({ success: true, section, data: updated });
  } catch (err) {
    logger.error('Failed to update site content in CMS', { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(
      { success: false, error: 'Failed to update site content' },
      { status: 500 }
    );
  }
}
