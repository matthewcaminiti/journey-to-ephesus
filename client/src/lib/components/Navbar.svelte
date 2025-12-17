<script lang="ts">
  import { themeStore, type Theme } from '../stores/theme';
  
  interface Props {
    currentPath?: string;
  }
  
  let { currentPath = '/' }: Props = $props();
  
  let theme = $state<Theme>('light');
  themeStore.subscribe(t => theme = t);
  
  const navItems = [
    { path: '/', label: 'Collection', icon: '⚱' },
    { path: '/upload', label: 'Add Coin', icon: '✦' },
  ];
  
  function toggleTheme() {
    themeStore.toggle();
  }
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-panel)] backdrop-blur-md border-b border-[var(--border-primary)] shadow-sm transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-between h-18 py-3">
      <!-- Logo/Brand -->
      <a href="/" class="flex items-center gap-4 group">
        <div class="w-12 h-12 rounded-full border-2 border-[var(--accent-gold)]/40 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-hover)]
                    flex items-center justify-center text-[var(--accent-gold)] text-xl
                    group-hover:border-[var(--accent-gold)] group-hover:shadow-lg group-hover:shadow-[var(--accent-gold)]/10 
                    transition-all duration-300">
          ☉
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-semibold text-[var(--text-primary)] tracking-wide transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
            Journey to Ephesus
          </span>
          <span class="text-xs text-[var(--text-muted)] tracking-widest uppercase transition-colors">Numismatic Archive</span>
        </div>
      </a>

      <!-- Navigation Links -->
      <div class="flex items-center gap-2">
        {#each navItems as item}
          <a 
            href={item.path}
            class="px-5 py-2.5 text-sm tracking-wide transition-all duration-200 rounded-full
                   flex items-center gap-2
                   {currentPath === item.path 
                     ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 shadow-sm' 
                     : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-transparent'}"
            style="font-family: 'Crimson Text', Georgia, serif;"
          >
            <span class="text-lg opacity-70">{item.icon}</span>
            {item.label}
          </a>
        {/each}
      </div>

      <!-- Theme Toggle & Decorative Element -->
      <div class="flex items-center gap-4">
        <!-- Theme Toggle -->
        <button
          onclick={toggleTheme}
          class="relative w-14 h-8 rounded-full border border-[var(--border-primary)] 
                 bg-[var(--bg-tertiary)] hover:border-[var(--accent-gold)]/50
                 transition-all duration-300 group flex items-center"
          aria-label="Toggle theme"
        >
          <!-- Sun icon -->
          <span class="absolute left-1.5 top-1/2 -translate-y-1/2 text-sm leading-none transition-all duration-300
                       {theme === 'light' ? 'opacity-100 text-[var(--accent-gold)]' : 'opacity-40 text-[var(--text-muted)]'}"
                style="display: flex; align-items: center; justify-content: center; height: 16px;">
            ☀
          </span>
          <!-- Moon icon -->
          <span class="absolute right-1.5 top-1/2 -translate-y-1/2 text-sm leading-none transition-all duration-300
                       {theme === 'dark' ? 'opacity-100 text-[var(--accent-gold)]' : 'opacity-40 text-[var(--text-muted)]'}"
                style="display: flex; align-items: center; justify-content: center; height: 16px;">
            ☽
          </span>
          <!-- Toggle indicator -->
          <span class="absolute top-1 w-6 h-6 rounded-full bg-[var(--accent-gold)] shadow-md
                       transition-all duration-300 ease-out
                       {theme === 'light' ? 'left-1' : 'left-7'}">
          </span>
        </button>
        
        <!-- Decorative Element -->
        <div class="hidden md:flex items-center gap-3 text-[var(--text-muted)] transition-colors">
          <span class="text-lg">❦</span>
          <span class="text-xs italic" style="font-family: 'Crimson Text', Georgia, serif;">Est. MMXXIV</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Decorative bottom border with warmth -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-gold)]/30 to-transparent"></div>
</nav>
