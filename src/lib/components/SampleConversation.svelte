<script lang="ts">
  import type { SampleLine } from '$lib/content/types';

  export let lines: SampleLine[] = [];
  export let characterName = 'Character';
</script>

<div class="transcript">
  {#each lines as line}
    <div class={`message ${line.speaker === 'user' ? 'message-user' : 'message-character'}`}>
      <span class="message-speaker">{line.speaker === 'user' ? 'You' : characterName}</span>
      {line.text}
    </div>
  {/each}
</div>
