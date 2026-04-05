<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: hideFooter = $page.url.pathname.startsWith('/dashboard');
  $: hideChrome = $page.url.pathname.startsWith('/dashboard');
  $: shell = data.shell;
  $: hasPlausible = Boolean(shell?.settings?.plausibleDomain && shell?.settings?.plausibleSrc);
</script>

<svelte:head>
  {#if hasPlausible}
    <script
      defer
      data-domain={shell.settings.plausibleDomain}
      src={shell.settings.plausibleSrc}
    ></script>
  {/if}
</svelte:head>

<div class="page-shell relative min-h-dvh overflow-hidden bg-[var(--bg)] text-[var(--text)]">
  <!-- Volumetric ambient light orbs -->
  <div class="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden z-[-1]">
    <div class="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[var(--gold)] opacity-[0.04] blur-[120px]"></div>
    <div class="absolute top-[40%] -right-[10%] h-[700px] w-[700px] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[140px]"></div>
    <div class="absolute -bottom-[20%] left-[20%] h-[500px] w-[500px] rounded-full bg-[var(--gold-deep)] opacity-[0.03] blur-[130px]"></div>
  </div>

  <div class="relative z-10">
    {#if !hideChrome}
      <SiteHeader navigation={shell.navigation} />
      <BottomNav links={shell.navigation.mobileLinks} />
    {/if}

    <main class={`min-h-dvh ${hideChrome ? '' : 'pt-20 pb-24 md:pb-0'}`}>
      <slot />
    </main>

    {#if !hideFooter && !hideChrome}
      <SiteFooter footer={shell.footer} />
    {/if}
  </div>
</div>
