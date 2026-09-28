import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  let dbStatus = 'operational';
  try {
    if (prisma && prisma.lead) {
      await prisma.lead.count();
    }
  } catch {
    dbStatus = 'in-memory-fallback';
  }

  const memoryUsage = typeof process !== 'undefined' ? process.memoryUsage() : null;

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    company: env.NEXT_PUBLIC_COMPANY_NAME,
    tagline: env.NEXT_PUBLIC_COMPANY_TAGLINE,
    version: '1.0.0',
    database: {
      status: dbStatus,
      engine: 'PostgreSQL / Prisma ORM',
    },
    divisions: {
      secure: 'active',
      connect: 'active',
      solar: 'active',
      digital: 'active',
      space: 'active',
    },
    system: {
      nodeVersion: process.version,
      memoryRssMb: memoryUsage ? Math.round(memoryUsage.rss / 1024 / 1024) : null,
      memoryHeapUsedMb: memoryUsage ? Math.round(memoryUsage.heapUsed / 1024 / 1024) : null,
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
