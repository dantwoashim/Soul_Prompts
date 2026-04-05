export const aiStudioUrl = 'https://aistudio.google.com/prompts/new_chat';

const configuredMembershipUrl =
  import.meta.env.PUBLIC_MEMBERSHIP_URL || import.meta.env.PUBLIC_PATREON_URL || '';

export const membershipUrl = configuredMembershipUrl || '/vault/';

export const hasMembershipUrl = Boolean(configuredMembershipUrl);
export const hasWaitlistSignup = Boolean(import.meta.env.PUBLIC_BUTTONDOWN_EMBED_ENDPOINT);

// Legacy aliases kept temporarily so older imports and env names do not break.
export const patreonUrl = membershipUrl;
export const hasPatreonUrl = hasMembershipUrl;
