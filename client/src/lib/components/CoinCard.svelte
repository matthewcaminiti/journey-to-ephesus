<script lang="ts">
  import type { Coin } from '../api';
  
  interface Props {
    coin: Coin;
    index?: number;
  }
  
  let { coin, index = 0 }: Props = $props();
  
  const formatYear = (year: string | null) => {
    if (!year) return 'Unknown';
    // Handle string ranges like "244-249" or negative years like "-330"
    const parts = year.split('-').filter(p => p.trim());
    
    // Check if it's a negative year (starts with -)
    if (year.startsWith('-')) {
      const num = parseInt(year);
      return isNaN(num) ? year : `${Math.abs(num)} BCE`;
    }
    
    // Handle ranges
    if (parts.length === 2) {
      return `${parts[0]} – ${parts[1]} CE`;
    }
    
    const num = parseInt(year);
    if (isNaN(num)) return year;
    return num < 0 ? `${Math.abs(num)} BCE` : `${num} CE`;
  };
  
  const getMetalColor = (metal: string | null) => {
    switch (metal?.toLowerCase()) {
      case 'gold': return 'from-[#daa520] to-[#b8860b]';
      case 'silver': return 'from-[#a8a8a8] to-[#c0c0c0]';
      case 'bronze': return 'from-[#cd7f32] to-[#b87333]';
      case 'copper': return 'from-[#b87333] to-[#a0522d]';
      case 'electrum': return 'from-[#cfb53b] to-[#daa520]';
      default: return 'from-[var(--accent-bronze)] to-[var(--accent-gold)]';
    }
  };
</script>

<a 
  href="/coin/{coin.id}"
  class="group block panel overflow-hidden animate-fade-in-up opacity-0 
         hover:shadow-xl hover:shadow-[var(--accent-gold)]/10 hover:-translate-y-1 transition-all duration-300"
  style="animation-fill-mode: forwards; animation-delay: {index * 0.06}s;"
>
  <!-- Thumbnail Area -->
  <div class="relative aspect-square bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-hover)] overflow-hidden transition-colors">
    {#if coin.thumbnail_url}
      <img 
        src={coin.thumbnail_url} 
        alt={coin.name}
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center">
        <!-- Decorative coin placeholder -->
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br {getMetalColor(coin.metal)} opacity-30 
                      group-hover:opacity-50 transition-opacity duration-300 shadow-inner"></div>
          <div class="absolute inset-2 rounded-full border-2 border-dashed border-[var(--text-muted)]/30"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-3xl text-[var(--text-muted)]/60 group-hover:text-[var(--accent-gold)]/60 transition-colors">☉</span>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Hover Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#2a241e]/90 via-[#2a241e]/20 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="absolute bottom-4 left-4 right-4">
        <div class="text-sm text-[#f5efe4] flex items-center gap-2" style="font-family: 'Crimson Text', Georgia, serif;">
          <span>View Details</span>
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
    
    <!-- Metal indicator badge -->
    {#if coin.metal}
      <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider
                  bg-[var(--bg-panel)]/90 text-[var(--text-secondary)] shadow-sm backdrop-blur-sm transition-colors">
        {coin.metal}
      </div>
    {/if}
  </div>
  
  <!-- Info Area -->
  <div class="p-5">
    <h3 class="font-semibold text-lg text-[var(--text-primary)] mb-2 line-clamp-1 group-hover:text-[var(--accent-gold)] transition-colors"
        style="font-family: 'Cormorant Garamond', Georgia, serif;">
      {coin.name}
    </h3>
    
    <div class="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4">
      <span class="px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] transition-colors">
        {formatYear(coin.year)}
      </span>
      {#if coin.mint}
        <span class="px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] truncate max-w-[100px] transition-colors">
          {coin.mint}
        </span>
      {/if}
    </div>
    
    {#if coin.description}
      <p class="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed transition-colors" 
         style="font-family: 'Crimson Text', Georgia, serif;">
        {coin.description}
      </p>
    {/if}
    
    <!-- Metadata Row -->
    <div class="mt-4 pt-4 border-t border-[var(--border-secondary)] flex items-center justify-between text-xs transition-colors">
      <div class="flex items-center gap-3 text-[var(--text-muted)]">
        {#if coin.weight_grams}
          <span>{coin.weight_grams}g</span>
        {/if}
        {#if coin.diameter_mm}
          <span>⌀ {coin.diameter_mm}mm</span>
        {/if}
      </div>
      <div class="text-[var(--accent-gold)]/60 group-hover:text-[var(--accent-gold)] transition-colors">
        #{coin.id.slice(0, 6)}
      </div>
    </div>
  </div>
</a>
