import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'artline_admin_session';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

// Edge-safe cryptographically secure random values for fallback secret
const RUNTIME_SECRET = Array.from({ length: 32 }, () => 
  Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
).join('');

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.TELEGRAM_BOT_TOKEN;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return RUNTIME_SECRET;
    }
    return 'artline-dev-session-secret';
  }
  return secret;
}

async function sign(value: string): Promise<string> {
  const secret = getSessionSecret();
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const data = encoder.encode(value);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionValue(now = Date.now()): Promise<string> {
  const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionValue(session?: string): Promise<boolean> {
  if (!session) return false;
  const parts = session.split('.');
  if (parts.length !== 3) return false;

  const [subject, expiresAtRaw, signature] = parts;
  if (subject !== 'admin') return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expectedSignature = await sign(`${subject}.${expiresAtRaw}`);
  return safeCompare(signature, expectedSignature);
}

export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return await verifySessionValue(cookieStore.get(AUTH_COOKIE)?.value);
}

export function getAdminCredentials() {
  return {
    login: process.env.ADMIN_LOGIN || process.env.NEXT_PUBLIC_ADMIN_LOGIN || 'artline',
    password: process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'artline2024',
  };
}

export const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
