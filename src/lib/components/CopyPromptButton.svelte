<script lang="ts">
  import { copyText } from '$lib/utils/clipboard';
  import { trackEvent } from '$lib/utils/analytics';

  export let prompt: string;
  export let characterName: string;
  export let label = 'Copy lite prompt';

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
  class={`button copy-button ${status === 'copied' ? 'button-copied' : 'button-secondary'} ${status === 'copying' ? 'button-copying' : ''}`}
  type="button"
  on:click={handleClick}
>
  {#if status === 'copied'}
    Copied
  {:else if status === 'copying'}
    Copying...
  {:else if status === 'error'}
    Try again
  {:else}
    {label}
  {/if}
</button>
