<script lang="ts">
  import { trackEvent, type AnalyticsEvent } from '$lib/utils/analytics';
  import { membershipUrl } from '$lib/site-config';

  export let productUrl: string;
  export let price: number;
  export let characterName: string;
  export let label = '';

  $: href = productUrl || membershipUrl;
  $: isMembershipLink = !productUrl && Boolean(href);
  $: resolvedLabel = label || (productUrl ? 'Buy Prompt Pack' : 'Unlock Membership');
  $: eventName = (isMembershipLink ? 'Membership Click' : 'Buy Click') as AnalyticsEvent;
</script>

{#if href}
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    class="gold-button w-full"
    onclick={() => trackEvent(eventName, { character: characterName, price: String(price), href })}
  >
    {resolvedLabel}{#if price > 0} - ${price}{/if}
  </a>
{:else}
  <span
    class="block w-full px-6 py-5 text-center text-sm uppercase tracking-[0.18em]"
    style="background: rgba(255, 198, 62, 0.05); color: #8f8271;"
  >
    Membership link coming soon
  </span>
{/if}
