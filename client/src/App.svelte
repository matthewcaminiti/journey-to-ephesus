<script lang="ts">
  import { onMount } from 'svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { router, currentPath } from './lib/router';
  import { themeStore } from './lib/stores/theme';
  import Navbar from './lib/components/Navbar.svelte';
  import Home from './lib/pages/Home.svelte';
  import CoinDetail from './lib/pages/CoinDetail.svelte';
  import Upload from './lib/pages/Upload.svelte';
  
  // Create a QueryClient instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });
  
  let route = $state({ path: '/', params: {} as Record<string, string> });
  let path = $state('/');
  
  router.subscribe(r => route = r);
  currentPath.subscribe(p => path = p);
  
  onMount(() => {
    router.init();
    themeStore.init();
  });
</script>

{#snippet appContent()}
  <div class="min-h-screen">
    <Navbar currentPath={path} />

    <main>
      {#if route.path === '/'}
        <Home />
      {:else if route.path === '/coin/:id'}
        <CoinDetail id={route.params.id} />
      {:else if route.path === '/upload'}
        <Upload />
      {:else}
        <!-- 404 Page -->
        <div class="min-h-screen pt-24 flex items-center justify-center">
          <div class="text-center">
            <div class="text-8xl font-bold text-[var(--accent-gold)]/20 mb-4" style="font-family: 'Cormorant Garamond', Georgia, serif;">404</div>
            <h1 class="text-2xl font-semibold text-[var(--text-primary)] mb-2 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">Page Not Found</h1>
            <p class="text-[var(--text-secondary)] mb-6 transition-colors">The artifact you seek has been lost to time.</p>
            <a 
              href="/"
              class="inline-block px-6 py-2.5 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] rounded-full
                     border border-[var(--accent-gold)]/30 hover:bg-[var(--accent-gold)]/20 transition-colors"
            >
              Return to Collection
            </a>
          </div>
        </div>
      {/if}
    </main>

    <!-- Footer -->
    <footer class="border-t border-[var(--border-primary)] py-10 mt-16 bg-gradient-to-b from-transparent to-[var(--bg-tertiary)]/50 transition-colors">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--bg-tertiary)] 
                        flex items-center justify-center text-[var(--accent-gold)] text-lg transition-colors">
              ☉
            </div>
            <div class="flex flex-col">
              <span class="text-sm text-[var(--text-primary)] transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">Journey to Ephesus</span>
              <span class="text-xs text-[var(--text-muted)] transition-colors">Preserving numismatic heritage</span>
            </div>
          </div>
          
          <div class="text-xs text-[var(--text-muted)] flex items-center gap-4 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
            <span class="italic">Crafted with care</span>
            <span class="text-[var(--border-primary)]">❦</span>
            <span>MMXXIV</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
{/snippet}

<QueryClientProvider client={queryClient} children={appContent} />
