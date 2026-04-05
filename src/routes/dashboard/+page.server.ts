import { redirect } from '@sveltejs/kit';
import { getCmsRepository } from '$lib/server/cms';

export async function load() {
  return {
    overview: await getCmsRepository().getDashboardOverview()
  };
}

export const actions = {
  createPrompt: async () => {
    const prompt = await getCmsRepository().createPromptDraft();
    throw redirect(303, `/dashboard/prompts/${prompt.id}/`);
  }
};
