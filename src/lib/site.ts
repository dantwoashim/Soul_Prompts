export const siteName = 'SoulPrompts';
export const siteTagline = 'Character archive and premium membership';
export const siteDescription =
  'Cinematic character packs, setup notes, and premium releases for creators who want emotionally precise conversations instead of generic roleplay.';

export const aiStudioSteps = [
  {
    title: 'Pick a character',
    description: 'Browse the archive and choose a character whose mood, pacing, and relationship dynamic fits your scene.'
  },
  {
    title: 'Copy the system prompt',
    description:
      'Use the copy button on the character page to grab the starter prompt or preview block exactly as it should be pasted.'
  },
  {
    title: 'Paste into your workspace',
    description: 'Place the block in the instruction layer before you type your first message.'
  },
  {
    title: 'Open with intent',
    description:
      'Start with a concrete scene, pressure point, or relationship beat. The prompt handles tone, memory, and voice.'
  }
];

export const featureCards = [
  {
    title: 'Voice-engineered, not generic',
    description:
      'Each character carries a linguistic fingerprint with phrase habits, pacing rules, emotional tells, and scene logic that stays consistent.'
  },
  {
    title: 'Built for long-form conversation',
    description:
      'Every pack is shaped for chat workspaces that separate setup instructions from the live scene, so the voice lands fast and stays coherent.'
  },
  {
    title: 'Premium packs with more range',
    description:
      'Full releases add deeper variants, stronger setup notes, and longer prompt systems that keep the character stable for more of the conversation.'
  }
];

export const pricingTiers = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Public character pages and setup notes that get creators running fast.',
    features: [
      'Character summary and prompt preview',
      'Setup walkthrough',
      'Copy-paste ready starter blocks',
      'Archive access and discovery',
    ],
    cta: 'Explore the archive',
    ctaHref: '/catalog',
    featured: false
  },
  {
    name: 'Membership',
    price: 'Membership',
    description: 'Recurring drops, full prompt packs, and premium variants.',
    features: [
      'Full packs and members-only releases',
      'Curated universes and themed drops',
      'Creator notes and prompt upgrades',
      'Centralized delivery through the membership vault',
      'Future dashboard publishing workflow',
    ],
    cta: 'Join the membership',
    ctaHref: '/vault/',
    featured: true
  }
];

export const faqItems = [
  {
    question: 'Where do these character packs work?',
    answer:
      'They work best in chat workspaces that let you keep setup instructions separate from the live conversation. If your platform supports a dedicated instruction layer, the packs will behave much more consistently there.'
  },
  {
    question: 'What do members get?',
    answer:
      'Members get full prompt packs, premium variants, deeper releases, and recurring drops that go beyond the public starter versions.'
  },
  {
    question: 'Why are starter versions public?',
    answer:
      'The public versions are strong enough to create a real conversation today, but intentionally trimmed. They show the craft while leaving room for deeper members-only releases.'
  },
  {
    question: 'Can I edit the prompt after copying it?',
    answer:
      'Yes. You can adapt names, settings, and scene hooks. The easiest way to hurt quality is stripping the voice guidance or behavioral rules, so edit lightly at first.'
  },
  {
    question: 'What happens after I join membership?',
    answer:
      'You unlock the full prompt packs, premium variants, and member releases. The setup stays simple: place the pack in the instruction layer, then open with a strong first scene.'
  },
  {
    question: 'Do you send update emails?',
    answer:
      'Yes. When email updates are open, subscribers get launch notes for new character drops, major tutorials, and membership releases. No spam, just launches.'
  }
];
