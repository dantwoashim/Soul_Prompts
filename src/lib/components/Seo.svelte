<script lang="ts">
  import { page } from '$app/stores';
  import { getAbsoluteUrl } from '$lib/utils/seo';

  export let title: string;
  export let description: string;
  export let path = '/';
  export let noindex = false;
  export let imagePath = '/social-card.svg';

  $: siteUrl = $page.data?.shell?.settings?.siteUrl ?? '';
  $: canonical = getAbsoluteUrl(path, siteUrl);
  $: image = getAbsoluteUrl(imagePath, siteUrl);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  {#if canonical}
    <meta property="og:url" content={canonical} />
  {/if}
  {#if image}
    <meta property="og:image" content={image} />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if image}
    <meta name="twitter:image" content={image} />
  {/if}
</svelte:head>
