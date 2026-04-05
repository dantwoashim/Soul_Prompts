import { fail, redirect } from '@sveltejs/kit';
import { clearLoginAttempts, isLoginRateLimited, recordFailedLoginAttempt } from '$lib/server/auth/rate-limit';
import {
  createAdminSessionToken,
  setAdminSessionCookie
} from '$lib/server/auth/session';
import { verifyPassword } from '$lib/server/auth/password';

export const actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!passwordHash || !sessionSecret) {
      return fail(503, {
        error: 'Admin authentication is not configured. Set ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET first.'
      });
    }

    const ip = getClientAddress();
    if (isLoginRateLimited(ip)) {
      return fail(429, {
        error: 'Too many login attempts. Wait a bit and try again.'
      });
    }

    const formData = await request.formData();
    const password = String(formData.get('password') ?? '');

    if (!verifyPassword(password, passwordHash)) {
      recordFailedLoginAttempt(ip);
      return fail(400, {
        error: 'That password did not match the owner dashboard.'
      });
    }

    clearLoginAttempts(ip);
    const session = createAdminSessionToken(sessionSecret);
    setAdminSessionCookie(cookies, session.token, session.expiresAt);
    throw redirect(303, '/dashboard/');
  }
};
