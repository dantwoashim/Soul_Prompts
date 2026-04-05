import { characters } from '$lib/content/characters';
import { aiStudioQuickTips, aiStudioTutorialSteps } from '$lib/content/tutorials';
import { aiStudioUrl, membershipUrl } from '$lib/site-config';
import { faqItems, featureCards, siteDescription, siteName, siteTagline } from '$lib/site';
import { getPromptSummary, getPromptTeaser } from '$lib/utils/promptSummary';
import type {
  CmsSeedSnapshot,
  FooterDocument,
  FaqDocument,
  GuideDocument,
  HomeDocument,
  NavigationDocument,
  PromptRecord,
  PromptSnapshot,
  PromptVersionRecord,
  SiteDocumentVersionRecord,
  SiteSettingsRecord,
  SiteSettingsSnapshot,
  SiteSettingsVersionRecord,
  VaultDocument
} from '$lib/cms/types';

function nowIso(offset = 0) {
  return new Date(Date.now() + offset).toISOString();
}

function stableId(prefix: string, value: string) {
  return `${prefix}_${value}`;
}

function buildPromptSnapshots(): PromptRecord[] {
  const spotlightId = characters[0]?.id;
  const homeFeaturedIds = new Set(
    characters
      .filter((character) => character.tier === 'free')
      .slice(0, 6)
      .map((character) => character.id)
  );
  const homeMemberIds = new Set(
    characters
      .filter((character) => character.tier !== 'free')
      .slice(0, 4)
      .map((character) => character.id)
  );
  const catalogFlagshipIds = new Set(characters.slice(0, 4).map((character) => character.id));

  return characters.map((character, index) => {
    const snapshot: PromptSnapshot = {
      id: character.id,
      slug: character.slug,
      title: character.name,
      tagline: character.tagline,
      overview: getPromptSummary(character),
      teaser: getPromptTeaser(character),
      audience: character.audience,
      tone: character.tone,
      accessMode: character.tier === 'free' ? 'public' : 'private',
      contentRating: character.contentRating,
      patreonUrlOverride: character.gumroadUrl || '',
      fullPrompt: character.systemPromptLite,
      modelNotes: character.modelNotes,
      sampleConversation: character.sampleConversation.map((line) => ({
        speaker: line.speaker,
        text: line.text
      })),
      region: character.region,
      archetype: character.archetype,
      price: character.price,
      coverImageUrl: '',
      featuredGroups: [
        ...(spotlightId === character.id ? ['home_spotlight'] : []),
        ...(homeFeaturedIds.has(character.id) ? ['home_featured'] : []),
        ...(homeMemberIds.has(character.id) ? ['home_member'] : []),
        ...(catalogFlagshipIds.has(character.id) ? ['catalog_flagship'] : [])
      ],
      sortOrder: index * 10,
      seo: {
        title: character.seo.title,
        description: character.seo.description
      }
    };

    return {
      id: character.id,
      createdAt: nowIso(-86400000),
      updatedAt: nowIso(-3600000 + index * 30000),
      publishedAt: nowIso(-3600000 + index * 30000),
      draft: snapshot,
      published: snapshot
    };
  });
}

function buildPromptVersions(prompts: PromptRecord[]): PromptVersionRecord[] {
  return prompts.map((prompt) => ({
    id: stableId('prompt_version', prompt.id),
    scope: 'prompt',
    promptId: prompt.id,
    versionKind: 'seed',
    note: 'Imported from the legacy TypeScript archive',
    createdAt: prompt.publishedAt ?? prompt.updatedAt,
    snapshot: prompt.published ?? prompt.draft
  }));
}

function buildSettings(): SiteSettingsRecord {
  const published: SiteSettingsSnapshot = {
    siteName,
    siteTagline,
    siteDescription,
    siteUrl: process.env.PUBLIC_SITE_URL || 'https://soulprompts.example.com',
    patreonUrl: process.env.PUBLIC_PATREON_URL || process.env.PUBLIC_MEMBERSHIP_URL || membershipUrl,
    aiStudioUrl,
    waitlistEmbedEndpoint: process.env.PUBLIC_BUTTONDOWN_EMBED_ENDPOINT || '',
    plausibleDomain: process.env.PUBLIC_PLAUSIBLE_DOMAIN || '',
    plausibleSrc: process.env.PUBLIC_PLAUSIBLE_SRC || '',
    socialImageUrl: '/social-card.svg'
  };

  return {
    key: 'global',
    createdAt: nowIso(-86400000),
    updatedAt: nowIso(-3600000),
    publishedAt: nowIso(-3600000),
    draft: published,
    published
  };
}

function buildSettingsVersions(settings: SiteSettingsRecord): SiteSettingsVersionRecord[] {
  return [
    {
      id: 'settings_version_seed',
      scope: 'settings',
      versionKind: 'seed',
      note: 'Imported from legacy site configuration',
      createdAt: settings.publishedAt ?? settings.updatedAt,
      snapshot: settings.published ?? settings.draft
    }
  ];
}

