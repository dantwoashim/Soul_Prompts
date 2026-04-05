<script lang="ts">
  import { copyText } from '$lib/utils/clipboard';
  import { trackEvent } from '$lib/utils/analytics';

  export let prompt: string;
  export let characterName: string;
  export let label = 'Copy Lite Prompt';

  let status: 'idle' | 'copying' | 'copied' | 'error' = 'idle';
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  async function handleClick(): Promise<void> {
    status = 'copying';
    try {
      await copyText(prompt);
      status = 'copied';
      trackEvent('Copy Prompt', { character: characterName });
      clearTimeout(timeoutHandle);
      timeoutHandle = setTimeout(() => {
        status = 'idle';
      }, 2200);
    } catch {
      status = 'error';
    }
  }
</script>

<button
  type="button"
  class="w-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition-all active:scale-[0.99]"
  style="background: linear-gradient(180deg, rgba(35, 27, 18, 0.84), rgba(18, 18, 18, 0.98)); border-bottom: 1px solid rgba(255, 198, 62, 0.3); color: #f3ecdf;"
  onclick={handleClick}
>
  {#if status === 'copied'}
    Copied prompt
  {:else if status === 'copying'}
    Copying prompt
  {:else if status === 'error'}
    Copy failed
  {:else}
    {label}
  {/if}
</button>
