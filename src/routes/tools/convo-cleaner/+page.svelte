<script lang="ts">
  import { parseConversation, formatAsMarkdown, formatAsText, type ParseResult } from '$lib/utils/convoParser';

  let fileInput: HTMLInputElement;
  let characterName = '';
  let parseResult: ParseResult | null = null;
  let error = '';
  let isDragging = false;
  let rawFileName = '';

  function handleFile(file: File) {
    error = '';
    parseResult = null;
    rawFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string;
        parseResult = parseConversation(raw);
      } catch (err: unknown) {
        error = err instanceof Error ? err.message : 'Failed to parse file.';
      }
    };
    reader.readAsText(file);
  }

  function onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      handleFile(input.files[0]);
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function onDragLeave() {
    isDragging = false;
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer?.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
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
    parseResult = null;
    error = '';
    rawFileName = '';
    characterName = '';
    if (fileInput) fileInput.value = '';
  }
</script>

<svelte:head>
  <title>Conversation Cleaner | SoulPrompts</title>
  <meta name="description" content="Clean up messy AI Studio conversation exports into beautiful, readable documents. Free tool by SoulPrompts." />
</svelte:head>

<div class="tool-page">
  <div class="tool-container">
    <!-- Header -->
    <div class="tool-header">
      <a href="/" class="back-link">← Back to SoulPrompts</a>
      <h1>Conversation Cleaner</h1>
      <p class="subtitle">Transform messy AI Studio exports into clean, readable conversation documents.</p>
    </div>

    <!-- Upload Zone -->
    {#if !parseResult}
      <div
        class="upload-zone"
        class:dragging={isDragging}
        on:dragover={onDragOver}
        on:dragleave={onDragLeave}
        on:drop={onDrop}
        role="button"
        tabindex="0"
      >
        <div class="upload-icon">📄</div>
        <h3>Drop your AI Studio export here</h3>
        <p>or click to browse</p>
        <input
          type="file"
          accept=".json,.txt"
          on:change={onFileSelect}
          bind:this={fileInput}
        />
        <div class="format-hint">
          Supports JSON files exported from Google AI Studio via Google Drive
        </div>
      </div>

      {#if error}
        <div class="error-bar">
          <span>⚠️</span> {error}
        </div>
      {/if}

      <!-- How it works -->
      <div class="how-it-works">
        <h3>How it works</h3>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div>
              <strong>Export from AI Studio</strong>
              <p>Open your conversation → Download via Google Drive → Get the JSON file</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div>
              <strong>Upload here</strong>
              <p>Drop the file or click to browse. Everything runs in your browser — nothing is sent to any server.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div>
              <strong>Download clean document</strong>
              <p>Get a beautiful Markdown or text file with all the noise removed.</p>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- Results -->
      <div class="results">
        <!-- Stats Bar -->
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-value">{parseResult.stats.totalMessages}</span>
            <span class="stat-label">Messages</span>
          </div>
          <div class="stat">
            <span class="stat-value">{parseResult.stats.userMessages}</span>
            <span class="stat-label">You</span>
          </div>
          <div class="stat">
            <span class="stat-value">{parseResult.stats.characterMessages}</span>
            <span class="stat-label">Character</span>
          </div>
          <div class="stat">
            <span class="stat-value">{parseResult.stats.thinkingBlocksStripped}</span>
            <span class="stat-label">Thinking stripped</span>
          </div>
          <div class="stat highlight">
            <span class="stat-value">{parseResult.stats.originalSizeKb}KB → {parseResult.stats.cleanedSizeKb}KB</span>
            <span class="stat-label">Size reduction</span>
          </div>
        </div>

        <!-- Character Name -->
        <div class="char-name-input">
          <label for="charName">Character name <span class="optional">(optional, for formatting)</span></label>
          <input id="charName" type="text" bind:value={characterName} placeholder="e.g. Meera, Aanya, Shova..." />
        </div>

        <!-- Download Buttons -->
        <div class="download-actions">
          <button class="btn-download md" on:click={downloadMarkdown}>
            📝 Download .md
          </button>
          <button class="btn-download txt" on:click={downloadText}>
            📄 Download .txt
          </button>
          <button class="btn-reset" on:click={reset}>
            ↺ Upload another
          </button>
        </div>

        <!-- Preview -->
        <div class="preview-section">
          <h3>Preview <span class="preview-note">(first 20 messages)</span></h3>
          <div class="preview-window">
            {#each parseResult.messages.slice(0, 20) as msg}
              <div class="preview-msg" class:user={msg.role === 'user'} class:character={msg.role === 'character'}>
                <div class="msg-role">{msg.role === 'user' ? 'You' : characterName || 'Character'}</div>
                <div class="msg-text">{msg.text}</div>
              </div>
            {/each}
            {#if parseResult.messages.length > 20}
              <div class="preview-more">
                ...and {parseResult.messages.length - 20} more messages. Download to see the full conversation.
              </div>
            {/if}
          </div>
        </div>

        <!-- Upsell -->
        <div class="upsell-section">
          <div class="upsell-card">
            <h3>🔥 Want a Continuation Prompt?</h3>
            <p>Get a hand-crafted system prompt that includes your conversation history, so you can seamlessly continue your story with perfect character memory.</p>
            <div class="upsell-price">$10 — delivered within 24 hours</div>
            <a href="mailto:soulprompts@gmail.com?subject=Continuation Prompt Request&body=Hi! I'd like a continuation prompt for my conversation with {characterName || '[character name]'}. Attaching my export file." class="btn-upsell">
              Request via Email →
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .tool-page {
    min-height: 100vh;
    background: var(--bg-primary, #0a0a0f);
    padding: 2rem 1rem 4rem;
  }

  .tool-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .tool-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .back-link {
    display: inline-block;
    color: var(--text-tertiary, #888);
    text-decoration: none;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    transition: color 0.2s;
  }
  .back-link:hover { color: var(--text-primary, #fff); }

  .tool-header h1 {
    font-family: var(--font-display, 'Playfair Display', serif);
    font-size: 2.5rem;
    color: var(--text-primary, #fff);
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: var(--text-secondary, #aaa);
    font-size: 1.1rem;
  }

  /* Upload Zone */
  .upload-zone {
    border: 2px dashed rgba(139, 92, 246, 0.3);
    border-radius: 16px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    background: rgba(139, 92, 246, 0.03);
  }
  .upload-zone:hover, .upload-zone.dragging {
    border-color: rgba(139, 92, 246, 0.6);
    background: rgba(139, 92, 246, 0.08);
  }
  .upload-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .upload-icon { font-size: 3rem; margin-bottom: 1rem; }
  .upload-zone h3 {
    color: var(--text-primary, #fff);
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  .upload-zone p { color: var(--text-tertiary, #888); }
  .format-hint {
    margin-top: 1.5rem;
    font-size: 0.8rem;
    color: var(--text-tertiary, #666);
  }

  .error-bar {
    margin-top: 1rem;
    padding: 0.8rem 1rem;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #f87171;
    font-size: 0.9rem;
  }

  /* How it works */
  .how-it-works {
    margin-top: 3rem;
  }
  .how-it-works h3 {
    color: var(--text-primary, #fff);
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  .steps { display: flex; flex-direction: column; gap: 1rem; }
  .step {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  .step-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.2);
    color: #a78bfa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  .step strong { color: var(--text-primary, #fff); display: block; margin-bottom: 0.3rem; }
  .step p { color: var(--text-tertiary, #999); font-size: 0.85rem; margin: 0; }

  /* Results */
  .stats-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 2rem;
  }
  .stat {
    flex: 1;
    min-width: 100px;
    padding: 0.8rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    text-align: center;
  }
  .stat-value {
    display: block;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-primary, #fff);
  }
  .stat-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-tertiary, #888);
    margin-top: 0.3rem;
  }
  .stat.highlight .stat-value { color: #34d399; }

  .char-name-input {
    margin-bottom: 1.5rem;
  }
  .char-name-input label {
    display: block;
    color: var(--text-secondary, #ccc);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .optional { color: var(--text-tertiary, #666); }
  .char-name-input input {
    width: 100%;
    padding: 0.7rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-primary, #fff);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .char-name-input input:focus {
    border-color: rgba(139, 92, 246, 0.5);
  }

  .download-actions {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  .btn-download {
    flex: 1;
    min-width: 150px;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-download.md {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    color: #fff;
  }
  .btn-download.md:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3); }
  .btn-download.txt {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary, #fff);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .btn-download.txt:hover { background: rgba(255, 255, 255, 0.12); }
  .btn-reset {
    padding: 0.8rem 1.2rem;
    background: transparent;
    color: var(--text-tertiary, #888);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  .btn-reset:hover { color: var(--text-primary, #fff); border-color: rgba(255, 255, 255, 0.2); }

  /* Preview */
  .preview-section h3 {
    color: var(--text-primary, #fff);
    margin-bottom: 1rem;
  }
  .preview-note {
    color: var(--text-tertiary, #666);
    font-size: 0.8rem;
    font-weight: 400;
  }
  .preview-window {
    max-height: 500px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 1rem;
  }
  .preview-msg {
    padding: 0.8rem;
    margin-bottom: 0.5rem;
    border-radius: 10px;
  }
  .preview-msg.user {
    background: rgba(59, 130, 246, 0.08);
    border-left: 3px solid rgba(59, 130, 246, 0.5);
  }
  .preview-msg.character {
    background: rgba(139, 92, 246, 0.08);
    border-left: 3px solid rgba(139, 92, 246, 0.5);
  }
  .msg-role {
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.3rem;
  }
  .preview-msg.user .msg-role { color: #60a5fa; }
  .preview-msg.character .msg-role { color: #a78bfa; }
  .msg-text {
    color: var(--text-secondary, #ccc);
    font-size: 0.9rem;
    line-height: 1.6;
    white-space: pre-wrap;
  }
  .preview-more {
    text-align: center;
    color: var(--text-tertiary, #666);
    font-size: 0.85rem;
    padding: 1rem;
    font-style: italic;
  }

  /* Upsell */
  .upsell-section { margin-top: 2rem; }
  .upsell-card {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.08));
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
  }
  .upsell-card h3 {
    color: var(--text-primary, #fff);
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
  .upsell-card p {
    color: var(--text-secondary, #bbb);
    font-size: 0.95rem;
    max-width: 500px;
    margin: 0 auto 1rem;
    line-height: 1.6;
  }
  .upsell-price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #a78bfa;
    margin-bottom: 1rem;
  }
  .btn-upsell {
    display: inline-block;
    padding: 0.7rem 1.5rem;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.2s;
  }
  .btn-upsell:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3); }

  @media (max-width: 640px) {
    .tool-header h1 { font-size: 1.8rem; }
    .upload-zone { padding: 2rem 1rem; }
    .stats-bar { gap: 0.5rem; }
    .stat { min-width: 80px; padding: 0.6rem; }
    .stat-value { font-size: 1rem; }
    .download-actions { flex-direction: column; }
  }
</style>
