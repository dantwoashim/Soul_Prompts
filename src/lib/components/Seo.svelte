<script lang="ts">
  import { getAbsoluteUrl } from '$lib/utils/seo';

  export let title: string;
  export let description: string;
  export let path = '/';

  $: canonical = getAbsoluteUrl(path);
  $: image = getAbsoluteUrl('/social-card.svg');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={image} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>
