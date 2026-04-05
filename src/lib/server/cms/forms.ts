import { promptSnapshotSchema, siteSettingsSchema } from '$lib/cms/schemas';
import type {
  FaqDocument,
  FooterDocument,
  GuideDocument,
  HomeDocument,
  NavigationDocument,
  PromptSnapshot,
  SiteSettingsSnapshot,
  VaultDocument
} from '$lib/cms/types';
import { slugify } from '$lib/cms/admin';

function value(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

function lines(formData: FormData, key: string): string[] {
  return value(formData, key)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function pipePairs(formData: FormData, key: string) {
  return lines(formData, key).map((line) => line.split('|').map((part) => part.trim()));
}

export function parsePromptSnapshot(formData: FormData, id: string): PromptSnapshot {
  const title = value(formData, 'title');
  const snapshot = {
    id,
    slug: slugify(value(formData, 'slug') || title),
    title,
    tagline: value(formData, 'tagline'),
    overview: value(formData, 'overview'),
    teaser: value(formData, 'teaser'),
    audience: value(formData, 'audience'),
    tone: value(formData, 'toneInput')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    accessMode: value(formData, 'accessMode'),
    contentRating: value(formData, 'contentRating'),
    patreonUrlOverride: value(formData, 'patreonUrlOverride'),
    fullPrompt: String(formData.get('fullPrompt') ?? ''),
    modelNotes: lines(formData, 'modelNotesInput'),
    sampleConversation: pipePairs(formData, 'sampleConversationInput').map(([speaker, text]) => ({
      speaker: (speaker === 'user' ? 'user' : 'character') as 'user' | 'character',
      text: text ?? ''
    })),
    region: value(formData, 'region'),
    archetype: value(formData, 'archetype'),
    price: Number(value(formData, 'price') || '0'),
    coverImageUrl: value(formData, 'coverImageUrl'),
    featuredGroups: lines(formData, 'featuredGroupsInput'),
    sortOrder: Number(value(formData, 'sortOrder') || '0'),
    seo: {
      title: value(formData, 'seoTitle'),
      description: value(formData, 'seoDescription')
    }
  };

  return promptSnapshotSchema.parse(snapshot);
}

export function parseSettingsSnapshot(formData: FormData): SiteSettingsSnapshot {
  return siteSettingsSchema.parse({
    siteName: value(formData, 'siteName'),
    siteTagline: value(formData, 'siteTagline'),
    siteDescription: value(formData, 'siteDescription'),
    siteUrl: value(formData, 'siteUrl'),
    patreonUrl: value(formData, 'patreonUrl'),
    aiStudioUrl: value(formData, 'aiStudioUrl'),
    waitlistEmbedEndpoint: value(formData, 'waitlistEmbedEndpoint'),
    plausibleDomain: value(formData, 'plausibleDomain'),
    plausibleSrc: value(formData, 'plausibleSrc'),
    socialImageUrl: value(formData, 'socialImageUrl')
  });
}

export function parseHomeDocument(formData: FormData): HomeDocument {
  return {
    seo: {
      title: value(formData, 'seoTitle'),
      description: value(formData, 'seoDescription')
    },
    heroBadge: value(formData, 'heroBadge'),
    heroTitle: value(formData, 'heroTitle'),
    heroBody: value(formData, 'heroBody'),
    primaryCtaLabel: value(formData, 'primaryCtaLabel'),
    primaryCtaHref: value(formData, 'primaryCtaHref'),
    secondaryCtaLabel: value(formData, 'secondaryCtaLabel'),
    secondaryCtaHref: value(formData, 'secondaryCtaHref'),
    tutorialEyebrow: value(formData, 'tutorialEyebrow'),
    tutorialTitle: value(formData, 'tutorialTitle'),
    tutorialBody: value(formData, 'tutorialBody'),
    startFreeEyebrow: value(formData, 'startFreeEyebrow'),
    startFreeTitle: value(formData, 'startFreeTitle'),
    startFreeCtaLabel: value(formData, 'startFreeCtaLabel'),
    whyEyebrow: value(formData, 'whyEyebrow'),
    whyTitle: value(formData, 'whyTitle'),
    membershipEyebrow: value(formData, 'membershipEyebrow'),
    membershipTitle: value(formData, 'membershipTitle'),
    membershipBody: value(formData, 'membershipBody'),
    membershipCtaLabel: value(formData, 'membershipCtaLabel'),
    featureCards: pipePairs(formData, 'featureCardsInput').map(([title, description]) => ({
      title: title ?? '',
      description: description ?? ''
    }))
  };
}

export function parseVaultDocument(formData: FormData): VaultDocument {
  return {
    seo: {
      title: value(formData, 'seoTitle'),
      description: value(formData, 'seoDescription')
    },
    eyebrow: value(formData, 'eyebrow'),
    title: value(formData, 'title'),
    body: value(formData, 'body'),
    primaryCtaLabel: value(formData, 'primaryCtaLabel'),
    secondaryCtaLabel: value(formData, 'secondaryCtaLabel'),
    membershipHighlights: pipePairs(formData, 'membershipHighlightsInput').map(([label, body]) => ({
      label: label ?? '',
      body: body ?? ''
    })),
    memberIncludes: pipePairs(formData, 'memberIncludesInput').map(([title, body]) => ({
      title: title ?? '',
      body: body ?? ''
    })),
    releaseFlow: lines(formData, 'releaseFlowInput'),
    dropExtras: lines(formData, 'dropExtrasInput'),
    finalTitle: value(formData, 'finalTitle'),
    finalBody: value(formData, 'finalBody')
  };
}

export function parseGuideDocument(formData: FormData): GuideDocument {
  return {
    seo: {
      title: value(formData, 'seoTitle'),
      description: value(formData, 'seoDescription')
    },
    eyebrow: value(formData, 'eyebrow'),
    title: value(formData, 'title'),
    body: value(formData, 'body'),
    primaryCtaLabel: value(formData, 'primaryCtaLabel'),
    primaryCtaHref: value(formData, 'primaryCtaHref'),
    secondaryCtaLabel: value(formData, 'secondaryCtaLabel'),
    secondaryCtaHref: value(formData, 'secondaryCtaHref'),
    quickRuleTitle: value(formData, 'quickRuleTitle'),
    quickRuleBody: value(formData, 'quickRuleBody'),
    steps: pipePairs(formData, 'stepsInput').map(([id, title, summary, image]) => ({
      id: id ?? '',
      title: title ?? '',
      summary: summary ?? '',
      image: image ?? ''
    })),
    copyTitle: value(formData, 'copyTitle'),
    copyBody: value(formData, 'copyBody'),
    openTitle: value(formData, 'openTitle'),
    starterMessages: lines(formData, 'starterMessagesInput'),
    quickTipsTitle: value(formData, 'quickTipsTitle'),
    quickTips: lines(formData, 'quickTipsInput')
  };
}

export function parseFaqDocument(formData: FormData): FaqDocument {
  return {
    seo: {
      title: value(formData, 'seoTitle'),
      description: value(formData, 'seoDescription')
    },
    eyebrow: value(formData, 'eyebrow'),
    title: value(formData, 'title'),
    intro: value(formData, 'intro'),
    items: pipePairs(formData, 'itemsInput').map(([question, answer]) => ({
      question: question ?? '',
      answer: answer ?? ''
    }))
  };
}

export function parseNavigationDocument(formData: FormData): NavigationDocument {
  return {
    brandName: value(formData, 'brandName'),
    brandTagline: value(formData, 'brandTagline'),
    ctaLabel: value(formData, 'ctaLabel'),
    ctaHref: value(formData, 'ctaHref'),
    links: pipePairs(formData, 'linksInput').map(([label, href]) => ({
      label: label ?? '',
      href: href ?? ''
    })),
    mobileLinks: pipePairs(formData, 'mobileLinksInput').map(([icon, label, href]) => ({
      icon: icon ?? '',
      label: label ?? '',
      href: href ?? ''
    }))
  };
}

export function parseFooterDocument(formData: FormData): FooterDocument {
  return {
    eyebrow: value(formData, 'eyebrow'),
    title: value(formData, 'title'),
    body: value(formData, 'body'),
    ctaLabel: value(formData, 'ctaLabel'),
    ctaHref: value(formData, 'ctaHref'),
    links: pipePairs(formData, 'linksInput').map(([label, href]) => ({
      label: label ?? '',
      href: href ?? ''
    }))
  };
}
