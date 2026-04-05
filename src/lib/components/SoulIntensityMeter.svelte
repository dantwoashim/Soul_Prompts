<script lang="ts">
  /** Reusable Soul Intensity Meter component */
  export let label: string;
  export let value: number; // 0–100
  export let color: 'amber' | 'violet' | 'dim' = 'amber';
</script>

<div class="space-y-2">
  <div class="flex justify-between items-end">
    <span class="text-sm font-[Manrope]" style="color: #e5e1e4;">{label}</span>
    <span
      class="text-xs font-[Manrope]"
      style="color: {color === 'amber' ? '#ffb95a' : color === 'violet' ? '#e0b6ff' : '#e5e1e4'};"
    >{value}%</span>
  </div>

  <div class="intensity-track">
    <div
      class="intensity-fill-{color}"
      style="width: {value}%;"
    ></div>
  </div>
</div>
