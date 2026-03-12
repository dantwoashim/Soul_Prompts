export type SampleSpeaker = 'user' | 'character';

export interface SampleLine {
  speaker: SampleSpeaker;
  text: string;
}

export interface CharacterSeo {
  title: string;
  description: string;
}

export type CharacterTier = 'free' | 'premium' | 'nsfw';
export type ContentRating = 'sfw' | 'nsfw';
export type NsfwTier = 'basic' | 'explicit' | 'hardcore';
export type CharacterGender = 'female' | 'male' | 'non-binary';
export type CharacterRegion = 'south-asia' | 'europe' | 'north-america' | 'east-asia' | 'global';
export type CharacterArchetype = 'romantic' | 'thriller' | 'slice-of-life' | 'fantasy' | 'psychological' | 'comedy';

export interface CharacterStats {
  liteLines: number;
  fullLines: number;
  liteTokens: number;
  fullTokens: number;
}

export interface CharacterDefinition {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  audience: string;
  tone: string[];
  tier: CharacterTier;
  contentRating: ContentRating;
  nsfwTier?: NsfwTier;
  gender: CharacterGender;
  region: CharacterRegion;
  archetype: CharacterArchetype;
  language: string;
  price: number;
  systemPromptLite: string;
  systemPromptCpfPreview: string;
  modelNotes: string[];
  sampleConversation: SampleLine[];
  comingSoonTeaser: string;
  stats: CharacterStats;
  gumroadUrl: string;
  seo: CharacterSeo;
}
