import { getCmsRepository } from '$lib/server/cms';

export async function load({ locals }) {
  const shell = await getCmsRepository().getSiteShell();

  return {
    shell,
    adminSession: locals.adminSession
  };
}
