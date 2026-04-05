import postgres from 'postgres';
import type {
  CatalogPageData,
  CmsSeedSnapshot,
  DashboardOverview,
  FaqPageData,
  GuidePageData,
  HomePageData,
  PromptListItem,
  PromptPageData,
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
import { siteDocumentKeys } from '$lib/cms/types';
import { MemoryCmsRepository } from './memory-store';
import { buildSeedSnapshot } from './seed';

type SqlClient = ReturnType<typeof postgres>;
type PromptQueryRow = Omit<PromptRecord, 'draft' | 'published'> & {
  draft: PromptSnapshot;
  published: PromptSnapshot | null;
};
type PromptVersionQueryRow = PromptVersionRecord;
type SiteDocumentQueryRow = Omit<SiteDocumentRecord, 'key' | 'draft' | 'published'> & {
  key: SiteDocumentKey;
  draft: SiteDocumentContent;
  published: SiteDocumentContent | null;
};
type SiteDocumentVersionQueryRow = Omit<SiteDocumentVersionRecord, 'documentKey' | 'snapshot'> & {
  documentKey: SiteDocumentKey;
  snapshot: SiteDocumentContent;
};
type SiteSettingsQueryRow = Omit<SiteSettingsRecord, 'draft' | 'published'> & {
  key: 'global';
  draft: SiteSettingsSnapshot;
  published: SiteSettingsSnapshot | null;
};
type SiteSettingsVersionQueryRow = SiteSettingsVersionRecord;
type JsonParameter = Parameters<SqlClient['json']>[0];

function getSqlClient() {
  const connectionString = process.env.CMS_DATABASE_URL;
  if (!connectionString) return null;

  const globalClient = globalThis as typeof globalThis & {
    __soulpromptsCmsSql?: SqlClient;
  };

  if (!globalClient.__soulpromptsCmsSql) {
    globalClient.__soulpromptsCmsSql = postgres(connectionString, {
      ssl: process.env.CMS_DATABASE_SSL === 'disable' ? false : 'require',
      prepare: false
    });
  }

  return globalClient.__soulpromptsCmsSql;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function isoNow() {
  return new Date().toISOString();
}

function versionId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function toJson(value: unknown): JsonParameter {
  return value as JsonParameter;
}

function orderPromptItems(items: PromptListItem[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

function changedFields<T extends object>(left: T, right: T) {
  const fields = new Set([...Object.keys(left), ...Object.keys(right)]);
  return [...fields].filter(
    (field) =>
      JSON.stringify(left[field as keyof T]) !== JSON.stringify(right[field as keyof T])
  );
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

function getPromptRelated(state: CmsSeedSnapshot, prompt: PromptSnapshot, settings: SiteSettingsSnapshot) {
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

function listPromptSummariesFromState(state: CmsSeedSnapshot): PromptListItem[] {
  const settings = state.settings.published ?? state.settings.draft;
  return orderPromptItems(state.prompts.map((prompt) => toPromptListItem(prompt, settings)));
}

function buildSiteShellFromState(state: CmsSeedSnapshot): SiteShellData {
  return {
    navigation: clone(state.documents.navigation.published ?? state.documents.navigation.draft),
    footer: clone(state.documents.footer.published ?? state.documents.footer.draft),
    settings: clone(state.settings.published ?? state.settings.draft)
  };
}

function buildDashboardOverviewFromState(state: CmsSeedSnapshot): DashboardOverview {
  const prompts = listPromptSummariesFromState(state);
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

function buildPublishedHomePageFromState(state: CmsSeedSnapshot): HomePageData {
  const document = clone(state.documents.home.published ?? state.documents.home.draft);
  const prompts = listPromptSummariesFromState(state);

  return {
    seo: clone(document.seo),
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
    document
  };
}

function buildPublishedCatalogPageFromState(state: CmsSeedSnapshot): CatalogPageData {
  const prompts = listPromptSummariesFromState(state);
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

function buildPublishedPromptPageFromState(state: CmsSeedSnapshot, slug: string): PromptPageData | null {
  const settings = state.settings.published ?? state.settings.draft;
  const record = state.prompts.find((prompt) => prompt.published?.slug === slug);
  if (!record?.published) return null;

  const prompt = clone(record.published);
  const isPrivate = prompt.accessMode === 'private';
  if (isPrivate) {
    prompt.fullPrompt = '';
  }

  return {
    seo: clone(prompt.seo),
    prompt,
    isPrivate,
    related: getPromptRelated(state, record.published, settings),
    patreonUrl: record.published.patreonUrlOverride || settings.patreonUrl,
    aiStudioUrl: settings.aiStudioUrl
  };
}

function buildPublishedGuidePageFromState(state: CmsSeedSnapshot): GuidePageData {
  const document = clone(state.documents.guide.published ?? state.documents.guide.draft);
  return {
    seo: clone(document.seo),
    document
  };
}

function buildPublishedFaqPageFromState(state: CmsSeedSnapshot): FaqPageData {
  const document = clone(state.documents.faq.published ?? state.documents.faq.draft);
  return {
    seo: clone(document.seo),
    document
  };
}

function buildPublishedVaultPageFromState(state: CmsSeedSnapshot): VaultPageData {
  const settings = state.settings.published ?? state.settings.draft;
  const document = clone(state.documents.vault.published ?? state.documents.vault.draft);
  const prompts = listPromptSummariesFromState(state);
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

function createPromptVersion(
  promptId: string,
  snapshot: PromptSnapshot,
  versionKind: VersionKind,
  note: string
): PromptVersionRecord {
  return {
    id: versionId('prompt_version'),
    scope: 'prompt',
    promptId,
    versionKind,
    note,
    createdAt: isoNow(),
    snapshot: clone(snapshot)
  };
}

function createDocumentVersion<K extends SiteDocumentKey>(
  documentKey: K,
  snapshot: SiteDocumentContent<K>,
  versionKind: VersionKind,
  note: string
): SiteDocumentVersionRecord<K> {
  return {
    id: versionId('document_version'),
    scope: 'document',
    documentKey,
    versionKind,
    note,
    createdAt: isoNow(),
    snapshot: clone(snapshot)
  };
}

function createSettingsVersion(
  snapshot: SiteSettingsSnapshot,
  versionKind: VersionKind,
  note: string
): SiteSettingsVersionRecord {
  return {
    id: versionId('settings_version'),
    scope: 'settings',
    versionKind,
    note,
    createdAt: isoNow(),
    snapshot: clone(snapshot)
  };
}

function createBlankPromptDraft(existingCount: number): PromptRecord {
  const id = crypto.randomUUID();
  const createdAt = isoNow();

  return {
    id,
    createdAt,
    updatedAt: createdAt,
    publishedAt: null,
    draft: {
      id,
      slug: `untitled-${existingCount + 1}`,
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
      sortOrder: existingCount * 10,
      seo: {
        title: 'Untitled Prompt | SoulPrompts',
        description: 'A draft prompt in the SoulPrompts owner dashboard.'
      }
    },
    published: null
  };
}

function createClonedPrompt(source: PromptRecord, existingSlugs: Set<string>): PromptRecord {
  const clonedId = crypto.randomUUID();
  const clonedDraft = clone(source.draft);
  let candidateSlug = `${clonedDraft.slug}-copy`;
  let suffix = 2;

  while (existingSlugs.has(candidateSlug)) {
    candidateSlug = `${clonedDraft.slug}-copy-${suffix}`;
    suffix += 1;
  }

  clonedDraft.id = clonedId;
  clonedDraft.slug = candidateSlug;
  clonedDraft.title = `${clonedDraft.title} Copy`;
  clonedDraft.featuredGroups = [];

  return {
    id: clonedId,
    createdAt: isoNow(),
    updatedAt: isoNow(),
    publishedAt: null,
    draft: clonedDraft,
    published: null
  };
}

function normalizeDatabaseError(error: unknown): Error {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    String((error as { code?: unknown }).code) === '23505'
  ) {
    return new Error('That slug is already in use. Pick a different slug and try again.');
  }

  return error instanceof Error ? error : new Error('The CMS database request failed.');
}

export class PostgresCmsRepository extends MemoryCmsRepository {
  readonly #sql = getSqlClient();
  #seedPromise: Promise<void> | null = null;
  #stateCache: { loadedAt: number; snapshot: CmsSeedSnapshot } | null = null;

  get enabled() {
    return Boolean(this.#sql);
  }

  #invalidateStateCache() {
    this.#stateCache = null;
  }

  async #ensureSeeded() {
    if (!this.#sql) return;
    if (this.#seedPromise) return this.#seedPromise;

    this.#seedPromise = this.#seedDatabase().finally(() => {
      this.#seedPromise = null;
    });

    return this.#seedPromise;
  }

  async #seedDatabase() {
    if (!this.#sql) return;

    const snapshot = buildSeedSnapshot();

    await this.#sql.begin(async (tx) => {
      const q = tx as unknown as SqlClient;

      for (const prompt of snapshot.prompts) {
        await q`
          insert into prompts (
            id,
            slug,
            created_at,
            updated_at,
            published_at,
            draft_content,
            published_content
          ) values (
            ${prompt.id},
            ${prompt.published?.slug ?? prompt.draft.slug},
            ${prompt.createdAt},
            ${prompt.updatedAt},
            ${prompt.publishedAt},
            ${q.json(toJson(prompt.draft))},
            ${prompt.published ? q.json(toJson(prompt.published)) : null}
          )
          on conflict (id) do nothing
        `;
      }

      for (const version of snapshot.promptVersions) {
        await q`
          insert into prompt_versions (
            id,
            prompt_id,
            version_kind,
            note,
            created_at,
            snapshot
          ) values (
            ${version.id},
            ${version.promptId},
            ${version.versionKind},
            ${version.note},
            ${version.createdAt},
            ${q.json(toJson(version.snapshot))}
          )
          on conflict (id) do nothing
        `;
      }

      for (const key of siteDocumentKeys) {
        const document = snapshot.documents[key];
        await q`
          insert into site_documents (
            key,
            created_at,
            updated_at,
            published_at,
            draft_content,
            published_content
          ) values (
            ${document.key},
            ${document.createdAt},
            ${document.updatedAt},
            ${document.publishedAt},
            ${q.json(toJson(document.draft))},
            ${document.published ? q.json(toJson(document.published)) : null}
          )
          on conflict (key) do nothing
        `;
      }

      for (const version of snapshot.documentVersions) {
        await q`
          insert into site_document_versions (
            id,
            document_key,
            version_kind,
            note,
            created_at,
            snapshot
          ) values (
            ${version.id},
            ${version.documentKey},
            ${version.versionKind},
            ${version.note},
            ${version.createdAt},
            ${q.json(toJson(version.snapshot))}
          )
          on conflict (id) do nothing
        `;
      }

      await q`
        insert into site_settings (
          key,
          created_at,
          updated_at,
          published_at,
          draft_content,
          published_content
        ) values (
          ${snapshot.settings.key},
          ${snapshot.settings.createdAt},
          ${snapshot.settings.updatedAt},
          ${snapshot.settings.publishedAt},
          ${q.json(toJson(snapshot.settings.draft))},
          ${snapshot.settings.published ? q.json(toJson(snapshot.settings.published)) : null}
        )
        on conflict (key) do nothing
      `;

      for (const version of snapshot.settingsVersions) {
        await q`
          insert into site_settings_versions (
            id,
            settings_key,
            version_kind,
            note,
            created_at,
            snapshot
          ) values (
            ${version.id},
            ${snapshot.settings.key},
            ${version.versionKind},
            ${version.note},
            ${version.createdAt},
            ${q.json(toJson(version.snapshot))}
          )
          on conflict (id) do nothing
        `;
      }
    });
  }

  async #fetchPrompts(sql: SqlClient) {
    return sql<PromptQueryRow[]>`
      select
        id,
        created_at as "createdAt",
        updated_at as "updatedAt",
        published_at as "publishedAt",
        draft_content as "draft",
        published_content as "published"
      from prompts
      order by updated_at desc, created_at desc
    `;
  }

  async #fetchPromptById(sql: SqlClient, id: string) {
    const [prompt] = await sql<PromptQueryRow[]>`
      select
        id,
        created_at as "createdAt",
        updated_at as "updatedAt",
        published_at as "publishedAt",
        draft_content as "draft",
        published_content as "published"
      from prompts
      where id = ${id}
      limit 1
    `;

    return prompt ?? null;
  }

  async #fetchPromptVersions(sql: SqlClient) {
    return sql<PromptVersionQueryRow[]>`
      select
        id,
        'prompt' as "scope",
        prompt_id as "promptId",
        version_kind as "versionKind",
        note,
        created_at as "createdAt",
        snapshot
      from prompt_versions
      order by created_at desc
    `;
  }

  async #fetchPromptVersion(sql: SqlClient, promptId: string, versionId: string) {
    const [version] = await sql<PromptVersionQueryRow[]>`
      select
        id,
        'prompt' as "scope",
        prompt_id as "promptId",
        version_kind as "versionKind",
        note,
        created_at as "createdAt",
        snapshot
      from prompt_versions
      where prompt_id = ${promptId} and id = ${versionId}
      limit 1
    `;

    return version ?? null;
  }

  async #fetchSiteDocuments(sql: SqlClient) {
    return sql<SiteDocumentQueryRow[]>`
      select
        key,
        created_at as "createdAt",
        updated_at as "updatedAt",
        published_at as "publishedAt",
        draft_content as "draft",
        published_content as "published"
      from site_documents
      order by created_at asc
    `;
  }

  async #fetchSiteDocumentByKey<K extends SiteDocumentKey>(sql: SqlClient, key: K) {
    const [document] = await sql<SiteDocumentQueryRow[]>`
      select
        key,
        created_at as "createdAt",
        updated_at as "updatedAt",
        published_at as "publishedAt",
        draft_content as "draft",
        published_content as "published"
      from site_documents
      where key = ${key}
      limit 1
    `;

    return (document as SiteDocumentRecord<K> | undefined) ?? null;
  }

  async #fetchSiteDocumentVersions(sql: SqlClient) {
    return sql<SiteDocumentVersionQueryRow[]>`
      select
        id,
        'document' as "scope",
        document_key as "documentKey",
        version_kind as "versionKind",
        note,
        created_at as "createdAt",
        snapshot
      from site_document_versions
      order by created_at desc
    `;
  }

  async #fetchSiteDocumentVersion<K extends SiteDocumentKey>(sql: SqlClient, key: K, versionId: string) {
    const [version] = await sql<SiteDocumentVersionQueryRow[]>`
      select
        id,
        'document' as "scope",
        document_key as "documentKey",
        version_kind as "versionKind",
        note,
        created_at as "createdAt",
        snapshot
      from site_document_versions
      where document_key = ${key} and id = ${versionId}
      limit 1
    `;

    return (version as SiteDocumentVersionRecord<K> | undefined) ?? null;
  }

  async #fetchSiteSettings(sql: SqlClient) {
    const [settings] = await sql<SiteSettingsQueryRow[]>`
      select
        key,
        created_at as "createdAt",
        updated_at as "updatedAt",
        published_at as "publishedAt",
        draft_content as "draft",
        published_content as "published"
      from site_settings
      where key = 'global'
      limit 1
    `;

    return (settings as SiteSettingsRecord | undefined) ?? null;
  }

  async #fetchSiteSettingsVersions(sql: SqlClient) {
    return sql<SiteSettingsVersionQueryRow[]>`
      select
        id,
        'settings' as "scope",
        version_kind as "versionKind",
        note,
        created_at as "createdAt",
        snapshot
      from site_settings_versions
      where settings_key = 'global'
      order by created_at desc
    `;
  }

  async #fetchSiteSettingsVersion(sql: SqlClient, versionId: string) {
    const [version] = await sql<SiteSettingsVersionQueryRow[]>`
      select
        id,
        'settings' as "scope",
        version_kind as "versionKind",
        note,
        created_at as "createdAt",
        snapshot
      from site_settings_versions
      where settings_key = 'global' and id = ${versionId}
      limit 1
    `;

    return version ?? null;
  }

  async #insertPromptVersion(sql: SqlClient, version: PromptVersionRecord) {
    await sql`
      insert into prompt_versions (
        id,
        prompt_id,
        version_kind,
        note,
        created_at,
        snapshot
      ) values (
        ${version.id},
        ${version.promptId},
        ${version.versionKind},
        ${version.note},
        ${version.createdAt},
        ${sql.json(toJson(version.snapshot))}
      )
    `;
  }

  async #insertDocumentVersion<K extends SiteDocumentKey>(sql: SqlClient, version: SiteDocumentVersionRecord<K>) {
    await sql`
      insert into site_document_versions (
        id,
        document_key,
        version_kind,
        note,
        created_at,
        snapshot
      ) values (
        ${version.id},
        ${version.documentKey},
        ${version.versionKind},
        ${version.note},
        ${version.createdAt},
        ${sql.json(toJson(version.snapshot))}
      )
    `;
  }

  async #insertSettingsVersion(sql: SqlClient, version: SiteSettingsVersionRecord) {
    await sql`
      insert into site_settings_versions (
        id,
        settings_key,
        version_kind,
        note,
        created_at,
        snapshot
      ) values (
        ${version.id},
        ${'global'},
        ${version.versionKind},
        ${version.note},
        ${version.createdAt},
        ${sql.json(toJson(version.snapshot))}
      )
    `;
  }

  async #loadState(): Promise<CmsSeedSnapshot> {
    if (!this.#sql) {
      return buildSeedSnapshot();
    }

    if (this.#stateCache && Date.now() - this.#stateCache.loadedAt < 1000) {
      return clone(this.#stateCache.snapshot);
    }

    await this.#ensureSeeded();

    const [prompts, promptVersions, siteDocuments, documentVersions, siteSettings, settingsVersions] =
      await Promise.all([
        this.#fetchPrompts(this.#sql),
        this.#fetchPromptVersions(this.#sql),
        this.#fetchSiteDocuments(this.#sql),
        this.#fetchSiteDocumentVersions(this.#sql),
        this.#fetchSiteSettings(this.#sql),
        this.#fetchSiteSettingsVersions(this.#sql)
      ]);

    const seed = buildSeedSnapshot();
    const documents = clone(seed.documents);

    for (const document of siteDocuments) {
      documents[document.key] = document as never;
    }

    const snapshot: CmsSeedSnapshot = {
      prompts: prompts as PromptRecord[],
      promptVersions: promptVersions as PromptVersionRecord[],
      documents,
      documentVersions: documentVersions as SiteDocumentVersionRecord[],
      settings: clone(siteSettings ?? seed.settings),
      settingsVersions: settingsVersions as SiteSettingsVersionRecord[]
    };

    this.#stateCache = {
      loadedAt: Date.now(),
      snapshot
    };

    return clone(snapshot);
  }

  async getSiteShell(): Promise<SiteShellData> {
    if (!this.#sql) return super.getSiteShell();
    return buildSiteShellFromState(await this.#loadState());
  }

  async getDashboardOverview(): Promise<DashboardOverview> {
    if (!this.#sql) return super.getDashboardOverview();
    return buildDashboardOverviewFromState(await this.#loadState());
  }

  async listPromptSummaries() {
    if (!this.#sql) return super.listPromptSummaries();
    return listPromptSummariesFromState(await this.#loadState());
  }

  async getPromptRecord(id: string): Promise<{ prompt: PromptRecord | null; versions: PromptVersionRecord[] }> {
    if (!this.#sql) return super.getPromptRecord(id);

    const state = await this.#loadState();
    return {
      prompt: clone(state.prompts.find((item) => item.id === id) ?? null),
      versions: clone(state.promptVersions.filter((version) => version.promptId === id))
    };
  }

  async createPromptDraft() {
    if (!this.#sql) return super.createPromptDraft();

    try {
      const state = await this.#loadState();
      const prompt = createBlankPromptDraft(state.prompts.length);
      const version = createPromptVersion(prompt.id, prompt.draft, 'draft', 'Created prompt draft');

      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;

        await q`
          insert into prompts (
            id,
            slug,
            created_at,
            updated_at,
            published_at,
            draft_content,
            published_content
          ) values (
            ${prompt.id},
            ${prompt.draft.slug},
            ${prompt.createdAt},
            ${prompt.updatedAt},
            ${prompt.publishedAt},
            ${q.json(toJson(prompt.draft))},
            ${null}
          )
        `;
        await this.#insertPromptVersion(q, version);
      });

      this.#invalidateStateCache();
      return prompt;
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async savePromptDraft(snapshot: PromptSnapshot) {
    if (!this.#sql) return super.savePromptDraft(snapshot);

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const prompt = await this.#fetchPromptById(q, snapshot.id);
        if (!prompt) throw new Error('Prompt not found');

        const version = createPromptVersion(prompt.id, snapshot, 'draft', 'Saved prompt draft');
        const publicSlug = prompt.published?.slug ?? snapshot.slug;

        await q`
          update prompts
          set
            slug = ${publicSlug},
            updated_at = ${version.createdAt},
            draft_content = ${q.json(toJson(snapshot))}
          where id = ${snapshot.id}
        `;
        await this.#insertPromptVersion(q, version);
      });

      this.#invalidateStateCache();
      const result = await this.getPromptRecord(snapshot.id);
      if (!result.prompt) throw new Error('Prompt not found');
      return result.prompt;
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async publishPrompt(id: string) {
    if (!this.#sql) return super.publishPrompt(id);

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const prompt = await this.#fetchPromptById(q, id);
        if (!prompt) throw new Error('Prompt not found');

        const publishedAt = isoNow();
        const version: PromptVersionRecord = {
          id: versionId('prompt_version'),
          scope: 'prompt',
          promptId: id,
          versionKind: 'published',
          note: 'Published prompt',
          createdAt: publishedAt,
          snapshot: clone(prompt.draft)
        };

        await q`
          update prompts
          set
            slug = ${prompt.draft.slug},
            updated_at = ${publishedAt},
            published_at = ${publishedAt},
            published_content = ${q.json(toJson(prompt.draft))}
          where id = ${id}
        `;
        await this.#insertPromptVersion(q, version);
      });

      this.#invalidateStateCache();
      const result = await this.getPromptRecord(id);
      if (!result.prompt) throw new Error('Prompt not found');
      return result.prompt;
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async rollbackPrompt(id: string, versionIdToRestore: string) {
    if (!this.#sql) return super.rollbackPrompt(id, versionIdToRestore);

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const prompt = await this.#fetchPromptById(q, id);
        const version = await this.#fetchPromptVersion(q, id, versionIdToRestore);
        if (!prompt || !version) throw new Error('Prompt version not found');

        const rollbackVersion = createPromptVersion(
          id,
          version.snapshot,
          'rollback',
          `Rolled back to ${version.createdAt}`
        );
        const publicSlug = prompt.published?.slug ?? version.snapshot.slug;

        await q`
          update prompts
          set
            slug = ${publicSlug},
            updated_at = ${rollbackVersion.createdAt},
            draft_content = ${q.json(toJson(version.snapshot))}
          where id = ${id}
        `;
        await this.#insertPromptVersion(q, rollbackVersion);
      });

      this.#invalidateStateCache();
      const result = await this.getPromptRecord(id);
      if (!result.prompt) throw new Error('Prompt not found');
      return result.prompt;
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async clonePrompt(id: string) {
    if (!this.#sql) return super.clonePrompt(id);

    try {
      const state = await this.#loadState();
      const prompt = state.prompts.find((item) => item.id === id);
      if (!prompt) throw new Error('Prompt not found');

      const existingSlugs = new Set(
        state.prompts.flatMap((item) => [item.draft.slug, item.published?.slug].filter(Boolean) as string[])
      );
      const cloned = createClonedPrompt(prompt, existingSlugs);
      const version = createPromptVersion(cloned.id, cloned.draft, 'draft', 'Cloned from existing prompt');

      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;

        await q`
          insert into prompts (
            id,
            slug,
            created_at,
            updated_at,
            published_at,
            draft_content,
            published_content
          ) values (
            ${cloned.id},
            ${cloned.draft.slug},
            ${cloned.createdAt},
            ${cloned.updatedAt},
            ${cloned.publishedAt},
            ${q.json(toJson(cloned.draft))},
            ${null}
          )
        `;
        await this.#insertPromptVersion(q, version);
      });

      this.#invalidateStateCache();
      return cloned;
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async getPublishedHomePage(): Promise<HomePageData> {
    if (!this.#sql) return super.getPublishedHomePage();
    return buildPublishedHomePageFromState(await this.#loadState());
  }

  async getPublishedCatalogPage(): Promise<CatalogPageData> {
    if (!this.#sql) return super.getPublishedCatalogPage();
    return buildPublishedCatalogPageFromState(await this.#loadState());
  }

  async getPublishedPromptBySlug(slug: string) {
    if (!this.#sql) return super.getPublishedPromptBySlug(slug);
    return buildPublishedPromptPageFromState(await this.#loadState(), slug);
  }

  async getPublishedGuidePage(): Promise<GuidePageData> {
    if (!this.#sql) return super.getPublishedGuidePage();
    return buildPublishedGuidePageFromState(await this.#loadState());
  }

  async getPublishedFaqPage(): Promise<FaqPageData> {
    if (!this.#sql) return super.getPublishedFaqPage();
    return buildPublishedFaqPageFromState(await this.#loadState());
  }

  async getPublishedVaultPage(): Promise<VaultPageData> {
    if (!this.#sql) return super.getPublishedVaultPage();
    return buildPublishedVaultPageFromState(await this.#loadState());
  }

  async getSiteDocument<K extends SiteDocumentKey>(key: K): Promise<{
    document: SiteDocumentRecord<K>;
    versions: SiteDocumentVersionRecord<K>[];
  }> {
    if (!this.#sql) return super.getSiteDocument(key);

    const state = await this.#loadState();
    return {
      document: clone(state.documents[key]),
      versions: clone(state.documentVersions.filter((version) => version.documentKey === key)) as SiteDocumentVersionRecord<K>[]
    };
  }

  async saveSiteDocumentDraft<K extends SiteDocumentKey>(
    key: K,
    draft: SiteDocumentContent<K>
  ): Promise<CmsSeedSnapshot['documents'][K]> {
    if (!this.#sql) return super.saveSiteDocumentDraft(key, draft);

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const document = await this.#fetchSiteDocumentByKey(q, key);
        if (!document) throw new Error('Document not found');

        const version = createDocumentVersion(key, draft, 'draft', `Saved ${key} draft`);

        await q`
          update site_documents
          set
            updated_at = ${version.createdAt},
            draft_content = ${q.json(toJson(draft))}
          where key = ${key}
        `;
        await this.#insertDocumentVersion(q, version);
      });

      this.#invalidateStateCache();
      const result = await this.getSiteDocument(key);
      return result.document as CmsSeedSnapshot['documents'][K];
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async publishSiteDocument<K extends SiteDocumentKey>(
    key: K
  ): Promise<CmsSeedSnapshot['documents'][K]> {
    if (!this.#sql) return super.publishSiteDocument(key);

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const document = await this.#fetchSiteDocumentByKey(q, key);
        if (!document) throw new Error('Document not found');

        const publishedAt = isoNow();
        const version = createDocumentVersion(key, document.draft, 'published', `Published ${key}`);

        await q`
          update site_documents
          set
            updated_at = ${publishedAt},
            published_at = ${publishedAt},
            published_content = ${q.json(toJson(document.draft))}
          where key = ${key}
        `;
        await this.#insertDocumentVersion(q, {
          ...version,
          createdAt: publishedAt
        });
      });

      this.#invalidateStateCache();
      const result = await this.getSiteDocument(key);
      return result.document as CmsSeedSnapshot['documents'][K];
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async rollbackSiteDocument<K extends SiteDocumentKey>(
    key: K,
    versionIdToRestore: string
  ): Promise<CmsSeedSnapshot['documents'][K]> {
    if (!this.#sql) return super.rollbackSiteDocument(key, versionIdToRestore);

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const document = await this.#fetchSiteDocumentByKey(q, key);
        const version = await this.#fetchSiteDocumentVersion(q, key, versionIdToRestore);
        if (!document || !version) throw new Error('Document version not found');

        const rollbackVersion = createDocumentVersion(key, version.snapshot, 'rollback', `Rolled back ${key}`);

        await q`
          update site_documents
          set
            updated_at = ${rollbackVersion.createdAt},
            draft_content = ${q.json(toJson(version.snapshot))}
          where key = ${key}
        `;
        await this.#insertDocumentVersion(q, rollbackVersion);
      });

      this.#invalidateStateCache();
      const result = await this.getSiteDocument(key);
      return result.document as CmsSeedSnapshot['documents'][K];
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async getSiteSettings(): Promise<{ settings: SiteSettingsRecord; versions: SiteSettingsVersionRecord[] }> {
    if (!this.#sql) return super.getSiteSettings();

    const state = await this.#loadState();
    return {
      settings: clone(state.settings),
      versions: clone(state.settingsVersions)
    };
  }

  async saveSiteSettingsDraft(draft: SiteSettingsSnapshot) {
    if (!this.#sql) return super.saveSiteSettingsDraft(draft);

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const settings = await this.#fetchSiteSettings(q);
        if (!settings) throw new Error('Site settings not found');

        const version = createSettingsVersion(draft, 'draft', 'Saved settings draft');

        await q`
          update site_settings
          set
            updated_at = ${version.createdAt},
            draft_content = ${q.json(toJson(draft))}
          where key = 'global'
        `;
        await this.#insertSettingsVersion(q, version);
      });

      this.#invalidateStateCache();
      const result = await this.getSiteSettings();
      return result.settings;
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async publishSiteSettings() {
    if (!this.#sql) return super.publishSiteSettings();

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const settings = await this.#fetchSiteSettings(q);
        if (!settings) throw new Error('Site settings not found');

        const publishedAt = isoNow();
        const version: SiteSettingsVersionRecord = {
          id: versionId('settings_version'),
          scope: 'settings',
          versionKind: 'published',
          note: 'Published site settings',
          createdAt: publishedAt,
          snapshot: clone(settings.draft)
        };

        await q`
          update site_settings
          set
            updated_at = ${publishedAt},
            published_at = ${publishedAt},
            published_content = ${q.json(toJson(settings.draft))}
          where key = 'global'
        `;
        await this.#insertSettingsVersion(q, version);
      });

      this.#invalidateStateCache();
      const result = await this.getSiteSettings();
      return result.settings;
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }

  async rollbackSiteSettings(versionIdToRestore: string) {
    if (!this.#sql) return super.rollbackSiteSettings(versionIdToRestore);

    try {
      await this.#sql.begin(async (tx) => {
        const q = tx as unknown as SqlClient;
        const settings = await this.#fetchSiteSettings(q);
        const version = await this.#fetchSiteSettingsVersion(q, versionIdToRestore);
        if (!settings || !version) throw new Error('Settings version not found');

        const rollbackVersion = createSettingsVersion(version.snapshot, 'rollback', 'Rolled back site settings');

        await q`
          update site_settings
          set
            updated_at = ${rollbackVersion.createdAt},
            draft_content = ${q.json(toJson(version.snapshot))}
          where key = 'global'
        `;
        await this.#insertSettingsVersion(q, rollbackVersion);
      });

      this.#invalidateStateCache();
      const result = await this.getSiteSettings();
      return result.settings;
    } catch (error) {
      throw normalizeDatabaseError(error);
    }
  }
}
