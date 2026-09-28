import { NextRequest, NextResponse } from 'next/server';
import { cmsContentService } from '@/lib/cms/content.service';
import { blogUpsertSchema } from '@/lib/validations/backend.schema';
import { logger } from '@/lib/logger';

export async function GET() {
  const blogs = await cmsContentService.getAllBlogsAdmin();
  return NextResponse.json({ success: true, blogs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = blogUpsertSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const saved = await cmsContentService.upsertBlog({
      id: body.id,
      ...parseResult.data,
      publishedAt: body.publishedAt || new Date().toISOString(),
    });

    return NextResponse.json({ success: true, blog: saved });
  } catch (err) {
    logger.error('Failed to save blog post in CMS', { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(
      { success: false, error: 'Failed to save blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog ID is required' }, { status: 400 });
    }

    const deleted = await cmsContentService.deleteBlog(id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    logger.error('Failed to delete blog post in CMS', { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
