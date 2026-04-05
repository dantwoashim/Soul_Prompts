import { z } from 'zod';
import { siteDocumentKeys } from './types';

const seoSchema = z.object({
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(20).max(320),
  image: z.string().trim().optional().default('')
});

const sampleLineSchema = z.object({
  speaker: z.enum(['user', 'character']),
  text: z.string().trim().min(1)
});

export const promptSnapshotSchema = z.object({
  id: z.string().trim().min(1),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(8).max(220),
  overview: z.string().trim().min(20).max(420),
  teaser: z.string().trim().min(20).max(220),
  audience: z.string().trim().min(10).max(220),
  tone: z.array(z.string().trim().min(1)).min(1).max(8),
  accessMode: z.enum(['public', 'private']),
  contentRating: z.enum(['sfw', 'nsfw']),
  patreonUrlOverride: z.string().trim().default(''),
  fullPrompt: z.string().default(''),
  modelNotes: z.array(z.string().trim().min(1)).min(1).max(12),
  sampleConversation: z.array(sampleLineSchema).max(12),
  region: z.string().trim().min(2).max(80),
  archetype: z.string().trim().min(2).max(80),
  price: z.number().min(0).max(1000),
  coverImageUrl: z.string().trim().default(''),
  featuredGroups: z.array(z.string().trim().min(1)).max(12),
  sortOrder: z.number().int().min(0).max(10000),
  seo: seoSchema
});

export const navigationDocumentSchema = z.object({
  brandName: z.string().trim().min(2).max(80),
  brandTagline: z.string().trim().min(2).max(120),
  links: z.array(z.object({ label: z.string().trim().min(1), href: z.string().trim().min(1) })),
  ctaLabel: z.string().trim().min(1).max(60),
  ctaHref: z.string().trim().min(1),
  mobileLinks: z.array(
    z.object({
      label: z.string().trim().min(1),
      href: z.string().trim().min(1),
      icon: z.string().trim().min(1)
    })
  )
});

export const footerDocumentSchema = z.object({
  eyebrow: z.string().trim().min(2).max(80),
  title: z.string().trim().min(10).max(220),
  body: z.string().trim().min(20).max(420),
  ctaLabel: z.string().trim().min(1).max(60),
  ctaHref: z.string().trim().min(1),
  links: z.array(z.object({ label: z.string().trim().min(1), href: z.string().trim().min(1) }))
});

export const homeDocumentSchema = z.object({
  seo: seoSchema,
  heroBadge: z.string().trim().min(2).max(120),
  heroTitle: z.string().trim().min(10).max(220),
  heroBody: z.string().trim().min(20).max(420),
  primaryCtaLabel: z.string().trim().min(1).max(60),
  primaryCtaHref: z.string().trim().min(1),
  secondaryCtaLabel: z.string().trim().min(1).max(60),
  secondaryCtaHref: z.string().trim().min(1),
  tutorialEyebrow: z.string().trim().min(2).max(80),
  tutorialTitle: z.string().trim().min(10).max(220),
  tutorialBody: z.string().trim().min(20).max(420),
  startFreeEyebrow: z.string().trim().min(2).max(80),
  startFreeTitle: z.string().trim().min(10).max(220),
  startFreeCtaLabel: z.string().trim().min(1).max(60),
  whyEyebrow: z.string().trim().min(2).max(80),
  whyTitle: z.string().trim().min(10).max(220),
  membershipEyebrow: z.string().trim().min(2).max(80),
  membershipTitle: z.string().trim().min(10).max(220),
  membershipBody: z.string().trim().min(20).max(420),
  membershipCtaLabel: z.string().trim().min(1).max(60),
  featureCards: z.array(
    z.object({
      title: z.string().trim().min(2).max(80),
      description: z.string().trim().min(20).max(260)
    })
  )
});

export const vaultDocumentSchema = z.object({
  seo: seoSchema,
  eyebrow: z.string().trim().min(2).max(80),
  title: z.string().trim().min(10).max(220),
  body: z.string().trim().min(20).max(420),
  primaryCtaLabel: z.string().trim().min(1).max(60),
  secondaryCtaLabel: z.string().trim().min(1).max(60),
  membershipHighlights: z.array(
    z.object({
      label: z.string().trim().min(2).max(80),
      body: z.string().trim().min(20).max(240)
    })
  ),
  memberIncludes: z.array(
    z.object({
      title: z.string().trim().min(2).max(80),
      body: z.string().trim().min(20).max(240)
    })
  ),
  releaseFlow: z.array(z.string().trim().min(10).max(220)),
  dropExtras: z.array(z.string().trim().min(10).max(220)),
  finalTitle: z.string().trim().min(10).max(220),
  finalBody: z.string().trim().min(20).max(320)
});

export const guideDocumentSchema = z.object({
  seo: seoSchema,
  eyebrow: z.string().trim().min(2).max(80),
  title: z.string().trim().min(10).max(220),
  body: z.string().trim().min(20).max(420),
  primaryCtaLabel: z.string().trim().min(1).max(60),
  primaryCtaHref: z.string().trim().min(1),
  secondaryCtaLabel: z.string().trim().min(1).max(60),
  secondaryCtaHref: z.string().trim().min(1),
  quickRuleTitle: z.string().trim().min(10).max(180),
  quickRuleBody: z.string().trim().min(20).max(280),
  steps: z.array(
    z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(5).max(160),
      summary: z.string().trim().min(15).max(240),
      image: z.string().trim().min(1)
    })
  ),
  copyTitle: z.string().trim().min(10).max(180),
  copyBody: z.string().trim().min(20).max(240),
  openTitle: z.string().trim().min(10).max(180),
  starterMessages: z.array(z.string().trim().min(10).max(220)),
  quickTipsTitle: z.string().trim().min(5).max(120),
  quickTips: z.array(z.string().trim().min(10).max(220))
});

export const faqDocumentSchema = z.object({
  seo: seoSchema,
  eyebrow: z.string().trim().min(2).max(80),
  title: z.string().trim().min(10).max(180),
  intro: z.string().trim().min(20).max(260),
  items: z.array(
    z.object({
      question: z.string().trim().min(5).max(160),
      answer: z.string().trim().min(20).max(320)
    })
  )
});

export const siteDocumentSchema = z.discriminatedUnion('key', [
  z.object({ key: z.literal('home'), value: homeDocumentSchema }),
  z.object({ key: z.literal('vault'), value: vaultDocumentSchema }),
  z.object({ key: z.literal('guide'), value: guideDocumentSchema }),
  z.object({ key: z.literal('faq'), value: faqDocumentSchema }),
  z.object({ key: z.literal('navigation'), value: navigationDocumentSchema }),
  z.object({ key: z.literal('footer'), value: footerDocumentSchema })
]);

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(2).max(80),
  siteTagline: z.string().trim().min(2).max(120),
  siteDescription: z.string().trim().min(20).max(320),
  siteUrl: z.string().trim().min(1),
  patreonUrl: z.string().trim().default(''),
  aiStudioUrl: z.string().trim().min(1),
  waitlistEmbedEndpoint: z.string().trim().default(''),
  plausibleDomain: z.string().trim().default(''),
  plausibleSrc: z.string().trim().default(''),
  socialImageUrl: z.string().trim().default('')
});

export function isSiteDocumentKey(value: string): value is (typeof siteDocumentKeys)[number] {
  return (siteDocumentKeys as readonly string[]).includes(value);
}
