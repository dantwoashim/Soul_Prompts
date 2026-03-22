export const siteName = 'SoulPrompts';
export const siteTagline = 'Character systems for AI Studio';
export const siteDescription =
  'Deeply engineered roleplay character prompts with voice guides, behavioral routines, and emotional state management. Free lite versions plus premium CPF-encoded character engines.';

export const aiStudioSteps = [
  {
    title: 'Pick a character',
    description: 'Browse the library and find a character that matches your scene.'
  },
  {
    title: 'Copy the system prompt',
    description: 'Hit the copy button on any character page - free lite prompts are ready instantly.'
  },
  {
    title: 'Paste into AI Studio',
    description: 'Drop the prompt into System Instructions before starting your chat.'
  },
  {
    title: 'Open with intent',
    description: 'Give the model a scene, a tension, or a relationship dynamic. The character handles the rest.'
  }
];

export const featureCards = [
  {
    title: 'Voice-engineered, not vibes',
    description:
      'Each character has a linguistic fingerprint - specific words they use, words they never use, emoji semantics, and mood-based message patterns.'
  },
  {
    title: 'Behavioral depth',
    description:
      'Premium characters include daily routines, emotional state modifiers, and relationship matrices that make them behave differently at 2 AM vs 10 AM.'
  },
  {
    title: 'Compressed Persona Format',
    description:
      'Full versions use CPF - a compact encoding that costs 70% fewer tokens while delivering richer character behavior than raw prompt text.'
  }
];

export const pricingTiers = [
  {
    name: 'Lite',
    price: 'Free',
    description: 'Strong starting prompts for immediate use.',
    features: [
      'Core personality & voice guide',
      'Basic behavioral rules',
      'Works in AI Studio, ChatGPT, Claude',
      'Copy-paste ready',
    ],
    cta: 'Browse free characters',
    ctaHref: '#characters',
    featured: false
  },
  {
    name: 'Full CPF',
    price: '$9.99',
    description: 'The complete character engine in compressed format.',
    features: [
      'Everything in Lite, plus:',
      '7 daily routine blocks with state modifiers',
      'Multiple interaction modes (chat, god mode, mind access)',
      'Relationship matrix with trust tracking',
      'Emotional state management',
      '70% fewer tokens than raw prompts',
    ],
    cta: 'View premium characters',
    ctaHref: '#characters',
    featured: true
  }
];

export const faqItems = [
  {
    question: 'Do these prompts work in AI Studio?',
    answer:
      'Yes. Each character is written to drop directly into AI Studio system instructions. They also work in ChatGPT, Claude, and any LLM that honors a system prompt.'
  },
  {
    question: 'What is CPF (Compressed Persona Format)?',
    answer:
      'CPF is a compact encoding format for character prompts. It packs voice guides, routines, relationship matrices, and behavioral rules into a structured notation that LLMs can parse - while using 70% fewer tokens than the equivalent raw text.'
  },
  {
    question: 'Why are lite versions free?',
    answer:
      'The free versions are strong enough to use today, but intentionally trimmed. They prove the quality. If people use them and want more, the premium editions deliver the full behavioral engine.'
  },
  {
    question: 'Can I edit the prompt after copying it?',
    answer:
      'Yes. You can adapt names, settings, and scene hooks. The easiest way to break quality is stripping voice guidance or behavioral rules - those are what make the characters feel real.'
  },
  {
    question: 'What happens after I buy?',
    answer:
      'You receive the full CPF-encoded prompt via Gumroad. Paste it into AI Studio system instructions exactly like the lite version - the decoder preamble teaches the AI how to parse the format.'
  },
  {
    question: 'What happens after I join the waitlist?',
    answer:
      'You get updates when new character drops go live, when creator tools open, and when hosted experiences launch. No spam - just releases.'
  }
];
