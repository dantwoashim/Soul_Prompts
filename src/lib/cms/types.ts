export const siteDocumentKeys = [
  'home',
  'vault',
  'guide',
  'faq',
  'navigation',
  'footer'
] as const;

export type SiteDocumentKey = (typeof siteDocumentKeys)[number];
export type AccessMode = 'public' | 'private';
export type ContentRating = 'sfw' | 'nsfw';
export type VersionKind = 'seed' | 'draft' | 'published' | 'rollback';

export interface SeoContent {
  title: string;
  description: string;
  image?: string;
}

export interface SampleLine {
  speaker: 'user' | 'character';
  text: string;
}

export interface PromptSnapshot {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  teaser: string;
  audience: string;
  tone: string[];
  accessMode: AccessMode;
  contentRating: ContentRating;
  patreonUrlOverride: string;
  fullPrompt: string;
  modelNotes: string[];
  sampleConversation: SampleLine[];
  region: string;
  archetype: string;
  price: number;
  coverImageUrl: string;
  featuredGroups: string[];
  sortOrder: number;
  seo: SeoContent;
}

export interface PromptRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  draft: PromptSnapshot;
  published: PromptSnapshot | null;
}

export interface PromptVersionRecord {
  id: string;
  scope: 'prompt';
  promptId: string;
  versionKind: VersionKind;
  note: string;
  createdAt: string;
  snapshot: PromptSnapshot;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HomeDocument {
  seo: SeoContent;
  heroBadge: string;
  heroTitle: string;
  heroBody: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  tutorialEyebrow: string;
  tutorialTitle: string;
  tutorialBody: string;
  startFreeEyebrow: string;
  startFreeTitle: string;
  startFreeCtaLabel: string;
  whyEyebrow: string;
  whyTitle: string;
  membershipEyebrow: string;
  membershipTitle: string;
  membershipBody: string;
  membershipCtaLabel: string;
  featureCards: Array<{
    title: string;
    description: string;
  }>;
}

export interface VaultDocument {
  seo: SeoContent;
  eyebrow: string;
  title: string;
  body: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  membershipHighlights: Array<{
    label: string;
    body: string;
  }>;
  memberIncludes: Array<{
    title: string;
    body: string;
  }>;
  releaseFlow: string[];
  dropExtras: string[];
  finalTitle: string;
  finalBody: string;
}

export interface GuideDocument {
  seo: SeoContent;
  eyebrow: string;
  title: string;
  body: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  quickRuleTitle: string;
  quickRuleBody: string;
  steps: Array<{
    id: string;
    title: string;
    summary: string;
    image: string;
  }>;
  copyTitle: string;
  copyBody: string;
  openTitle: string;
  starterMessages: string[];
  quickTipsTitle: string;
  quickTips: string[];
}

export interface FaqDocument {
  seo: SeoContent;
  eyebrow: string;
  title: string;
  intro: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface NavigationDocument {
  brandName: string;
  brandTagline: string;
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  mobileLinks: Array<NavLink & { icon: string }>;
}

export interface FooterDocument {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  links: NavLink[];
}

export interface SiteSettingsSnapshot {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  siteUrl: string;
  patreonUrl: string;
  aiStudioUrl: string;
  waitlistEmbedEndpoint: string;
  plausibleDomain: string;
  plausibleSrc: string;
  socialImageUrl: string;
}

export interface SiteDocumentContentMap {
  home: HomeDocument;
  vault: VaultDocument;
  guide: GuideDocument;
  faq: FaqDocument;
  navigation: NavigationDocument;
  footer: FooterDocument;
}

export type SiteDocumentContent<K extends SiteDocumentKey = SiteDocumentKey> = SiteDocumentContentMap[K];

export interface SiteDocumentRecord<K extends SiteDocumentKey = SiteDocumentKey> {
  key: K;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  draft: SiteDocumentContent<K>;
  published: SiteDocumentContent<K> | null;
}

export interface SiteDocumentVersionRecord<K extends SiteDocumentKey = SiteDocumentKey> {
  id: string;
  scope: 'document';
  documentKey: K;
  versionKind: VersionKind;
  note: string;
  createdAt: string;
  snapshot: SiteDocumentContent<K>;
}

export interface SiteSettingsRecord {
  key: 'global';
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  draft: SiteSettingsSnapshot;
  published: SiteSettingsSnapshot | null;
}

export interface SiteSettingsVersionRecord {
  id: string;
  scope: 'settings';
  versionKind: VersionKind;
  note: string;
  createdAt: string;
  snapshot: SiteSettingsSnapshot;
}

export interface PromptListItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  teaser: string;
  tone: string[];
  accessMode: AccessMode;
  contentRating: ContentRating;
  region: string;
  archetype: string;
  price: number;
  sortOrder: number;
  updatedAt: string;
  publishedAt: string | null;
  featuredGroups: string[];
  hasPublishedVersion: boolean;
  patreonUrl: string;
}

export interface DashboardOverview {
  totals: {
    prompts: number;
    publicPrompts: number;
    privatePrompts: number;
    unpublishedDrafts: number;
    brokenPatreonLinks: number;
    missingSeo: number;
    missingPromptPreviews: number;
  };
  recentPromptUpdates: PromptListItem[];
  prompts: PromptListItem[];
  documents: Array<{
    key: SiteDocumentKey | 'settings';
    title: string;
    updatedAt: string;
    publishedAt: string | null;
    hasDraftChanges: boolean;
  }>;
}

export interface HomePageData {
  seo: SeoContent;
  spotlight: PromptListItem | null;
  archiveHighlights: PromptListItem[];
  memberDrops: PromptListItem[];
  promptCounts: {
    publicPrompts: number;
    totalPrompts: number;
  };
  document: HomeDocument;
}

export interface CatalogPageData {
  seo: SeoContent;
  featured: PromptListItem[];
  prompts: PromptListItem[];
}

export interface PromptPageData {
  seo: SeoContent;
  prompt: PromptSnapshot;
  isPrivate: boolean;
  related: PromptListItem[];
  patreonUrl: string;
  aiStudioUrl: string;
}

export interface GuidePageData {
  seo: SeoContent;
  document: GuideDocument;
}

export interface FaqPageData {
  seo: SeoContent;
  document: FaqDocument;
}

export interface VaultPageData {
  seo: SeoContent;
  document: VaultDocument;
  memberDrops: PromptListItem[];
  hasWaitlistSignup: boolean;
  primaryHref: string;
  primaryLabel: string;
}

export interface SiteShellData {
  navigation: NavigationDocument;
  footer: FooterDocument;
  settings: SiteSettingsSnapshot;
}

export interface CmsSeedSnapshot {
  prompts: PromptRecord[];
  promptVersions: PromptVersionRecord[];
  documents: {
    [K in SiteDocumentKey]: SiteDocumentRecord<K>;
  };
  documentVersions: SiteDocumentVersionRecord[];
  settings: SiteSettingsRecord;
  settingsVersions: SiteSettingsVersionRecord[];
}
