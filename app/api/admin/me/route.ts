import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('ppab_admin_session');

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Session missing' },
      { status: 401 }
    );
  }

  // Session valid
  return NextResponse.json({
    success: true,
    user: {
      id: 'admin-super-1',
      email: env.ADMIN_EMAIL,
      name: 'PPAB Master Administrator',
      role: 'SUPER_ADMIN',
    },
  });
}
