import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE,
  authCookieOptions,
  createSessionValue,
  getAdminCredentials,
} from '@/lib/server-auth';

export async function POST(request: Request) {
  const { login, password } = await request.json().catch(() => ({
    login: '',
    password: '',
  }));

  const credentials = getAdminCredentials();
  const valid =
    typeof login === 'string' &&
    typeof password === 'string' &&
    credentials.password.length > 0 &&
    login === credentials.login &&
    password === credentials.password;

  if (!valid) {
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE, createSessionValue(), authCookieOptions);
  return response;
}
