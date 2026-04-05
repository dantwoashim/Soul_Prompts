import { fail, redirect } from '@sveltejs/kit';
import type {
  FaqDocument,
  FooterDocument,
  GuideDocument,
  HomeDocument,
  NavigationDocument,
  VaultDocument
} from '$lib/cms/types';
import {
  isDocumentKey,
  serializeFaqDocumentForm,
  serializeFooterDocumentForm,
  serializeGuideDocumentForm,
  serializeHomeDocumentForm,
  serializeNavigationDocumentForm,
  serializeSettingsForm,
  serializeVaultDocumentForm
} from '$lib/cms/admin';
import {
  parseFaqDocument,
  parseFooterDocument,
  parseGuideDocument,
  parseHomeDocument,
  parseNavigationDocument,
  parseSettingsSnapshot,
  parseVaultDocument
} from '$lib/server/cms/forms';
import { getDashboardDocumentTitle, getCmsRepository } from '$lib/server/cms';

async function loadResource(documentKey: string) {
  const repository = getCmsRepository();

  if (documentKey === 'settings') {
    const result = await repository.getSiteSettings();
    return {
      kind: 'settings' as const,
      title: getDashboardDocumentTitle('settings'),
      resource: result.settings,
      versions: result.versions,
      formValues: serializeSettingsForm(result.settings.draft)
    };
  }

  if (!isDocumentKey(documentKey)) {
    throw redirect(303, '/dashboard/');
  }

  const result = await repository.getSiteDocument(documentKey);

  let formValues;
  switch (documentKey) {
    case 'home':
      formValues = serializeHomeDocumentForm(result.document.draft as HomeDocument);
      break;
    case 'vault':
      formValues = serializeVaultDocumentForm(result.document.draft as VaultDocument);
      break;
    case 'guide':
      formValues = serializeGuideDocumentForm(result.document.draft as GuideDocument);
      break;
    case 'faq':
      formValues = serializeFaqDocumentForm(result.document.draft as FaqDocument);
      break;
    case 'navigation':
      formValues = serializeNavigationDocumentForm(result.document.draft as NavigationDocument);
      break;
    case 'footer':
      formValues = serializeFooterDocumentForm(result.document.draft as FooterDocument);
      break;
  }

  return {
    kind: documentKey,
    title: getDashboardDocumentTitle(documentKey),
    resource: result.document,
    versions: result.versions,
    formValues
  };
}

export async function load({ params }) {
  return loadResource(params.document);
}

export const actions = {
  save: async ({ request, params }) => {
    const formData = await request.formData();
    const repository = getCmsRepository();

    try {
      if (params.document === 'settings') {
        await repository.saveSiteSettingsDraft(parseSettingsSnapshot(formData));
      } else if (isDocumentKey(params.document)) {
        const draft =
          params.document === 'home'
            ? parseHomeDocument(formData)
            : params.document === 'vault'
              ? parseVaultDocument(formData)
              : params.document === 'guide'
                ? parseGuideDocument(formData)
                : params.document === 'faq'
                  ? parseFaqDocument(formData)
                  : params.document === 'navigation'
                    ? parseNavigationDocument(formData)
                    : parseFooterDocument(formData);

        await repository.saveSiteDocumentDraft(params.document, draft as never);
      }

      return { success: 'Draft saved.' };
    } catch (error) {
      return fail(400, {
        error: error instanceof Error ? error.message : 'Unable to save draft.',
        values: Object.fromEntries(formData)
      });
    }
  },
  publish: async ({ request, params }) => {
    const formData = await request.formData();
    const repository = getCmsRepository();

    try {
      if (params.document === 'settings') {
        await repository.saveSiteSettingsDraft(parseSettingsSnapshot(formData));
        await repository.publishSiteSettings();
      } else if (isDocumentKey(params.document)) {
        const draft =
          params.document === 'home'
            ? parseHomeDocument(formData)
            : params.document === 'vault'
              ? parseVaultDocument(formData)
              : params.document === 'guide'
                ? parseGuideDocument(formData)
                : params.document === 'faq'
                  ? parseFaqDocument(formData)
                  : params.document === 'navigation'
                    ? parseNavigationDocument(formData)
                    : parseFooterDocument(formData);

        await repository.saveSiteDocumentDraft(params.document, draft as never);
        await repository.publishSiteDocument(params.document);
      }

      return { success: 'Changes published.' };
    } catch (error) {
      return fail(400, {
        error: error instanceof Error ? error.message : 'Unable to publish changes.',
        values: Object.fromEntries(formData)
      });
    }
  },
  rollback: async ({ request, params }) => {
    const formData = await request.formData();
    const versionId = String(formData.get('versionId') ?? '');

    try {
      if (params.document === 'settings') {
        await getCmsRepository().rollbackSiteSettings(versionId);
      } else if (isDocumentKey(params.document)) {
        await getCmsRepository().rollbackSiteDocument(params.document, versionId);
      }

      return { success: 'Draft rolled back.' };
    } catch (error) {
      return fail(400, {
        error: error instanceof Error ? error.message : 'Unable to roll back draft.'
      });
    }
  }
};
