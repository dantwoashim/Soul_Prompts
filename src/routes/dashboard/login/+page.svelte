<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<Seo title="Dashboard Login | SoulPrompts" description="Owner login for the SoulPrompts dashboard." path="/dashboard/login/" noindex={true} />

<div class="min-h-dvh grid place-items-center px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(255,198,62,0.12),_transparent_35%),linear-gradient(180deg,#0b0b0b_0%,#080808_100%)]">
  <div class="w-full max-w-5xl grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
    <div class="space-y-5">
      <div class="eyebrow">Owner Login</div>
      <h1 class="display-section max-w-2xl text-white">Midnight editorial command deck for the whole SoulPrompts site.</h1>
      <p class="max-w-xl text-base leading-8 text-[var(--text-muted)]">Prompts, public/private gating, Patreon links, homepage copy, vault sections, guide steps, and release history all run through this one dashboard.</p>
    </div>

    <form method="POST" class="editorial-panel p-7 md:p-10">
      <div class="eyebrow">Private Access</div>
      <h2 class="font-display mt-4 text-[2.6rem] leading-none tracking-[-0.04em] text-[var(--text)]">Sign in as the owner.</h2>
      <p class="mt-4 text-sm leading-7 text-[var(--text-muted)]">This dashboard is protected by a server-side session cookie and a single owner password.</p>

      <label class="mt-8 block">
        <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Password</div>
        <input class="field-shell mt-3" name="password" type="password" autocomplete="current-password" />
      </label>

      {#if form?.error}
        <div class="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {form.error}
        </div>
      {/if}

      <button class="gold-button mt-8 w-full justify-center" type="submit">Enter Dashboard</button>
    </form>
  </div>
</div>
