<script lang="ts">
  import { viewerStore, type ViewerState } from '../stores/viewer';
  
  interface Props {
    onResetCamera?: () => void;
  }
  
  let { onResetCamera }: Props = $props();
  
  let state = $state<ViewerState>({
    modelLoading: false,
    modelProgress: 0,
    lightRotation: 0,
    autoRotate: true,
    showGrid: true,
    showStats: false,
    environmentPreset: 'studio',
  });
  
  viewerStore.subscribe(s => state = s);
  
  const environments: { value: ViewerState['environmentPreset']; label: string }[] = [
    { value: 'studio', label: 'Studio' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'dawn', label: 'Dawn' },
    { value: 'night', label: 'Night' },
    { value: 'warehouse', label: 'Gallery' },
  ];
</script>

<div class="panel panel-glow p-6 space-y-5">
  <div class="flex items-center justify-between border-b border-[var(--border-secondary)] pb-4 transition-colors">
    <h3 class="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider transition-colors"
        style="font-family: 'Crimson Text', Georgia, serif;">
      Viewer Settings
    </h3>
    <div class="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-gentle-pulse"></div>
  </div>
  
  <!-- Auto Rotate -->
  <div class="flex items-center justify-between">
    <span class="text-sm text-[var(--text-secondary)] transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">Auto Rotate</span>
    <button
      onclick={() => viewerStore.toggleAutoRotate()}
      aria-label="Toggle auto rotate"
      class="relative w-14 h-7 rounded-full transition-colors duration-200
             {state.autoRotate ? 'bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/50' : 'bg-[var(--bg-hover)] border border-[var(--border-primary)]'}"
    >
      <div 
        class="absolute top-1 w-5 h-5 rounded-full transition-all duration-200 shadow-sm
               {state.autoRotate ? 'left-7 bg-[var(--accent-gold)]' : 'left-1 bg-[var(--text-muted)]'}"
      ></div>
    </button>
  </div>
  
  <!-- Show Grid -->
  <div class="flex items-center justify-between">
    <span class="text-sm text-[var(--text-secondary)] transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">Show Grid</span>
    <button
      onclick={() => viewerStore.toggleGrid()}
      aria-label="Toggle grid visibility"
      class="relative w-14 h-7 rounded-full transition-colors duration-200
             {state.showGrid ? 'bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/50' : 'bg-[var(--bg-hover)] border border-[var(--border-primary)]'}"
    >
      <div 
        class="absolute top-1 w-5 h-5 rounded-full transition-all duration-200 shadow-sm
               {state.showGrid ? 'left-7 bg-[var(--accent-gold)]' : 'left-1 bg-[var(--text-muted)]'}"
      ></div>
    </button>
  </div>
  
  <!-- Light Rotation -->
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-sm text-[var(--text-secondary)] transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">Light Angle</span>
      <span class="text-sm text-[var(--accent-gold)]">{Math.round(state.lightRotation)}°</span>
    </div>
    <input
      type="range"
      min="0"
      max="360"
      value={state.lightRotation}
      oninput={(e) => viewerStore.setLightRotation(Number(e.currentTarget.value))}
      class="w-full h-2 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer transition-colors
             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
             [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[var(--accent-gold)] 
             [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
             [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--accent-gold-light)]
             [&::-webkit-slider-thumb]:shadow-md"
    />
  </div>
  
  <!-- Environment Preset -->
  <div class="space-y-3">
    <span class="text-sm text-[var(--text-secondary)] transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">Lighting</span>
    <div class="grid grid-cols-3 gap-2">
      {#each environments as env}
        <button
          onclick={() => viewerStore.setEnvironment(env.value)}
          class="px-3 py-2 text-xs rounded-full transition-all duration-200
                 {state.environmentPreset === env.value 
                   ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/40' 
                   : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:border-[var(--border-primary)]'}"
          style="font-family: 'Crimson Text', Georgia, serif;"
        >
          {env.label}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Reset Camera -->
  {#if onResetCamera}
    <button
      onclick={onResetCamera}
      class="w-full py-3 text-sm rounded-full
             bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]
             hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/30
             transition-all duration-200"
      style="font-family: 'Crimson Text', Georgia, serif;"
    >
      ↺ Reset View
    </button>
  {/if}
  
  <!-- Performance Stats Toggle -->
  <div class="pt-4 border-t border-[var(--border-secondary)] transition-colors">
    <button
      onclick={() => viewerStore.toggleStats()}
      class="text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
      style="font-family: 'Crimson Text', Georgia, serif;"
    >
      {state.showStats ? '▼ Hide Performance' : '▶ Show Performance'}
    </button>
  </div>
</div>