function buildHomeDocument(): HomeDocument {
  return {
    seo: {
      title: `${siteName} | ${siteTagline}`,
      description: siteDescription
    },
    heroBadge: 'Character Packs and Membership Releases',
    heroTitle: 'A cinematic character archive with a live editorial CMS.',
    heroBody:
      'SoulPrompts pairs public starter packs, guided setup notes, and premium membership drops so visitors can move from discovery to a fully staged conversation without guesswork.',
    primaryCtaLabel: 'Explore the Archive',
    primaryCtaHref: '/catalog/',
    secondaryCtaLabel: 'Read the Setup Guide',
    secondaryCtaHref: '/learn/guide/',
    tutorialEyebrow: 'Tutorial Workflow',
    tutorialTitle: 'Copy the pack, place it in the instruction layer, then open the scene.',
    tutorialBody: siteDescription,
    startFreeEyebrow: 'Start Free',
    startFreeTitle: 'Try the characters that are already live.',
    startFreeCtaLabel: 'Browse Full Catalog',
    whyEyebrow: 'Why SoulPrompts',
    whyTitle: 'Less storefront noise. More narrative weight, setup clarity, and handoff polish.',
    membershipEyebrow: 'Premium Access',
    membershipTitle: 'Join for full prompt packs, premium variants, and member drops.',
    membershipBody:
      'Membership includes longer prompt systems, stronger voice control, expanded variants, and ongoing releases for people who want more than the public starter versions.',
    membershipCtaLabel: 'View Membership Vault',
    featureCards
  };
}

function buildVaultDocument(): VaultDocument {
  return {
    seo: {
      title: 'Membership | SoulPrompts',
      description:
        'Join SoulPrompts membership for premium character packs, recurring drops, members-only bundles, and ongoing character releases.'
    },
    eyebrow: 'Membership Vault',
    title: 'Join for full prompt packs, premium variants, and recurring character drops.',
    body:
      'Get longer system packs, sharper voice control, better setup notes, and expanded versions built to run cleanly in modern chat workspaces.',
    primaryCtaLabel: 'Join Membership',
    secondaryCtaLabel: 'See the Setup Guide',
    membershipHighlights: [
      {
        label: 'Full-length packs',
        body: 'Long-form system prompts with stronger voice control, deeper emotional logic, and cleaner scene retention.'
      },
      {
        label: 'Premium variants',
        body: 'Alternate tones, expanded versions, and more intense branches for the characters you want to keep running.'
      },
      {
        label: 'Ready to run',
        body: 'Each drop is built for a fast handoff, with clear setup notes and a stronger opening scene.'
      }
    ],
    memberIncludes: [
      {
        title: 'Premium prompt packs',
        body: 'Longer system prompts, stronger voice control, deeper memory cues, and more durable scene framing.'
      },
      {
        title: 'Members-only variants',
        body: 'Alternate tones, escalation paths, and expanded versions of the characters you already like.'
      },
      {
        title: 'Setup notes',
        body: 'Simple guidance on what to paste, where it goes, and how to open the first scene cleanly.'
      },
      {
        title: 'Ongoing collections',
        body: 'Linked releases that feel like a living archive instead of isolated storefront posts.'
      }
    ],
    releaseFlow: [
      'Choose a character pack or drop that fits the tone you want.',
      'Copy the full pack into the instruction layer of your chat workspace.',
      'Open with a scene-based first message instead of rewriting the prompt.',
      'Use included notes and variants to push the conversation where you want it to go.'
    ],
    dropExtras: [
      'Suggested opening lines for faster starts.',
      'Tone notes so the character lands correctly on the first run.',
      'Variant versions when a character needs more softness, pressure, or intensity.',
      'An easy setup workflow you can reuse without guesswork.'
    ],
    finalTitle: 'Start with the free characters, then join when you want the deeper version.',
    finalBody:
      'Use the free pages to test the tone. Join membership when you want the longer prompt packs, stronger variants, and recurring releases.'
  };
}

