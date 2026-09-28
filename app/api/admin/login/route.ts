import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validations/backend.schema';
import { env } from '@/lib/env';
import { timingSafeCompare, hashString } from '@/lib/security/auth-crypto';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: 5 login attempts per minute per IP to mitigate brute force
    const rateCheck = rateLimiter.check(`admin-login-${clientIp}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please wait ${rateCheck.reset} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = adminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password format.',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { email, password } = parseResult.data;

    // Secure timing-safe credentials check against configured admin credentials
    const isEmailValid = timingSafeCompare(email.toLowerCase(), env.ADMIN_EMAIL.toLowerCase());
    const isPasswordValid = timingSafeCompare(password, env.ADMIN_PASSWORD);

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials provided.' },
        { status: 401 }
      );
    }

    // Generate secure session token
    const tokenPayload = `${env.ADMIN_EMAIL}:${Date.now()}`;
    const sessionToken = hashString(tokenPayload, env.AUTH_SECRET);

    const user = {
      id: 'admin-super-1',
      email: env.ADMIN_EMAIL,
      name: 'PPAB Master Administrator',
      role: 'SUPER_ADMIN',
    };

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user,
    });

    // Set secure HttpOnly SameSite cookie
    response.cookies.set('ppab_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal authentication server error.' },
      { status: 500 }
    );
  }
}
