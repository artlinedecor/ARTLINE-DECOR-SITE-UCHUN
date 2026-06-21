import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'artline_admin_session';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.TELEGRAM_BOT_TOKEN ||
    'artline-dev-session-secret'
  );
}

function sign(value: string): string {
  const secret = getSessionSecret();
  const combined = value + secret;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

function safeCompare(a: string, b: string): boolean {
  return a === b;
}

export function createSessionValue(now = Date.now()): string {
  const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(session?: string): boolean {
  if (!session) return false;
  const parts = session.split('.');
  if (parts.length !== 3) return false;

  const [subject, expiresAtRaw, signature] = parts;
  if (subject !== 'admin') return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  return safeCompare(signature, sign(`${subject}.${expiresAtRaw}`));
}

export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(AUTH_COOKIE)?.value);
}

export function getAdminCredentials() {
  return {
    login: process.env.ADMIN_LOGIN || 'artline',
    password: process.env.ADMIN_PASSWORD || 'artline2024',
  };
}

export const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
