import type {
  FooterDocument,
  FaqDocument,
  GuideDocument,
  HomeDocument,
  NavigationDocument,
  PromptSnapshot,
  SiteDocumentKey,
  SiteSettingsSnapshot,
  VaultDocument
} from './types';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function joinLines(values: string[]): string {
  return values.join('\n');
}

export function serializeTone(values: string[]): string {
  return values.join(', ');
}

export function serializeSampleConversation(snapshot: PromptSnapshot): string {
  return snapshot.sampleConversation.map((line) => `${line.speaker} | ${line.text}`).join('\n');
}

export function serializeLinkList(values: Array<{ label: string; href: string }>): string {
  return values.map((value) => `${value.label} | ${value.href}`).join('\n');
}

export function serializeMobileLinkList(values: NavigationDocument['mobileLinks']): string {
  return values.map((value) => `${value.icon} | ${value.label} | ${value.href}`).join('\n');
}

export function serializeFeatureCards(values: HomeDocument['featureCards']): string {
  return values.map((value) => `${value.title} | ${value.description}`).join('\n');
}

export function serializeKeyBodyPairs(
  values: Array<{ label?: string; title?: string; body: string }>
): string {
  return values
    .map((value) => `${value.label ?? value.title ?? ''} | ${value.body}`)
    .join('\n');
}

export function serializeGuideSteps(values: GuideDocument['steps']): string {
  return values.map((value) => `${value.id} | ${value.title} | ${value.summary} | ${value.image}`).join('\n');
}

export function serializeFaqItems(values: FaqDocument['items']): string {
  return values.map((value) => `${value.question} | ${value.answer}`).join('\n');
}

export function serializePromptForm(snapshot: PromptSnapshot) {
  return {
    title: snapshot.title,
    slug: snapshot.slug,
    tagline: snapshot.tagline,
    overview: snapshot.overview,
    teaser: snapshot.teaser,
    audience: snapshot.audience,
    toneInput: serializeTone(snapshot.tone),
    accessMode: snapshot.accessMode,
    contentRating: snapshot.contentRating,
    patreonUrlOverride: snapshot.patreonUrlOverride,
    fullPrompt: snapshot.fullPrompt,
    modelNotesInput: joinLines(snapshot.modelNotes),
    sampleConversationInput: serializeSampleConversation(snapshot),
    region: snapshot.region,
    archetype: snapshot.archetype,
    price: String(snapshot.price),
    coverImageUrl: snapshot.coverImageUrl,
    featuredGroupsInput: joinLines(snapshot.featuredGroups),
    sortOrder: String(snapshot.sortOrder),
    seoTitle: snapshot.seo.title,
    seoDescription: snapshot.seo.description
  };
}

export function serializeSettingsForm(settings: SiteSettingsSnapshot) {
  return {
    siteName: settings.siteName,
    siteTagline: settings.siteTagline,
    siteDescription: settings.siteDescription,
    siteUrl: settings.siteUrl,
    patreonUrl: settings.patreonUrl,
    aiStudioUrl: settings.aiStudioUrl,
    waitlistEmbedEndpoint: settings.waitlistEmbedEndpoint,
    plausibleDomain: settings.plausibleDomain,
    plausibleSrc: settings.plausibleSrc,
    socialImageUrl: settings.socialImageUrl
  };
}

export function serializeHomeDocumentForm(document: HomeDocument) {
  return {
    seoTitle: document.seo.title,
    seoDescription: document.seo.description,
    heroBadge: document.heroBadge,
    heroTitle: document.heroTitle,
    heroBody: document.heroBody,
    primaryCtaLabel: document.primaryCtaLabel,
    primaryCtaHref: document.primaryCtaHref,
    secondaryCtaLabel: document.secondaryCtaLabel,
    secondaryCtaHref: document.secondaryCtaHref,
    tutorialEyebrow: document.tutorialEyebrow,
    tutorialTitle: document.tutorialTitle,
    tutorialBody: document.tutorialBody,
    startFreeEyebrow: document.startFreeEyebrow,
    startFreeTitle: document.startFreeTitle,
    startFreeCtaLabel: document.startFreeCtaLabel,
    whyEyebrow: document.whyEyebrow,
    whyTitle: document.whyTitle,
    membershipEyebrow: document.membershipEyebrow,
    membershipTitle: document.membershipTitle,
    membershipBody: document.membershipBody,
    membershipCtaLabel: document.membershipCtaLabel,
    featureCardsInput: serializeFeatureCards(document.featureCards)
  };
}

export function serializeVaultDocumentForm(document: VaultDocument) {
  return {
    seoTitle: document.seo.title,
    seoDescription: document.seo.description,
    eyebrow: document.eyebrow,
    title: document.title,
    body: document.body,
    primaryCtaLabel: document.primaryCtaLabel,
    secondaryCtaLabel: document.secondaryCtaLabel,
    membershipHighlightsInput: serializeKeyBodyPairs(document.membershipHighlights),
    memberIncludesInput: serializeKeyBodyPairs(document.memberIncludes),
    releaseFlowInput: joinLines(document.releaseFlow),
    dropExtrasInput: joinLines(document.dropExtras),
    finalTitle: document.finalTitle,
    finalBody: document.finalBody
  };
}

export function serializeGuideDocumentForm(document: GuideDocument) {
  return {
    seoTitle: document.seo.title,
    seoDescription: document.seo.description,
    eyebrow: document.eyebrow,
    title: document.title,
    body: document.body,
    primaryCtaLabel: document.primaryCtaLabel,
    primaryCtaHref: document.primaryCtaHref,
    secondaryCtaLabel: document.secondaryCtaLabel,
    secondaryCtaHref: document.secondaryCtaHref,
    quickRuleTitle: document.quickRuleTitle,
    quickRuleBody: document.quickRuleBody,
    stepsInput: serializeGuideSteps(document.steps),
    copyTitle: document.copyTitle,
    copyBody: document.copyBody,
    openTitle: document.openTitle,
    starterMessagesInput: joinLines(document.starterMessages),
    quickTipsTitle: document.quickTipsTitle,
    quickTipsInput: joinLines(document.quickTips)
  };
}

export function serializeFaqDocumentForm(document: FaqDocument) {
  return {
    seoTitle: document.seo.title,
    seoDescription: document.seo.description,
    eyebrow: document.eyebrow,
    title: document.title,
    intro: document.intro,
    itemsInput: serializeFaqItems(document.items)
  };
}

export function serializeNavigationDocumentForm(document: NavigationDocument) {
  return {
    brandName: document.brandName,
    brandTagline: document.brandTagline,
    ctaLabel: document.ctaLabel,
    ctaHref: document.ctaHref,
    linksInput: serializeLinkList(document.links),
    mobileLinksInput: serializeMobileLinkList(document.mobileLinks)
  };
}

export function serializeFooterDocumentForm(document: FooterDocument) {
  return {
    eyebrow: document.eyebrow,
    title: document.title,
    body: document.body,
    ctaLabel: document.ctaLabel,
    ctaHref: document.ctaHref,
    linksInput: serializeLinkList(document.links)
  };
}

export function isDocumentKey(value: string): value is SiteDocumentKey {
  return ['home', 'vault', 'guide', 'faq', 'navigation', 'footer'].includes(value);
}
