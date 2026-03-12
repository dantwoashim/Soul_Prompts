<script lang="ts">
  import '../app.css';
  import GradientOrbs from '../lib/components/GradientOrbs.svelte';
  import SiteFooter from '../lib/components/SiteFooter.svelte';
  import SiteHeader from '../lib/components/SiteHeader.svelte';

  const hasPlausible = Boolean(import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN && import.meta.env.PUBLIC_PLAUSIBLE_SRC);
</script>

<svelte:head>
  {#if hasPlausible}
    <script
      defer
      data-domain={import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN}
      src={import.meta.env.PUBLIC_PLAUSIBLE_SRC}
    ></script>
  {/if}
</svelte:head>

<div class="site-shell">
  <GradientOrbs />
  <div class="shell-frame">
    <SiteHeader />
    <slot />
    <SiteFooter />
  </div>
</div>
