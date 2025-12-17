<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { fetchCoins, queryKeys, type Coin } from '../api';
  import CoinCard from '../components/CoinCard.svelte';
  
  let search = $state('');
  
  // Fetch coins using TanStack Query
  const coinsQuery = createQuery(() => ({
    queryKey: queryKeys.coins,
    queryFn: fetchCoins,
  }));
  
  // Filter coins based on search
  const filteredCoins = $derived(() => {
    const coins = coinsQuery.data ?? [];
    if (!search.trim()) return coins;
    
    const query = search.toLowerCase();
    return coins.filter(coin => 
      coin.name.toLowerCase().includes(query) ||
      coin.description?.toLowerCase().includes(query) ||
      coin.denomination?.toLowerCase().includes(query) ||
      coin.mint?.toLowerCase().includes(query) ||
      coin.ruler?.toLowerCase().includes(query) ||
      coin.catalog_reference?.toLowerCase().includes(query)
    );
  });
</script>

<div class="min-h-screen pt-28 pb-12">
  <!-- Hero Section -->
  <div class="max-w-7xl mx-auto px-4 mb-16">
    <div class="relative panel panel-glow p-10 overflow-hidden">
      <!-- Background decoration - warm subtle pattern -->
      <div class="absolute inset-0 parchment-pattern"></div>
      <div class="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-gold)]/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-bronze)]/5 rounded-full blur-3xl"></div>
      
      <div class="relative">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-[var(--accent-gold)] text-xl">❦</span>
          <span class="text-sm text-[var(--text-muted)] tracking-widest uppercase transition-colors">Numismatic Archive</span>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mb-5 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
          Journey to <span class="text-[var(--accent-gold)] italic">Ephesus</span>
        </h1>
        
        <p class="text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-8 text-lg transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
          Explore high-fidelity 3D models of ancient coins from across the classical world. 
          Rotate, examine, and appreciate each piece as if holding history in your hands.
          A digital sanctuary for numismatic research and appreciation.
        </p>
        
        <!-- Stats Row -->
        <div class="flex flex-wrap gap-8">
          <div class="flex items-center gap-3">
            <span class="text-3xl font-semibold text-[var(--accent-gold)]" style="font-family: 'Cormorant Garamond', Georgia, serif;">
              {coinsQuery.data?.length ?? 0}
            </span>
            <span class="text-[var(--text-muted)] text-sm transition-colors">Artifacts</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-3xl font-semibold text-[var(--accent-bronze)]" style="font-family: 'Cormorant Garamond', Georgia, serif;">3D</span>
            <span class="text-[var(--text-muted)] text-sm transition-colors">Models</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-3xl font-semibold text-[var(--accent-olive)]" style="font-family: 'Cormorant Garamond', Georgia, serif;">∞</span>
            <span class="text-[var(--text-muted)] text-sm transition-colors">Perspectives</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Search & Filter -->
  <div class="max-w-7xl mx-auto px-4 mb-10">
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative w-full sm:w-96">
        <input
          type="text"
          placeholder="Search the collection..."
          bind:value={search}
          class="w-full px-5 py-3 pl-12 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-full
                 text-[var(--text-primary)] placeholder-[var(--text-muted)]
                 focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20
                 transition-all duration-200 shadow-sm"
          style="font-family: 'Crimson Text', Georgia, serif;"
        />
        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg">⌕</span>
      </div>
      
      <div class="text-sm text-[var(--text-muted)] italic transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
        Displaying <span class="text-[var(--accent-gold)] font-semibold not-italic">{filteredCoins().length}</span> treasures
      </div>
    </div>
  </div>
  
  <!-- Coins Grid -->
  <div class="max-w-7xl mx-auto px-4">
    {#if coinsQuery.isPending}
      <div class="flex items-center justify-center py-24">
        <div class="loading-spinner"></div>
      </div>
    {:else if coinsQuery.error}
      <div class="panel p-10 text-center">
        <div class="text-5xl mb-5 text-[var(--accent-terracotta)]">⚠</div>
        <div class="text-[var(--accent-burgundy)] mb-2 text-lg transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
          Unable to retrieve collection
        </div>
        <div class="text-sm text-[var(--text-muted)] mb-4 transition-colors">
          {coinsQuery.error.message}
        </div>
        <button
          onclick={() => coinsQuery.refetch()}
          class="px-6 py-2 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] rounded-full
                 border border-[var(--accent-gold)]/30 hover:bg-[var(--accent-gold)]/20 transition-colors"
        >
          Try Again
        </button>
      </div>
    {:else if filteredCoins().length === 0}
      <div class="panel p-16 text-center">
        <div class="text-7xl mb-6 text-[var(--border-primary)]">☉</div>
        <div class="text-[var(--text-secondary)] text-xl mb-3 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">No artifacts found</div>
        <div class="text-sm text-[var(--text-muted)] mb-6 transition-colors">
          {search ? 'Try adjusting your search' : 'Begin your collection by adding your first coin'}
        </div>
        {#if !search}
          <a 
            href="/upload"
            class="inline-block px-7 py-3 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] rounded-full
                   border border-[var(--accent-gold)]/30 hover:bg-[var(--accent-gold)]/20 transition-colors"
          >
            ✦ Add First Coin
          </a>
        {/if}
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {#each filteredCoins() as coin, index (coin.id)}
          <CoinCard {coin} {index} />
        {/each}
      </div>
    {/if}
  </div>
</div>
