import { NextRequest, NextResponse } from 'next/server';
import { cmsContentService } from '@/lib/cms/content.service';
import { projectUpsertSchema } from '@/lib/validations/backend.schema';
import { logger } from '@/lib/logger';

export async function GET() {
  const projects = await cmsContentService.getAllProjectsAdmin();
  return NextResponse.json({ success: true, projects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = projectUpsertSchema.safeParse(body);

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

    const saved = await cmsContentService.upsertProject({
      id: body.id,
      ...parseResult.data,
      division: parseResult.data.division,
    });

    return NextResponse.json({ success: true, project: saved });
  } catch (err) {
    logger.error('Failed to save project in CMS', { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(
      { success: false, error: 'Failed to save project' },
      { status: 500 }
    );
  }
}
