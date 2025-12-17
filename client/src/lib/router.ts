import { writable, derived } from 'svelte/store';

export interface Route {
  path: string;
  params: Record<string, string>;
}

function createRouter() {
  const { subscribe, set } = writable<Route>({ path: '/', params: {} });

  function parseRoute(hash: string): Route {
    const path = hash.replace('#', '') || '/';
    const params: Record<string, string> = {};
    
    // Match /coin/:id pattern
    const coinMatch = path.match(/^\/coin\/(.+)$/);
    if (coinMatch) {
      return { path: '/coin/:id', params: { id: coinMatch[1] } };
    }
    
    return { path, params };
  }

  function navigate(path: string) {
    window.location.hash = path;
  }

  function init() {
    // Set initial route
    set(parseRoute(window.location.hash));
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      set(parseRoute(window.location.hash));
    });
    
    // Handle clicks on anchor tags
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href.startsWith(window.location.origin)) {
        const url = new URL(anchor.href);
        // If it's an internal link without a hash, convert to hash route
        if (!url.hash && url.pathname !== '/') {
          e.preventDefault();
          navigate(url.pathname);
        } else if (url.hash) {
          // Let hash links work naturally
        } else if (url.pathname === '/') {
          e.preventDefault();
          navigate('/');
        }
      }
    });
  }

  return {
    subscribe,
    navigate,
    init,
  };
}

export const router = createRouter();

export const currentPath = derived(router, $router => $router.path);


