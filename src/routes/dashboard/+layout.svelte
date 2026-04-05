<script lang="ts">
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: isLogin = $page.url.pathname.startsWith('/dashboard/login');
  $: sessionEndsAt = $page.data.adminSession?.expiresAt
    ? new Date($page.data.adminSession.expiresAt).toLocaleString()
    : 'Session inactive';
  $: navLinks = [
    {
      href: '/dashboard/',
      label: 'Overview',
      active: $page.url.pathname === '/dashboard/'
    },
    {
      href: '/dashboard/prompts/',
      label: 'Prompt Studio',
      active: $page.url.pathname.startsWith('/dashboard/prompts')
    },
    {
      href: '/dashboard/site/home/',
      label: 'Site Studio',
      active: $page.url.pathname.startsWith('/dashboard/site')
    }
  ];
</script>

{#if isLogin}
  <slot />
{:else}
  <div class="dashboard-shell">
    <div class="grid min-h-dvh lg:grid-cols-[280px_1fr]">
      <aside class="dashboard-rail border-r border-white/6">
        <div class="sticky top-0 flex h-dvh flex-col gap-8 p-6 lg:p-8">
          <a href="/dashboard/" class="block">
            <div class="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-[var(--gold)]">Owner Dashboard</div>
            <div class="font-display mt-3 text-[2.6rem] leading-none tracking-[-0.05em] text-white">SoulPrompts</div>
            <p class="mt-3 text-sm leading-7 text-[var(--text-muted)]">Editorial control room for prompts, site copy, Patreon gating, and releases.</p>
          </a>

          <div class="command-card p-4">
            <div class="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--text-dim)]">Live Control</div>
            <div class="mt-4 grid gap-3 text-sm">
              <div class="flex items-center justify-between gap-4">
                <span class="text-[var(--text-muted)]">Private prompts</span>
                <span class="font-semibold text-white">{data.overview.totals.privatePrompts}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-[var(--text-muted)]">Broken Patreon links</span>
                <span class="font-semibold text-white">{data.overview.totals.brokenPatreonLinks}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-[var(--text-muted)]">SEO gaps</span>
                <span class="font-semibold text-white">{data.overview.totals.missingSeo}</span>
              </div>
            </div>
          </div>

          <nav class="grid gap-2 text-sm">
            {#each navLinks as link}
              <a href={link.href} class="dashboard-nav-link" data-active={link.active}>{link.label}</a>
            {/each}
          </nav>

          <div class="command-card p-4">
            <div class="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--text-dim)]">Draft Status</div>
            <div class="mt-4 grid gap-3">
              <div class="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                <div class="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-dim)]">Prompts</div>
                <div class="mt-2 font-display text-4xl text-white">{data.overview.totals.prompts}</div>
              </div>
              <div class="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                <div class="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-dim)]">Unpublished Drafts</div>
                <div class="mt-2 font-display text-4xl text-white">{data.overview.totals.unpublishedDrafts}</div>
              </div>
            </div>
          </div>

          <div class="command-card mt-auto p-4">
            <div class="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--text-dim)]">Session</div>
            <div class="mt-3 text-sm leading-7 text-[var(--text-muted)]">Ends {sessionEndsAt}</div>
          </div>

          <form method="POST" action="/dashboard/logout/">
            <button class="ghost-button w-full justify-center" type="submit">Log Out</button>
          </form>
        </div>
      </aside>

      <div class="dashboard-main min-w-0">
        <slot />
      </div>
    </div>
  </div>
{/if}
