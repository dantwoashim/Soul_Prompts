<script lang="ts">
  import { trackEvent } from '$lib/utils/analytics';

  export let productUrl: string;
  export let price: number;
  export let characterName: string;
  export let label = 'Buy full version';
</script>

{#if productUrl}
  <a
    class="button button-cta"
    href={productUrl}
    target="_blank"
    rel="noopener noreferrer"
    on:click={() => trackEvent('Buy Click', { character: characterName, price: String(price) })}
  >
    {label} — ${price}
  </a>
{:else}
  <span class="button button-secondary" style="opacity: 0.5; cursor: default;">
    Coming soon — ${price}
  </span>
{/if}
