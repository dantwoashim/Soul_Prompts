// Prompt registry for lazy-loading heavy prompts
// This avoids serializing large prompt strings into SvelteKit page data

const promptModules: Record<string, () => Promise<{ default: string } | { [key: string]: string }>> = {
    'megha-wrong-number': () => import('../prompts/megha-wrong-number').then(m => ({ default: m.PROMPT_WRONG_NUMBER })),
    'megha-stranger': () => import('../prompts/megha-stranger').then(m => ({ default: m.PROMPT_STRANGER })),
    'megha-boyfriend': () => import('../prompts/megha-boyfriend').then(m => ({ default: m.PROMPT_BOYFRIEND })),
    'megha-bestfriend': () => import('../prompts/megha-bestfriend').then(m => ({ default: m.PROMPT_BESTFRIEND })),
};

export async function loadPrompt(slug: string): Promise<string> {
    const loader = promptModules[slug];
    if (!loader) return '';
    const mod = await loader();
    return (mod as any).default || '';
}
