import { redirect } from '@sveltejs/kit';
import { clearAdminSessionCookie } from '$lib/server/auth/session';

export async function POST({ cookies }) {
  clearAdminSessionCookie(cookies);
  throw redirect(303, '/dashboard/login/');
}
