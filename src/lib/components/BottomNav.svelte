<script lang="ts">
  import { page } from '$app/stores';
  import type { NavigationDocument } from '$lib/cms/types';

  export let links: NavigationDocument['mobileLinks'];

  $: currentPath = $page.url.pathname;

  function isActive(href: string) {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  }
</script>

<nav
  class="fixed inset-x-0 bottom-0 z-50 border-t border-transparent md:hidden"
  style="background: rgba(13, 13, 13, 0.88); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
  aria-label="Primary navigation"
>
  <div class="absolute inset-x-0 top-0 h-px" style="background: linear-gradient(to right, transparent, rgba(255, 198, 62, 0.28), transparent);"></div>
  <div class="grid h-20 grid-cols-4 px-2">
    {#each links as tab}
      {@const active = isActive(tab.href)}
      <a
        href={tab.href}
        class={`flex flex-col items-center justify-center gap-1 px-2 py-2 transition-colors duration-200 ${active ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'}`}
        aria-current={active ? 'page' : undefined}
      >
        <span class="material-symbols-outlined text-[22px]" style={active ? "font-variation-settings: 'FILL' 1, 'wght' 300, 'opsz' 24; color: var(--gold);" : ''}>
          {tab.icon}
        </span>
        <span class="text-[0.58rem] uppercase tracking-[0.18em]">{tab.label}</span>
      </a>
    {/each}
  </div>
</nav>
