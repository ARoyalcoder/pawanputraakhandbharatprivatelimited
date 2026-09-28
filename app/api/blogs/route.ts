import { NextRequest, NextResponse } from 'next/server';
import { cmsContentService } from '@/lib/cms/content.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  const blogs = await cmsContentService.getBlogs({ category, limit, status: 'PUBLISHED' });
  return NextResponse.json({ success: true, blogs });
}
