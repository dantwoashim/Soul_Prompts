<script lang="ts">
  import { page } from '$app/stores';
  import type { NavigationDocument } from '$lib/cms/types';

  export let navigation: NavigationDocument;

  $: pathname = $page.url.pathname;
  $: links = navigation.links;

  function isActive(href: string): boolean {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }
</script>

<header class="fixed inset-x-0 top-0 z-50 transition-all duration-300">
  <div class="bg-[var(--bg)]/75 backdrop-blur-2xl border-b border-white/5 shadow-lg shadow-black/20">
    <div class="site-wrap-wide flex h-20 items-center justify-between gap-6">
      <a href="/" class="flex min-w-0 items-center gap-3 group">
        <span class="material-symbols-outlined text-[20px] text-[var(--gold)] group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)] transition-all">auto_stories</span>
        <div class="min-w-0">
          <div class="font-display text-[1.55rem] leading-none tracking-tight font-medium text-white group-hover:text-[var(--gold)] transition-colors">{navigation.brandName}</div>
          <div class="hidden text-[0.6rem] uppercase tracking-widest text-[var(--gold)] font-bold sm:block opacity-80">
            {navigation.brandTagline}
          </div>
        </div>
      </a>

      <nav class="hidden items-center gap-8 md:flex" aria-label="Primary">
        {#each links as link}
          <a
            href={link.href}
            class="text-[0.7rem] uppercase tracking-widest font-bold transition-colors {isActive(link.href) ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-[var(--text-dim)] hover:text-white'}"
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            <span class="link-underline">{link.label}</span>
          </a>
        {/each}
      </nav>

      <div class="flex items-center gap-2">
        <a href="/learn/guide/" class="hidden text-[0.7rem] uppercase tracking-widest font-bold text-[var(--text-dim)] hover:text-white sm:inline-flex md:hidden transition-colors">
          Guide
        </a>
        <a href={navigation.ctaHref} class="gold-button px-5 py-2.5 text-[0.7rem] shadow-md shadow-[var(--gold)]/20">
          {navigation.ctaLabel}
        </a>
      </div>
    </div>
  </div>
</header>
