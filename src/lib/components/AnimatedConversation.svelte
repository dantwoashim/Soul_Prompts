<script lang="ts">
  import { onMount } from 'svelte';
  import type { SampleLine } from '$lib/content/types';

  export let lines: SampleLine[] = [];
  export let characterName = 'Character';
  export let autoPlay = true;
  export let speed = 1200;

  let visibleCount = 0;
  let showTyping = false;

  onMount(() => {
    if (!autoPlay || lines.length === 0) {
      visibleCount = lines.length;
      return;
    }

    function showNext() {
      if (visibleCount >= lines.length) return;

      showTyping = true;

      setTimeout(() => {
        showTyping = false;
        visibleCount++;

        if (visibleCount < lines.length) {
          setTimeout(showNext, speed * 0.3);
        }
      }, speed);
    }

    const timer = setTimeout(showNext, 600);
    return () => clearTimeout(timer);
  });
</script>

<div class="transcript animated-transcript">
  {#each lines.slice(0, visibleCount) as line, i}
    <div
      class="message {line.speaker === 'user' ? 'message-user' : 'message-character'}"
      style="animation: fade-in-up 0.4s var(--ease-out) both; animation-delay: {i * 0.05}s;"
    >
      <span class="message-speaker">{line.speaker === 'user' ? 'You' : characterName}</span>
      {line.text}
    </div>
  {/each}

  {#if showTyping && visibleCount < lines.length}
    <div class="message {lines[visibleCount].speaker === 'user' ? 'message-user' : 'message-character'} typing-indicator">
      <span class="message-speaker">
        {lines[visibleCount].speaker === 'user' ? 'You' : characterName}
      </span>
      <span class="typing-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
    </div>
  {/if}
</div>

<style>
  .animated-transcript {
    min-height: 200px;
  }

  .typing-indicator {
    opacity: 0.6;
  }

  .typing-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    height: 1.2em;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--text-secondary);
    animation: dot-bounce 1.4s ease-in-out infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.16s; }
  .dot:nth-child(3) { animation-delay: 0.32s; }

  @keyframes dot-bounce {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }
</style>
