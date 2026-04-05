import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'soulprompts_admin_session';
const DEFAULT_TTL_HOURS = 12;

interface SessionPayload {
  sub: 'owner';
  exp: number;
  nonce: string;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signValue(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function getTtlHours(): number {
  const parsed = Number(process.env.ADMIN_SESSION_TTL_HOURS || DEFAULT_TTL_HOURS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_HOURS;
}

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}

export function createAdminSessionToken(secret: string): { token: string; expiresAt: string } {
  const expiresAt = new Date(Date.now() + getTtlHours() * 60 * 60 * 1000);
  const payload: SessionPayload = {
    sub: 'owner',
    exp: expiresAt.getTime(),
    nonce: randomBytes(10).toString('hex')
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(secret, encoded);
  return {
    token: `${encoded}.${signature}`,
    expiresAt: expiresAt.toISOString()
  };
}

export function readAdminSessionToken(token: string | undefined, secret: string) {
  if (!token) return { active: false, expiresAt: null };

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return { active: false, expiresAt: null };

  const expectedSignature = signValue(secret, payload);
  const left = Buffer.from(signature, 'utf8');
  const right = Buffer.from(expectedSignature, 'utf8');
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return { active: false, expiresAt: null };
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as SessionPayload;
    if (parsed.sub !== 'owner' || parsed.exp <= Date.now()) {
      return { active: false, expiresAt: null };
    }

    return {
      active: true,
      expiresAt: new Date(parsed.exp).toISOString()
    };
  } catch {
    return { active: false, expiresAt: null };
  }
}

export function setAdminSessionCookie(cookies: Cookies, token: string, expiresAt: string) {
  cookies.set(COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt)
  });
}

export function clearAdminSessionCookie(cookies: Cookies) {
  cookies.delete(COOKIE_NAME, {
    path: '/'
  });
}
