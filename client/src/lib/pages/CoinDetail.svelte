<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { fetchCoin, queryKeys } from '../api';
  import CoinViewer from '../components/CoinViewer.svelte';
  import CoinMetadata from '../components/CoinMetadata.svelte';
  import ViewerControls from '../components/ViewerControls.svelte';
  
  interface Props {
    id: string;
  }
  
  let { id }: Props = $props();
  let viewerComponent: CoinViewer | undefined = $state(undefined);
  
  // Fetch coin using TanStack Query
  const coinQuery = createQuery(() => ({
    queryKey: queryKeys.coin(id),
    queryFn: () => fetchCoin(id),
  }));
  
  function handleResetCamera() {
    viewerComponent?.resetCamera();
  }
</script>

<div class="min-h-screen pt-24 pb-12">
  <div class="max-w-7xl mx-auto px-4">
    <!-- Back Navigation -->
    <div class="mb-8">
      <a 
        href="#/"
        class="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors group"
        style="font-family: 'Crimson Text', Georgia, serif;"
      >
        <span class="transition-transform group-hover:-translate-x-1">←</span>
        <span>Return to Collection</span>
      </a>
    </div>
    
    {#if coinQuery.isPending}
      <div class="flex items-center justify-center py-24">
        <div class="loading-spinner"></div>
      </div>
    {:else if coinQuery.error}
      <div class="panel p-12 text-center">
        <div class="text-5xl mb-5 text-[var(--accent-terracotta)]">⚠</div>
        <div class="text-[var(--accent-burgundy)] text-lg mb-3 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
          Unable to retrieve artifact
        </div>
        <div class="text-[var(--text-muted)] mb-6 transition-colors">{coinQuery.error.message}</div>
        <div class="flex gap-4 justify-center">
          <button
            onclick={() => coinQuery.refetch()}
            class="px-6 py-2.5 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] rounded-full
                   border border-[var(--accent-gold)]/30 hover:bg-[var(--accent-gold)]/20 transition-colors"
          >
            Try Again
          </button>
          <a 
            href="#/"
            class="px-6 py-2.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full
                   border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            Return to Collection
          </a>
        </div>
      </div>
    {:else if coinQuery.data}
      {@const coin = coinQuery.data}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Viewer Area -->
        <div class="lg:col-span-2 space-y-6">
          <div class="panel panel-glow overflow-hidden">
            <div class="border-b border-[var(--border-secondary)] px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[var(--bg-panel-solid)] to-[var(--bg-tertiary)] transition-colors">
              <h2 class="text-lg font-semibold text-[var(--text-primary)] transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
                3D Viewer
              </h2>
              <div class="flex items-center gap-2 text-xs text-[var(--text-muted)] transition-colors">
                <div class="w-2 h-2 rounded-full bg-[var(--accent-olive)] animate-gentle-pulse"></div>
                <span>Interactive</span>
              </div>
            </div>
            <div class="aspect-[4/3]">
              <CoinViewer 
                bind:this={viewerComponent}
                modelUrl={coin.model_url} 
              />
            </div>
          </div>
          
          <!-- Viewer Instructions -->
          <div class="panel p-6">
            <div class="grid grid-cols-3 gap-6 text-center">
              <div class="space-y-2">
                <div class="w-10 h-10 mx-auto rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center transition-colors">
                  <span class="text-lg text-[var(--accent-gold)]">↻</span>
                </div>
                <div class="text-sm text-[var(--text-primary)] transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">Rotate</div>
                <div class="text-xs text-[var(--text-muted)] transition-colors">Click & drag</div>
              </div>
              <div class="space-y-2">
                <div class="w-10 h-10 mx-auto rounded-full bg-[var(--accent-bronze)]/10 flex items-center justify-center transition-colors">
                  <span class="text-lg text-[var(--accent-bronze)]">⇕</span>
                </div>
                <div class="text-sm text-[var(--text-primary)] transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">Zoom</div>
                <div class="text-xs text-[var(--text-muted)] transition-colors">Scroll wheel</div>
              </div>
              <div class="space-y-2">
                <div class="w-10 h-10 mx-auto rounded-full bg-[var(--accent-olive)]/10 flex items-center justify-center transition-colors">
                  <span class="text-lg text-[var(--accent-olive)]">✥</span>
                </div>
                <div class="text-sm text-[var(--text-primary)] transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">Pan</div>
                <div class="text-xs text-[var(--text-muted)] transition-colors">Right-click drag</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <CoinMetadata {coin} />
          <ViewerControls onResetCamera={handleResetCamera} />
          
          <!-- Actions Panel -->
          <div class="panel p-5 space-y-4">
            <h3 class="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 transition-colors"
                style="font-family: 'Crimson Text', Georgia, serif;">
              Actions
            </h3>
            
            <a
              href={coin.model_url}
              download
              class="block w-full py-3 text-center rounded-full
                     bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]
                     hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/30
                     transition-all duration-200"
              style="font-family: 'Crimson Text', Georgia, serif;"
            >
              ↓ Download Model
            </a>
            
            <button
              class="w-full py-3 text-center rounded-full
                     bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]
                     hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/30
                     transition-all duration-200"
              style="font-family: 'Crimson Text', Georgia, serif;"
            >
              ⎘ Share Link
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
