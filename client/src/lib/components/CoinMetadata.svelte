<script lang="ts">
  import type { Coin } from '../api';
  
  interface Props {
    coin: Coin;
  }
  
  let { coin }: Props = $props();
  
  const formatYear = (year: string | null) => {
    if (!year) return 'Unknown';
    
    // Check if it's a negative year (starts with -)
    if (year.startsWith('-')) {
      const num = parseInt(year);
      return isNaN(num) ? year : `${Math.abs(num)} BCE`;
    }
    
    // Handle ranges like "244-249"
    const parts = year.split('-').filter(p => p.trim());
    if (parts.length === 2) {
      return `${parts[0]} CE – ${parts[1]} CE`;
    }
    
    const num = parseInt(year);
    if (isNaN(num)) return year;
    return `${num} CE`;
  };
  
  const metadataFields = $derived([
    { label: 'Year', value: formatYear(coin.year), icon: '⏳' },
    { label: 'Mint', value: coin.mint || 'Unknown', icon: '🏛' },
    { label: 'Denomination', value: coin.denomination || 'Unknown', icon: '⚱' },
    { label: 'Metal', value: coin.metal || 'Unknown', icon: '⬡' },
    { label: 'Weight', value: coin.weight_grams ? `${coin.weight_grams}g` : 'Unknown', icon: '⚖' },
    { label: 'Diameter', value: coin.diameter_mm ? `${coin.diameter_mm}mm` : 'Unknown', icon: '◎' },
  ]);

  // Additional metadata for expanded details
  const hasGradingInfo = $derived(coin.grade || coin.catalog_reference);
  const hasLegends = $derived(coin.obverse_legend || coin.reverse_legend);
  const hasDetailedDescriptions = $derived(coin.obverse_description || coin.reverse_description);
</script>

<div class="panel panel-glow p-6">
  <div class="flex items-center justify-between border-b border-[var(--border-secondary)] pb-4 mb-5 transition-colors">
    <h3 class="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider transition-colors"
        style="font-family: 'Crimson Text', Georgia, serif;">
      Artifact Details
    </h3>
    <span class="text-xs text-[var(--text-muted)] transition-colors">#{coin.id.slice(0, 8)}</span>
  </div>
  
  <!-- Title -->
  <h2 class="text-xl font-semibold text-[var(--text-primary)] mb-2 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
    {coin.name}
  </h2>
  
  <!-- Ruler -->
  {#if coin.ruler}
    <div class="text-sm text-[var(--accent-gold)] mb-3 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
      {coin.ruler}
    </div>
  {/if}
  
  <!-- Description -->
  {#if coin.description}
    <p class="text-[var(--text-secondary)] leading-relaxed mb-6 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
      {coin.description}
    </p>
  {/if}
  
  <!-- Metadata Grid -->
  <div class="grid grid-cols-2 gap-3">
    {#each metadataFields as field}
      <div class="bg-gradient-to-br from-[var(--bg-panel-solid)] to-[var(--bg-tertiary)] rounded-lg p-4 border border-[var(--border-secondary)] transition-colors">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-base opacity-60">{field.icon}</span>
          <span class="text-xs text-[var(--text-muted)] uppercase tracking-wider transition-colors">{field.label}</span>
        </div>
        <div class="text-[var(--text-primary)] font-medium transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
          {field.value}
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Grading & Catalog Info -->
  {#if hasGradingInfo}
    <div class="mt-5 pt-5 border-t border-[var(--border-secondary)] transition-colors">
      <h4 class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3 transition-colors">Grading & Reference</h4>
      <div class="flex flex-wrap gap-2">
        {#if coin.grade}
          <span class="px-3 py-1.5 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] rounded-full text-sm border border-[var(--accent-gold)]/20"
                style="font-family: 'Crimson Text', Georgia, serif;">
            Grade: {coin.grade}
          </span>
        {/if}
        {#if coin.catalog_reference}
          <span class="px-3 py-1.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full text-sm border border-[var(--border-secondary)]"
                style="font-family: 'Crimson Text', Georgia, serif;">
            {coin.catalog_reference}
          </span>
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- Obverse & Reverse Descriptions -->
  {#if hasDetailedDescriptions}
    <div class="mt-5 pt-5 border-t border-[var(--border-secondary)] space-y-4 transition-colors">
      {#if coin.obverse_description}
        <div>
          <h4 class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 transition-colors">Obverse</h4>
          <p class="text-sm text-[var(--text-secondary)] transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
            {coin.obverse_description}
          </p>
        </div>
      {/if}
      {#if coin.reverse_description}
        <div>
          <h4 class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 transition-colors">Reverse</h4>
          <p class="text-sm text-[var(--text-secondary)] transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
            {coin.reverse_description}
          </p>
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- Legends -->
  {#if hasLegends}
    <div class="mt-5 pt-5 border-t border-[var(--border-secondary)] space-y-3 transition-colors">
      <h4 class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 transition-colors">Inscriptions</h4>
      {#if coin.obverse_legend}
        <div class="flex items-start gap-2">
          <span class="text-xs text-[var(--text-muted)] w-12 shrink-0">OBV:</span>
          <span class="text-sm text-[var(--text-primary)] font-medium tracking-wide transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
            {coin.obverse_legend}
          </span>
        </div>
      {/if}
      {#if coin.reverse_legend}
        <div class="flex items-start gap-2">
          <span class="text-xs text-[var(--text-muted)] w-12 shrink-0">REV:</span>
          <span class="text-sm text-[var(--text-primary)] font-medium tracking-wide transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
            {coin.reverse_legend}
          </span>
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- Timestamps -->
  <div class="mt-5 pt-5 border-t border-[var(--border-secondary)] text-xs text-[var(--text-muted)] space-y-2 transition-colors">
    <div class="flex justify-between">
      <span>Added to collection</span>
      <span style="font-family: 'Crimson Text', Georgia, serif;">{new Date(coin.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </div>
    <div class="flex justify-between">
      <span>Last updated</span>
      <span style="font-family: 'Crimson Text', Georgia, serif;">{new Date(coin.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </div>
  </div>
</div>