function buildGuideDocument(): GuideDocument {
  return {
    seo: {
      title: 'Setup Guide | SoulPrompts',
      description:
        'A step-by-step visual guide for using SoulPrompts in a chat workspace, including where to place the pack and how to open the first scene.'
    },
    eyebrow: 'Setup Tutorial',
    title: 'Copy the pack, place it in the instruction layer, then open with a real scene.',
    body:
      'This walkthrough uses the real interface so visitors know exactly where SoulPrompts belongs, what to copy, and how to start the conversation without flattening the character.',
    primaryCtaLabel: 'Open Workspace',
    primaryCtaHref: aiStudioUrl,
    secondaryCtaLabel: 'Pick a Character First',
    secondaryCtaHref: '/catalog/',
    quickRuleTitle: 'System instructions for the prompt. First message for the scene.',
    quickRuleBody:
      'The most common mistake is pasting SoulPrompts into the ordinary message box. The pack belongs in the instruction layer. Your first user message should only establish the moment you want to enter.',
    steps: aiStudioTutorialSteps.map((step) => ({
      id: step.id,
      title: step.title,
      summary: step.summary,
      image: step.image
    })),
    copyTitle: 'Copy the SoulPrompts system block exactly as shown.',
    copyBody:
      'The system block contains the voice, pacing, memory cues, and relationship posture. If you strip it down too early, the character starts feeling generic.',
    openTitle: 'Your first user message should feel like scene direction, not a prompt rewrite.',
    starterMessages: [
      'You notice she has already been online for an hour when the wrong-number text arrives.',
      'It is 12:42 AM, the room is quiet, and she messages like she has been holding her breath all evening.',
      'You answer carefully, like someone who knows the next sentence might change the relationship forever.'
    ],
    quickTipsTitle: 'A few habits that preserve the feel of the character.',
    quickTips: [...aiStudioQuickTips]
  };
}

function buildFaqDocument(): FaqDocument {
  return {
    seo: {
      title: 'FAQ | SoulPrompts',
      description:
        'Frequently asked questions about SoulPrompts, membership releases, setup flow, and how public versus private prompt access works.'
    },
    eyebrow: 'FAQ',
    title: 'Everything you need before you open the archive.',
    intro:
      'This page answers the practical questions visitors ask before they commit to a prompt, a tutorial, or a membership drop.',
    items: faqItems
  };
}

function buildNavigationDocument(): NavigationDocument {
  return {
    brandName: siteName,
    brandTagline: 'Character Archive',
    links: [
      { href: '/catalog/', label: 'Discover' },
      { href: '/learn/guide/', label: 'Setup Guide' },
      { href: '/vault/', label: 'Membership' }
    ],
    ctaLabel: 'Membership',
    ctaHref: '/vault/',
    mobileLinks: [
      { href: '/', icon: 'home', label: 'Home' },
      { href: '/catalog/', icon: 'gallery_thumbnail', label: 'Discover' },
      { href: '/learn/guide/', icon: 'school', label: 'Guide' },
      { href: '/vault/', icon: 'workspace_premium', label: 'Membership' }
    ]
  };
}

function buildFooterDocument(): FooterDocument {
  return {
    eyebrow: 'SoulPrompts Archive',
    title: 'Cinematic character packs, setup notes, and premium releases.',
    body:
      'Start with the free characters, learn the setup flow, and join membership when you want the full packs, premium variants, and deeper releases.',
    ctaLabel: 'See Membership',
    ctaHref: '/vault/',
    links: [
      { href: '/', label: 'Home' },
      { href: '/catalog/', label: 'Discover' },
      { href: '/learn/guide/', label: 'Setup Guide' },
      { href: '/faq/', label: 'FAQ' },
      { href: '/terms/', label: 'Terms' },
      { href: '/privacy/', label: 'Privacy' },
      { href: '/refund-policy/', label: 'Refunds' }
    ]
  };
}

function createDocumentRecord<K extends keyof CmsSeedSnapshot['documents']>(
  key: K,
  draft: CmsSeedSnapshot['documents'][K]['draft']
): CmsSeedSnapshot['documents'][K] {
  return {
    key,
    createdAt: nowIso(-86400000),
    updatedAt: nowIso(-3600000),
    publishedAt: nowIso(-3600000),
    draft,
    published: draft
  } as CmsSeedSnapshot['documents'][K];
}

function buildDocumentVersions(snapshot: CmsSeedSnapshot['documents']): SiteDocumentVersionRecord[] {
  return Object.values(snapshot).map((document) => ({
    id: stableId('document_version', document.key),
    scope: 'document',
    documentKey: document.key,
    versionKind: 'seed',
    note: 'Imported from legacy page content',
    createdAt: document.publishedAt ?? document.updatedAt,
    snapshot: document.published ?? document.draft
  }));
}

export function buildSeedSnapshot(): CmsSeedSnapshot {
  const prompts = buildPromptSnapshots();
  const documents = {
    home: createDocumentRecord('home', buildHomeDocument()),
    vault: createDocumentRecord('vault', buildVaultDocument()),
    guide: createDocumentRecord('guide', buildGuideDocument()),
    faq: createDocumentRecord('faq', buildFaqDocument()),
    navigation: createDocumentRecord('navigation', buildNavigationDocument()),
    footer: createDocumentRecord('footer', buildFooterDocument())
  };
  const settings = buildSettings();

  return {
    prompts,
    promptVersions: buildPromptVersions(prompts),
    documents,
    documentVersions: buildDocumentVersions(documents),
    settings,
    settingsVersions: buildSettingsVersions(settings)
  };
}
