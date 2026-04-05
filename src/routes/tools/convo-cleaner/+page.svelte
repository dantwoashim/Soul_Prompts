<script lang="ts">
  import { onDestroy } from 'svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { parseConversation, formatAsMarkdown, formatAsText, type ParseResult } from '$lib/utils/convoParser';

  let fileInput: HTMLInputElement;
  let characterName = '';
  let parseResult: ParseResult | null = null;
  let parseError = '';
  let isDragging = false;
  let progress = 0;
  let progressTimer: ReturnType<typeof setInterval> | null = null;

  function clearProgressTimer() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  function handleFile(file: File) {
    parseError = '';
    parseResult = null;
    progress = 0;
    clearProgressTimer();

    const reader = new FileReader();
    reader.onload = (e) => {
      let pct = 0;
      progressTimer = setInterval(() => {
        pct = Math.min(pct + 12, 95);
        progress = pct;
        if (pct >= 95) {
          clearProgressTimer();
        }
      }, 60);

      try {
        const raw = e.target?.result as string;
        parseResult = parseConversation(raw);
        progress = 100;
      } catch (err: unknown) {
        parseError = err instanceof Error ? err.message : 'Failed to parse file.';
        progress = 0;
      } finally {
        clearProgressTimer();
      }
    };
    reader.onerror = () => {
      clearProgressTimer();
      parseError = 'Failed to read file.';
      progress = 0;
    };
    reader.readAsText(file);
  }

  function onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) handleFile(input.files[0]);
  }

  function onDragOver(e: DragEvent) { e.preventDefault(); isDragging = true; }
  function onDragLeave() { isDragging = false; }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer?.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadMarkdown() {
    if (!parseResult) return;
    const md = formatAsMarkdown(parseResult.messages, characterName || undefined);
    const name = characterName ? characterName.toLowerCase().replace(/\s+/g, '-') : 'conversation';
    downloadFile(md, `${name}-cleaned.md`);
  }

  function downloadText() {
    if (!parseResult) return;
    const txt = formatAsText(parseResult.messages, characterName || undefined);
    const name = characterName ? characterName.toLowerCase().replace(/\s+/g, '-') : 'conversation';
    downloadFile(txt, `${name}-cleaned.txt`);
  }

  function reset() {
    clearProgressTimer();
    parseResult = null;
    parseError = '';
    characterName = '';
    progress = 0;
    if (fileInput) fileInput.value = '';
  }

  onDestroy(() => {
    clearProgressTimer();
  });
</script>

<Seo
  title="Conversation Cleaner | SoulPrompts"
  description="Transform raw conversation exports into clean, readable documents with this free in-browser tool from SoulPrompts."
  path="/tools/convo-cleaner/"
/>

<!-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     Desktop: 2-col split
       LEFT (sticky): header + upload zone + how it works
       RIGHT (scrollable): results / upsell
     Mobile: single column
     â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
