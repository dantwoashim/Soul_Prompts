import { error } from '@sveltejs/kit';
import { getCmsRepository } from '$lib/server/cms';

export async function load({ params }) {
  const data = await getCmsRepository().getPublishedPromptBySlug(params.slug);

  if (!data) {
    throw error(404, 'Prompt not found');
  }

  return data;
}
