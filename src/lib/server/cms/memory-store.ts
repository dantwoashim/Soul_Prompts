import type {
  CatalogPageData,
  DashboardOverview,
  FaqPageData,
  GuidePageData,
  HomePageData,
  PromptListItem,
  PromptRecord,
  PromptSnapshot,
  PromptVersionRecord,
  SiteDocumentContent,
  SiteDocumentKey,
  SiteDocumentRecord,
  SiteDocumentVersionRecord,
  SiteSettingsRecord,
  SiteSettingsSnapshot,
  SiteSettingsVersionRecord,
  SiteShellData,
  VaultPageData,
  VersionKind
} from '$lib/cms/types';
import { buildSeedSnapshot } from './seed';

interface MemoryState extends ReturnType<typeof buildSeedSnapshot> {}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function getState(): MemoryState {
  const globalState = globalThis as typeof globalThis & {
    __soulpromptsCmsState?: MemoryState;
  };

  if (!globalState.__soulpromptsCmsState) {
    globalState.__soulpromptsCmsState = buildSeedSnapshot();
  }

  return globalState.__soulpromptsCmsState;
}

function isoNow() {
  return new Date().toISOString();
}

function versionId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function toPromptListItem(record: PromptRecord, settings: SiteSettingsSnapshot): PromptListItem {
  const source = record.published ?? record.draft;

  return {
    id: record.id,
    slug: source.slug,
    title: source.title,
    tagline: source.tagline,
    overview: source.overview,
    teaser: source.teaser,
    tone: source.tone,
    accessMode: source.accessMode,
    contentRating: source.contentRating,
    region: source.region,
    archetype: source.archetype,
    price: source.price,
    sortOrder: source.sortOrder,
    updatedAt: record.updatedAt,
    publishedAt: record.publishedAt,
    featuredGroups: source.featuredGroups,
    hasPublishedVersion: Boolean(record.published),
    patreonUrl: source.patreonUrlOverride || settings.patreonUrl
  };
}

function changedFields<T extends object>(left: T, right: T) {
  const fields = new Set([...Object.keys(left), ...Object.keys(right)]);
  return [...fields].filter(
    (field) =>
      JSON.stringify(left[field as keyof T]) !== JSON.stringify(right[field as keyof T])
  );
}

