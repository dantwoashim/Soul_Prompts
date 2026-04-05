import { getCmsRepository } from '$lib/server/cms';

export async function load() {
  return getCmsRepository().getPublishedFaqPage();
}
