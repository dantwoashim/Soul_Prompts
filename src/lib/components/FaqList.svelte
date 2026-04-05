<script lang="ts">
  import type { FaqDocument } from '$lib/cms/types';
  import { trackEvent } from '$lib/utils/analytics';

  export let items: FaqDocument['items'];

  function handleToggle(event: Event, question: string): void {
    const details = event.currentTarget as HTMLDetailsElement;
    if (details.open) {
      trackEvent('FAQ Open', { question });
    }
  }
</script>

<div class="grid gap-4">
  {#each items as item}
    <div class="editorial-panel p-6">
      <details on:toggle={(event) => handleToggle(event, item.question)}>
        <summary class="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
          <span class="font-display text-[2rem] leading-none tracking-[-0.03em] text-[var(--text)]">
            {item.question}
          </span>
          <span class="text-[var(--gold)]">+</span>
        </summary>
        <p class="mt-5 text-sm leading-7 text-[var(--text-muted)]">{item.answer}</p>
      </details>
    </div>
  {/each}
</div>