function orderPromptItems(items: PromptListItem[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

function getPromptRelated(prompt: PromptSnapshot, settings: SiteSettingsSnapshot) {
  const state = getState();
  return orderPromptItems(
    state.prompts
      .filter((candidate) => candidate.id !== prompt.id && candidate.published)
      .map((candidate) => candidate.published as PromptSnapshot)
      .filter((candidate) => candidate.archetype === prompt.archetype)
      .sort(
        (a, b) =>
          Number(b.contentRating === prompt.contentRating) - Number(a.contentRating === prompt.contentRating)
      )
      .slice(0, 4)
      .map((candidate) =>
        toPromptListItem(
          {
            id: candidate.id,
            createdAt: '',
            updatedAt: '',
            publishedAt: '',
            draft: candidate,
            published: candidate
          },
          settings
        )
      )
  );
}

function addPromptVersion(promptId: string, snapshot: PromptSnapshot, versionKind: VersionKind, note: string) {
  getState().promptVersions.unshift({
    id: versionId('prompt_version'),
    scope: 'prompt',
    promptId,
    versionKind,
    note,
    createdAt: isoNow(),
    snapshot: clone(snapshot)
  });
}

function addDocumentVersion<K extends SiteDocumentKey>(
  documentKey: K,
  snapshot: SiteDocumentContent<K>,
  versionKind: VersionKind,
  note: string
) {
  getState().documentVersions.unshift({
    id: versionId('document_version'),
    scope: 'document',
    documentKey,
    versionKind,
    note,
    createdAt: isoNow(),
    snapshot: clone(snapshot)
  });
}

function addSettingsVersion(snapshot: SiteSettingsSnapshot, versionKind: VersionKind, note: string) {
  getState().settingsVersions.unshift({
    id: versionId('settings_version'),
    scope: 'settings',
    versionKind,
    note,
    createdAt: isoNow(),
    snapshot: clone(snapshot)
  });
}

export class MemoryCmsRepository {
  async getSiteShell(): Promise<SiteShellData> {
    const state = getState();
    return {
      navigation: clone(state.documents.navigation.published ?? state.documents.navigation.draft),
      footer: clone(state.documents.footer.published ?? state.documents.footer.draft),
      settings: clone(state.settings.published ?? state.settings.draft)
    };
  }

  async getDashboardOverview(): Promise<DashboardOverview> {
    const state = getState();
    const settings = state.settings.published ?? state.settings.draft;
    const prompts = orderPromptItems(state.prompts.map((prompt) => toPromptListItem(prompt, settings)));
    const recentPromptUpdates = [...prompts]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);
    const privatePrompts = prompts.filter((prompt) => prompt.accessMode === 'private');
    const brokenPatreonLinks = privatePrompts.filter((prompt) => {
      try {
        if (!prompt.patreonUrl) return true;
        new URL(prompt.patreonUrl, 'https://soulprompts.example.com');
        return false;
      } catch {
        return true;
      }
    }).length;
    const missingSeo = prompts.filter((prompt) => !prompt.title || !prompt.overview).length;
    const missingPromptPreviews = state.prompts.filter((prompt) => !prompt.draft.fullPrompt.trim()).length;
    const documents = [
      ...Object.values(state.documents).map((document) => ({
        key: document.key,
        title: `${document.key[0].toUpperCase()}${document.key.slice(1)} Studio`,
        updatedAt: document.updatedAt,
        publishedAt: document.publishedAt,
        hasDraftChanges: Boolean(document.published && changedFields(document.draft, document.published).length)
      })),
      {
        key: 'settings' as const,
        title: 'Global Settings',
        updatedAt: state.settings.updatedAt,
        publishedAt: state.settings.publishedAt,
        hasDraftChanges: Boolean(
          state.settings.published && changedFields(state.settings.draft, state.settings.published).length
        )
      }
    ];

    return {
      totals: {
        prompts: prompts.length,
        publicPrompts: prompts.filter((prompt) => prompt.accessMode === 'public').length,
        privatePrompts: prompts.filter((prompt) => prompt.accessMode === 'private').length,
        unpublishedDrafts: state.prompts.filter((prompt) => !prompt.published).length,
        brokenPatreonLinks,
        missingSeo,
        missingPromptPreviews
      },
      recentPromptUpdates,
      prompts,
      documents
    };
  }

  async listPromptSummaries(): Promise<PromptListItem[]> {
    const state = getState();
    const settings = state.settings.published ?? state.settings.draft;
    return orderPromptItems(state.prompts.map((prompt) => toPromptListItem(prompt, settings)));
  }

  async getPromptRecord(id: string): Promise<{
    prompt: PromptRecord | null;
    versions: PromptVersionRecord[];
  }> {
    const state = getState();
    return {
      prompt: clone(state.prompts.find((item) => item.id === id) ?? null),
      versions: clone(state.promptVersions.filter((version) => version.promptId === id))
    };
  }

  async createPromptDraft(): Promise<PromptRecord> {
    const state = getState();
    const id = crypto.randomUUID();
    const prompt: PromptRecord = {
      id,
      createdAt: isoNow(),
      updatedAt: isoNow(),
      publishedAt: null,
      draft: {
        id,
        slug: `untitled-${state.prompts.length + 1}`,
        title: 'Untitled Prompt',
        tagline: 'A new prompt still waiting for its public-facing hook.',
        overview: 'Start shaping this prompt in the editor. Draft changes stay private until you publish.',
        teaser: 'Draft teaser pending.',
        audience: 'People who want a cinematic AI Studio scene with a clear voice and fast setup.',
        tone: ['slow burn'],
        accessMode: 'private',
        contentRating: 'sfw',
        patreonUrlOverride: '',
        fullPrompt: '',
        modelNotes: ['Paste into System instructions.', 'Open with a concrete scene.'],
        sampleConversation: [],
        region: 'global',
        archetype: 'romantic',
        price: 0,
        coverImageUrl: '',
        featuredGroups: [],
        sortOrder: state.prompts.length * 10,
        seo: {
          title: 'Untitled Prompt | SoulPrompts',
          description: 'A draft prompt in the SoulPrompts owner dashboard.'
        }
      },
      published: null
    };

    state.prompts.unshift(prompt);
    addPromptVersion(prompt.id, prompt.draft, 'draft', 'Created prompt draft');
    return clone(prompt);
  }

  async savePromptDraft(snapshot: PromptSnapshot): Promise<PromptRecord> {
    const state = getState();
    const prompt = state.prompts.find((item) => item.id === snapshot.id);
    if (!prompt) throw new Error('Prompt not found');

    prompt.draft = clone(snapshot);
    prompt.updatedAt = isoNow();
    addPromptVersion(prompt.id, prompt.draft, 'draft', 'Saved prompt draft');
    return clone(prompt);
  }

  async publishPrompt(id: string): Promise<PromptRecord> {
    const state = getState();
    const prompt = state.prompts.find((item) => item.id === id);
    if (!prompt) throw new Error('Prompt not found');

    prompt.published = clone(prompt.draft);
    prompt.updatedAt = isoNow();
    prompt.publishedAt = isoNow();
    addPromptVersion(prompt.id, prompt.published, 'published', 'Published prompt');
    return clone(prompt);
  }

  async rollbackPrompt(id: string, versionIdToRestore: string): Promise<PromptRecord> {
    const state = getState();
    const prompt = state.prompts.find((item) => item.id === id);
    const version = state.promptVersions.find((item) => item.id === versionIdToRestore && item.promptId === id);
    if (!prompt || !version) throw new Error('Prompt version not found');

    prompt.draft = clone(version.snapshot);
    prompt.updatedAt = isoNow();
    addPromptVersion(prompt.id, prompt.draft, 'rollback', `Rolled back to ${version.createdAt}`);
    return clone(prompt);
  }

  async clonePrompt(id: string): Promise<PromptRecord> {
    const state = getState();
    const prompt = state.prompts.find((item) => item.id === id);
    if (!prompt) throw new Error('Prompt not found');

    const clonedId = crypto.randomUUID();
    const clonedDraft = clone(prompt.draft);
    clonedDraft.id = clonedId;
    clonedDraft.slug = `${clonedDraft.slug}-copy`;
    clonedDraft.title = `${clonedDraft.title} Copy`;
    clonedDraft.featuredGroups = [];

    const cloned: PromptRecord = {
      id: clonedId,
      createdAt: isoNow(),
      updatedAt: isoNow(),
      publishedAt: null,
      draft: clonedDraft,
      published: null
    };

    state.prompts.unshift(cloned);
    addPromptVersion(cloned.id, cloned.draft, 'draft', 'Cloned from existing prompt');
    return clone(cloned);
  }

  async getPublishedHomePage(): Promise<HomePageData> {
    const state = getState();
    const prompts = await this.listPromptSummaries();

    return {
      seo: clone((state.documents.home.published ?? state.documents.home.draft).seo),
      spotlight: prompts.find((prompt) => prompt.featuredGroups.includes('home_spotlight')) ?? prompts[0] ?? null,
      archiveHighlights: prompts
        .filter((prompt) => prompt.featuredGroups.includes('home_featured') || prompt.accessMode === 'public')
        .slice(0, 6),
      memberDrops: prompts
        .filter((prompt) => prompt.featuredGroups.includes('home_member') || prompt.accessMode === 'private')
        .slice(0, 4),
      promptCounts: {
        publicPrompts: prompts.filter((prompt) => prompt.accessMode === 'public').length,
        totalPrompts: prompts.length
      },
      document: clone(state.documents.home.published ?? state.documents.home.draft)
    };
  }

  async getPublishedCatalogPage(): Promise<CatalogPageData> {
    const prompts = await this.listPromptSummaries();
    return {
      seo: {
        title: 'Discover | SoulPrompts',
        description:
          'Browse the SoulPrompts archive of public starter prompts, private member drops, and AI Studio-ready character worlds.'
      },
      featured: prompts.filter((prompt) => prompt.featuredGroups.includes('catalog_flagship')).slice(0, 4),
      prompts
    };
  }

  async getPublishedPromptBySlug(slug: string) {
    const state = getState();
    const settings = state.settings.published ?? state.settings.draft;
    const record = state.prompts.find((prompt) => prompt.published?.slug === slug);
    if (!record?.published) return null;

    const published = clone(record.published);
    const isPrivate = published.accessMode === 'private';
    if (isPrivate) {
      published.fullPrompt = '';
    }

    return {
      seo: clone(published.seo),
      prompt: published,
      isPrivate,
      related: getPromptRelated(record.published, settings),
      patreonUrl: record.published.patreonUrlOverride || settings.patreonUrl,
      aiStudioUrl: settings.aiStudioUrl
    };
  }

  async getPublishedGuidePage(): Promise<GuidePageData> {
    const state = getState();
    return {
      seo: clone((state.documents.guide.published ?? state.documents.guide.draft).seo),
      document: clone(state.documents.guide.published ?? state.documents.guide.draft)
    };
  }

  async getPublishedFaqPage(): Promise<FaqPageData> {
    const state = getState();
    return {
      seo: clone((state.documents.faq.published ?? state.documents.faq.draft).seo),
      document: clone(state.documents.faq.published ?? state.documents.faq.draft)
    };
  }

  async getPublishedVaultPage(): Promise<VaultPageData> {
    const state = getState();
    const settings = state.settings.published ?? state.settings.draft;
    const document = clone(state.documents.vault.published ?? state.documents.vault.draft);
    const prompts = await this.listPromptSummaries();
    const primaryHref = settings.patreonUrl || '/catalog/';

    return {
      seo: clone(document.seo),
      document,
      memberDrops: prompts.filter((prompt) => prompt.accessMode === 'private').slice(0, 4),
      hasWaitlistSignup: Boolean(settings.waitlistEmbedEndpoint),
      primaryHref,
      primaryLabel: settings.patreonUrl ? document.primaryCtaLabel : 'Browse Free Archive'
    };
  }

  async getSiteDocument<K extends SiteDocumentKey>(key: K): Promise<{
    document: SiteDocumentRecord<K>;
    versions: SiteDocumentVersionRecord<K>[];
  }> {
    const state = getState();
    return {
      document: clone(state.documents[key]),
      versions: clone(state.documentVersions.filter((version) => version.documentKey === key)) as SiteDocumentVersionRecord<K>[]
    };
  }

  async saveSiteDocumentDraft<K extends SiteDocumentKey>(key: K, draft: SiteDocumentContent<K>) {
    const state = getState();
    const document = state.documents[key];
    document.draft = clone(draft);
    document.updatedAt = isoNow();
    addDocumentVersion(key, draft, 'draft', `Saved ${key} draft`);
    return clone(document);
  }

  async publishSiteDocument<K extends SiteDocumentKey>(key: K) {
    const state = getState();
    const document = state.documents[key];
    document.published = clone(document.draft);
    document.updatedAt = isoNow();
    document.publishedAt = isoNow();
    addDocumentVersion(key, document.draft, 'published', `Published ${key}`);
    return clone(document);
  }

  async rollbackSiteDocument<K extends SiteDocumentKey>(key: K, versionIdToRestore: string) {
    const state = getState();
    const document = state.documents[key];
    const version = state.documentVersions.find(
      (item) => item.documentKey === key && item.id === versionIdToRestore
    ) as SiteDocumentVersionRecord<K> | undefined;
    if (!version) throw new Error('Document version not found');

    document.draft = clone(version.snapshot);
    document.updatedAt = isoNow();
    addDocumentVersion(key, document.draft, 'rollback', `Rolled back ${key}`);
    return clone(document);
  }

  async getSiteSettings(): Promise<{ settings: SiteSettingsRecord; versions: SiteSettingsVersionRecord[] }> {
    const state = getState();
    return {
      settings: clone(state.settings),
      versions: clone(state.settingsVersions)
    };
  }

  async saveSiteSettingsDraft(draft: SiteSettingsSnapshot) {
    const state = getState();
    state.settings.draft = clone(draft);
    state.settings.updatedAt = isoNow();
    addSettingsVersion(draft, 'draft', 'Saved settings draft');
    return clone(state.settings);
  }

  async publishSiteSettings() {
    const state = getState();
    state.settings.published = clone(state.settings.draft);
    state.settings.updatedAt = isoNow();
    state.settings.publishedAt = isoNow();
    addSettingsVersion(state.settings.draft, 'published', 'Published site settings');
    return clone(state.settings);
  }

  async rollbackSiteSettings(versionIdToRestore: string) {
    const state = getState();
    const version = state.settingsVersions.find((item) => item.id === versionIdToRestore);
    if (!version) throw new Error('Settings version not found');

    state.settings.draft = clone(version.snapshot);
    state.settings.updatedAt = isoNow();
    addSettingsVersion(state.settings.draft, 'rollback', 'Rolled back site settings');
    return clone(state.settings);
  }
}
