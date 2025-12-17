import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

function createThemeStore() {
  // Check for saved preference or system preference
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  const { subscribe, set, update } = writable<Theme>('light');

  return {
    subscribe,
    
    init() {
      const theme = getInitialTheme();
      this.setTheme(theme);
    },
    
    setTheme(theme: Theme) {
      set(theme);
      
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
    },
    
    toggle() {
      update(current => {
        const newTheme = current === 'light' ? 'dark' : 'light';
        
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
        }
        
        return newTheme;
      });
    },
  };
}

export const themeStore = createThemeStore();

