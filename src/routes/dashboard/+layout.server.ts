import { getCmsRepository } from '$lib/server/cms';

export async function load() {
  return {
    overview: await getCmsRepository().getDashboardOverview()
  };
}
