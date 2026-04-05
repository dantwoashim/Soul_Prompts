import { fail, redirect } from '@sveltejs/kit';
import { serializePromptForm } from '$lib/cms/admin';
import { parsePromptSnapshot } from '$lib/server/cms/forms';
import { getCmsRepository } from '$lib/server/cms';

async function loadPrompt(id: string) {
  const result = await getCmsRepository().getPromptRecord(id);
  if (!result.prompt) {
    throw redirect(303, '/dashboard/prompts/');
  }

  return result;
}

export async function load({ params }) {
  const result = await loadPrompt(params.id);
  const prompt = result.prompt!;

  return {
    prompt,
    versions: result.versions,
    promptForm: serializePromptForm(prompt.draft)
  };
}

export const actions = {
  save: async ({ request, params }) => {
    const formData = await request.formData();

    try {
      const snapshot = parsePromptSnapshot(formData, params.id);
      await getCmsRepository().savePromptDraft(snapshot);
      return { success: 'Draft saved.' };
    } catch (error) {
      return fail(400, {
        error: error instanceof Error ? error.message : 'Unable to save prompt draft.',
        values: Object.fromEntries(formData)
      });
    }
  },
  publish: async ({ request, params }) => {
    const formData = await request.formData();

    try {
      const snapshot = parsePromptSnapshot(formData, params.id);
      await getCmsRepository().savePromptDraft(snapshot);
      await getCmsRepository().publishPrompt(params.id);
      return { success: 'Prompt published.' };
    } catch (error) {
      return fail(400, {
        error: error instanceof Error ? error.message : 'Unable to publish prompt.',
        values: Object.fromEntries(formData)
      });
    }
  },
  rollback: async ({ request, params }) => {
    const formData = await request.formData();
    const versionId = String(formData.get('versionId') ?? '');

    try {
      await getCmsRepository().rollbackPrompt(params.id, versionId);
      return { success: 'Prompt draft rolled back.' };
    } catch (error) {
      return fail(400, {
        error: error instanceof Error ? error.message : 'Unable to roll back prompt.'
      });
    }
  },
  clone: async ({ params }) => {
    const cloned = await getCmsRepository().clonePrompt(params.id);
    throw redirect(303, `/dashboard/prompts/${cloned.id}/`);
  }
};
