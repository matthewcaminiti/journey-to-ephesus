<script lang="ts">
  interface Props {
    progress?: number;
    message?: string;
  }
  
  let { progress = 0, message = 'Loading...' }: Props = $props();
</script>

<div class="absolute inset-0 bg-[var(--bg-panel-solid)]/95 backdrop-blur-sm flex items-center justify-center z-50 transition-colors">
  <div class="text-center">
    <!-- Spinning loader -->
    <div class="relative w-24 h-24 mx-auto mb-8">
      <div class="absolute inset-0 border-2 border-[var(--border-secondary)] rounded-full transition-colors"></div>
      <div 
        class="absolute inset-0 border-2 border-transparent border-t-[var(--accent-gold)] rounded-full animate-spin"
        style="animation-duration: 1.2s;"
      ></div>
      <div 
        class="absolute inset-3 border-2 border-transparent border-t-[var(--accent-gold-light)] rounded-full animate-spin"
        style="animation-duration: 1.8s; animation-direction: reverse;"
      ></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xl font-semibold text-[var(--accent-gold)]" style="font-family: 'Cormorant Garamond', Georgia, serif;">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div class="w-56 h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden mb-4 transition-colors">
      <div 
        class="h-full bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] transition-all duration-300"
        style="width: {progress}%"
      ></div>
    </div>
    
    <!-- Message -->
    <div class="text-sm text-[var(--text-muted)] tracking-wide transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
      {message}
    </div>
  </div>
</div>
