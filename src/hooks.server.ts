import { redirect, type Handle } from '@sveltejs/kit';
import { getAdminCookieName, readAdminSessionToken } from '$lib/server/auth/session';

const PUBLIC_DASHBOARD_PATHS = new Set(['/dashboard/login', '/dashboard/login/']);

function getAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return {
      active: false,
      expiresAt: null
    };
  }

  return secret;
}

export const handle: Handle = async ({ event, resolve }) => {
  const sessionSecret = getAdminSession();
  const token =
    typeof sessionSecret === 'string'
      ? event.cookies.get(getAdminCookieName())
      : undefined;

  event.locals.adminSession =
    typeof sessionSecret === 'string'
      ? readAdminSessionToken(token, sessionSecret)
      : { active: false, expiresAt: null };

  const pathname = event.url.pathname;
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isPublicDashboardPath = PUBLIC_DASHBOARD_PATHS.has(pathname);

  if (isDashboardRoute && !isPublicDashboardPath && !event.locals.adminSession.active) {
    throw redirect(303, '/dashboard/login/');
  }

  if (isPublicDashboardPath && event.locals.adminSession.active) {
    throw redirect(303, '/dashboard/');
  }

  return resolve(event);
};