<div class="min-h-screen lg:flex">

  <!-- â”€â”€ LEFT PANEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
  <div class="lg:w-[48%] lg:flex-shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
              px-8 lg:px-14 pt-10 lg:pt-16 pb-8 space-y-10">

    <!-- Header -->
    <div>
      <span class="block text-xs uppercase tracking-[0.25em] mb-4 font-[Manrope]" style="color: #e0b6ff;">Free Tool</span>
      <h1 class="font-[Newsreader] italic text-[#e5e1e4] leading-tight mb-4"
        style="font-size: clamp(2.5rem, 5vw, 4.5rem);">Conversation<br/>Cleaner</h1>
      <p class="font-[Manrope] text-sm leading-relaxed" style="color: #c9c4d8;">
        Don't let your stories die in messy exports. Transform raw conversation logs into polished, readable prose.
      </p>
    </div>

    {#if !parseResult}
      <!-- â”€â”€ Upload Zone â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
      <div class="relative group">
        <!-- glow backdrop -->
        <div
          class="absolute -inset-0.5 opacity-15 group-hover:opacity-30 transition duration-500 blur-xl"
          style="background: linear-gradient(to right, #e0b6ff, #bb6bfb);"
        ></div>

        <label
          class="relative flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all"
          style="
            aspect-ratio: 16/9;
            background: #0e0e10;
            border: 2px dashed rgba(72,69,85,{isDragging ? '0.7' : '0.25'});
            border-radius: 0.25rem;
          "
          ondragover={onDragOver}
          ondragleave={onDragLeave}
          ondrop={onDrop}
        >
          <input bind:this={fileInput} accept=".json,.txt" class="hidden" type="file" onchange={onFileSelect} />
          <span class="material-symbols-outlined text-4xl mb-4" style="color: #e0b6ff;">upload_file</span>
          <span class="font-[Newsreader] text-xl italic text-[#e5e1e4] mb-1">Drop Artifact Here</span>
          <span class="text-xs uppercase tracking-widest font-[Manrope]" style="color: #928ea1;">.json or .txt exports</span>

          <!-- Corner accents -->
          <div class="absolute top-4 left-4 w-5 h-5 border-t border-l" style="border-color: rgba(224,182,255,0.4);"></div>
          <div class="absolute bottom-4 right-4 w-5 h-5 border-b border-r" style="border-color: rgba(224,182,255,0.4);"></div>
        </label>
      </div>

      <!-- Error -->
      {#if parseError}
        <div class="px-4 py-3 rounded-sm text-sm font-[Manrope]" style="background: rgba(147,0,10,0.15); border: 1px solid rgba(255,180,171,0.2); color: #ffb4ab;">
          âš  {parseError}
        </div>
      {/if}

      <!-- How it works -->
      <div class="space-y-4">
        <p class="text-xs uppercase tracking-widest font-[Manrope]" style="color: #484555;">How it works</p>
        {#each [
          'Export your conversation as a JSON file from your chat workspace',
          'Drop the file above. Everything runs in your browser, and nothing is sent to any server.',
          'Download a clean, formatted Markdown or chapterized text output instantly'
        ] as step, i}
          <div class="flex items-start gap-3 text-sm font-[Manrope]" style="color: #c9c4d8;">
            <span class="flex-none w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
              style="background: rgba(224,182,255,0.1); color: #e0b6ff;">{i+1}</span>
            {step}
          </div>
        {/each}
      </div>
    {:else}
      <!-- â”€â”€ Left panel when results visible: stats + inputs â”€â”€ -->
      <div class="space-y-8">
        <!-- Progress bar -->
        {#if progress < 100}
          <div class="space-y-3">
            <div class="flex justify-between text-xs font-[Manrope]">
              <span style="color: #ffb95a;">Cleaning in progress...</span>
              <span style="color: #928ea1;">{progress}%</span>
            </div>
            <div class="intensity-track">
              <div class="intensity-fill-amber" style="width: {progress}%;"></div>
            </div>
          </div>
        {:else}
          <!-- Stats grid -->
          <div class="grid grid-cols-2 gap-3">
            {#each [
              { label: 'Total Messages', value: parseResult!.stats.totalMessages },
              { label: 'Your Messages', value: parseResult!.stats.userMessages },
              { label: 'Character', value: parseResult!.stats.characterMessages },
              { label: 'Thinking Stripped', value: parseResult!.stats.thinkingBlocksStripped },
            ] as stat}
              <div class="p-4 rounded-sm" style="background: #1b1b1d;">
                <span class="block font-[Newsreader] text-2xl text-[#e5e1e4]">{stat.value}</span>
                <span class="block text-[10px] uppercase tracking-widest font-[Manrope] mt-1" style="color: #928ea1;">{stat.label}</span>
              </div>
            {/each}
          </div>

          <!-- Size reduction -->
          <div class="p-4 rounded-sm text-center" style="background: #1b1b1d;">
            <span class="font-[Newsreader] text-xl" style="color: #ffb95a;">
              {parseResult!.stats.originalSizeKb}KB â†’ {parseResult!.stats.cleanedSizeKb}KB
            </span>
            <span class="block text-[10px] uppercase tracking-widest font-[Manrope] mt-1" style="color: #928ea1;">Size reduction</span>
          </div>

          <!-- Character name input -->
          <div>
            <label for="charName" class="block text-xs uppercase tracking-widest font-[Manrope] mb-2" style="color: #928ea1;">Character name (optional)</label>
            <input
              id="charName"
              type="text"
              bind:value={characterName}
              placeholder="e.g. Megha, Aanya..."
              class="w-full bg-transparent text-[#e5e1e4] placeholder:text-[#484555] font-[Manrope] py-3 px-0 outline-none text-sm"
              style="border-bottom: 1px solid rgba(72,69,85,0.3);"
            />
          </div>

          <!-- Download buttons -->
          <div class="space-y-3">
            <button onclick={downloadMarkdown}
              class="w-full h-14 font-[Manrope] text-sm font-bold uppercase tracking-widest flex items-center justify-between px-6 active:scale-95 rounded-sm"
              style="background: linear-gradient(135deg, #e0b6ff, #bb6bfb); color: #42006e;">
              <span>Download Markdown</span>
              <span class="material-symbols-outlined">arrow_downward</span>
            </button>
            <button onclick={downloadText}
              class="w-full h-12 bg-transparent font-[Manrope] text-sm uppercase tracking-widest flex items-center justify-between px-6 text-[#e5e1e4] rounded-sm"
              style="border: 1px solid rgba(72,69,85,0.15);">
              <span>Download Chapterized</span>
              <span class="material-symbols-outlined">book</span>
            </button>
            <button onclick={reset}
              class="w-full h-10 bg-transparent font-[Manrope] text-xs uppercase tracking-widest text-[#928ea1] hover:text-[#e5e1e4] transition-colors">
              â†º Upload another file
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Powered by footer -->
    <div class="pt-4" style="opacity: 0.3;">
      <p class="text-[10px] font-[Manrope] uppercase tracking-tighter">Local browser processing</p>
    </div>
  </div>

  <!-- â”€â”€ RIGHT PANEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
  <div class="flex-1 border-l hidden lg:flex flex-col justify-center px-14 py-16"
    style="border-color: rgba(72,69,85,0.06); background: #0e0e10;">

    {#if !parseResult}
      <!-- Placeholder / explainer art -->
      <div class="space-y-16 max-w-md">
        <div>
          <span class="material-symbols-outlined block mb-6" style="font-size: 48px; color: rgba(224,182,255,0.3);">cleaning_services</span>
          <h2 class="font-[Newsreader] text-3xl italic text-[#e5e1e4] mb-4">What this tool does</h2>
          <p class="font-[Manrope] text-sm leading-relaxed" style="color: #c9c4d8;">
            Conversation exports usually contain a lot of noise: hidden reasoning blocks, metadata, and formatting artifacts. This tool strips that out and gives you clean, readable prose for archiving, continuing, or sharing your character conversations.
          </p>
        </div>

        <div class="space-y-6">
          {#each [
            ['Removes hidden reasoning blocks', 'Strips non-conversational scaffolding from exports'],
            ['Formats dialogue', 'Structures exchanges into clean user/character blocks'],
            ['In-browser only', '100% client-side â€” your data never leaves your device'],
          ] as [title, desc]}
            <div class="flex items-start gap-4">
              <span class="material-symbols-outlined text-[#e0b6ff] flex-none" style="font-size: 18px; font-variation-settings: 'FILL' 1;">check_circle</span>
              <div>
                <p class="text-sm font-[Manrope] font-bold text-[#e5e1e4]">{title}</p>
                <p class="text-xs font-[Manrope] mt-0.5" style="color: #928ea1;">{desc}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Continuity Pack upsell on right panel after results -->
      <div class="max-w-md space-y-8">
        <!-- Preview snippet -->
        {#if parseResult && parseResult.messages.length > 0}
        <div>
          <p class="text-xs uppercase tracking-widest font-[Manrope] mb-4" style="color: #928ea1;">Preview</p>
          <div class="space-y-4 max-h-72 overflow-y-auto no-scrollbar pr-2">
            {#each parseResult.messages.slice(0, 6) as msg}
              <div class="pl-4 border-l" style="border-color: rgba(72,69,85,{msg.role === 'character' ? '0.4' : '0.15'});">
                <p class="text-[10px] uppercase tracking-widest font-[Manrope] mb-1" style="color: {msg.role === 'character' ? '#e0b6ff' : '#928ea1'};">
                  {msg.role === 'user' ? 'You' : characterName || 'Character'}
                </p>
                <p class="text-sm font-[Manrope] leading-relaxed" style="color: rgba(229,225,228,0.8);">{msg.text.slice(0, 200)}{msg.text.length > 200 ? 'â€¦' : ''}</p>
              </div>
            {/each}
          </div>
        </div>
        {/if}

        <!-- Continuity Pack upsell -->
        <div class="p-8 rounded-sm relative overflow-hidden" style="background: #1b1b1d; border: 1px solid rgba(72,69,85,0.08);">
          <div class="absolute -top-20 -right-20 w-40 h-40 rounded-full" style="background: rgba(224,182,255,0.06); filter: blur(60px);"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-4">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-[Manrope] font-bold uppercase tracking-widest" style="background: rgba(255,185,90,0.15); color: #ffb95a;">Premium Service</span>
            </div>
            <h3 class="font-[Newsreader] text-2xl text-[#e5e1e4] mb-3">Continuity Pack</h3>
            <p class="font-[Manrope] text-sm leading-relaxed mb-6" style="color: #c9c4d8;">
              A custom summary + memory restoration packet â€” designed to keep your character alive across sessions.
            </p>
            <ul class="space-y-3 mb-8">
              {#each ['Contextual Narrative Summary', 'Lore-Book Injection Keys', 'Character State Snapshot'] as feat}
                <li class="flex items-start gap-3 text-xs font-[Manrope]" style="color: rgba(229,225,228,0.8);">
                  <span class="material-symbols-outlined text-[#e0b6ff]" style="font-size: 14px; font-variation-settings: 'FILL' 1;">check_circle</span>{feat}
                </li>
              {/each}
            </ul>
            <a href="mailto:soulprompts@gmail.com?subject=Continuation Pack Request"
              class="flex items-center justify-between w-full py-4 px-6 font-[Manrope] text-xs uppercase tracking-[0.2em] rounded-sm transition-colors"
              style="border: 1px solid rgba(255,185,90,0.25); color: #ffb95a;">
              Request Continuation
              <span class="material-symbols-outlined" style="font-size: 16px;">bolt</span>
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Mobile: results panel (single column) -->
  {#if parseResult && progress >= 100}
  <div class="lg:hidden px-8 pb-20 space-y-8">
    <!-- Preview -->
    {#if parseResult.messages.length > 0}
    <div>
      <p class="text-xs uppercase tracking-widest font-[Manrope] mb-4" style="color: #928ea1;">Preview</p>
      <div class="space-y-3">
        {#each parseResult.messages.slice(0, 4) as msg}
          <div class="pl-4 border-l" style="border-color: rgba(72,69,85,{msg.role === 'character' ? '0.4' : '0.15'});">
            <p class="text-[10px] uppercase tracking-widest font-[Manrope] mb-1" style="color: {msg.role === 'character' ? '#e0b6ff' : '#928ea1'};">
              {msg.role === 'user' ? 'You' : characterName || 'Character'}
            </p>
            <p class="text-sm font-[Manrope] leading-relaxed" style="color: rgba(229,225,228,0.8);">{msg.text.slice(0, 150)}{msg.text.length > 150 ? 'â€¦' : ''}</p>
          </div>
        {/each}
      </div>
    </div>
    {/if}

    <!-- Continuity upsell (mobile) -->
    <div class="p-8 rounded-sm relative overflow-hidden" style="background: #1b1b1d; border: 1px solid rgba(72,69,85,0.1);">
      <div class="relative z-10 space-y-4">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-[Manrope]" style="background: rgba(255,185,90,0.15); color: #ffb95a;">Premium Service</span>
        <h3 class="font-[Newsreader] text-2xl text-[#e5e1e4]">Continuity Pack</h3>
        <p class="text-xs font-[Manrope] leading-relaxed" style="color: #c9c4d8;">Keep your characters alive across sessions with a custom memory restoration packet.</p>
        <a href="mailto:soulprompts@gmail.com?subject=Continuation Pack Request"
          class="flex items-center justify-between w-full py-4 font-[Manrope] text-xs uppercase tracking-[0.2em]"
          style="border-top: 1px solid rgba(72,69,85,0.15); color: #ffb95a;">
          Request Continuation
          <span class="material-symbols-outlined" style="font-size: 16px;">bolt</span>
        </a>
      </div>
    </div>
  </div>
  {/if}
</div>
