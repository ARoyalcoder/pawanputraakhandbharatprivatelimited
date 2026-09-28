import { NextResponse } from 'next/server';
import { leadRepository } from '@/lib/db/lead.repository';
import { cmsContentService } from '@/lib/cms/content.service';

export async function GET() {
  try {
    const [leadStats, blogs, projects] = await Promise.all([
      leadRepository.getStats(),
      cmsContentService.getAllBlogsAdmin(),
      cmsContentService.getAllProjectsAdmin(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        ...leadStats,
        totalBlogs: blogs.length,
        publishedBlogs: blogs.filter((b) => b.status === 'PUBLISHED').length,
        totalProjects: projects.length,
        publishedProjects: projects.filter((p) => p.status === 'PUBLISHED').length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate admin statistics.' },
      { status: 500 }
    );
  }
}
