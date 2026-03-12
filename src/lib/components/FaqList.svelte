<script lang="ts">
  import { faqItems } from '$lib/site';
  import { trackEvent } from '$lib/utils/analytics';

  function handleToggle(event: Event, question: string): void {
    const details = event.currentTarget as HTMLDetailsElement;
    if (details.open) {
      trackEvent('FAQ Open', { question });
    }
  }
</script>

<div class="faq-card">
  <h3>Frequently asked</h3>

  {#each faqItems as item}
    <div class="faq-item">
      <details on:toggle={(event) => handleToggle(event, item.question)}>
        <summary>
          <span>{item.question}</span>
          <span>+</span>
        </summary>
        <p>{item.answer}</p>
      </details>
    </div>
  {/each}
</div>
