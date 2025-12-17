const API_BASE = '/api';

// ============================================================================
// Types
// ============================================================================

export interface CoinMetadata {
  name: string;
  description: string;
  year?: string | null;
  mint?: string | null;
  denomination?: string | null;
  metal?: string | null;
  weight_grams?: number | null;
  diameter_mm?: number | null;
  grade?: string | null;
  catalog_reference?: string | null;
  ruler?: string | null;
  obverse_description?: string | null;
  reverse_description?: string | null;
  obverse_legend?: string | null;
  reverse_legend?: string | null;
}

export interface UploadResponse {
  success: boolean;
  coin?: {
    id: string;
    name: string;
  };
  error?: string;
}

export interface Coin {
  id: string;
  name: string;
  description: string;
  year: string | null;
  mint: string | null;
  denomination: string | null;
  metal: string | null;
  weight_grams: number | null;
  diameter_mm: number | null;
  model_url: string;
  thumbnail_url: string | null;
  grade: string | null;
  catalog_reference: string | null;
  ruler: string | null;
  obverse_description: string | null;
  reverse_description: string | null;
  obverse_legend: string | null;
  reverse_legend: string | null;
}

// ============================================================================
// API Functions
// ============================================================================

export async function fetchCoins(): Promise<Coin[]> {
  const response = await fetch(`${API_BASE}/coins`);
  if (!response.ok) {
    throw new Error(`Failed to fetch coins: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchCoin(id: string): Promise<Coin> {
  const response = await fetch(`${API_BASE}/coins/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Coin not found');
    }
    throw new Error(`Failed to fetch coin: ${response.statusText}`);
  }
  return response.json();
}

export async function uploadCoin(
  modelFile: File,
  metadata: CoinMetadata,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('model', modelFile);
  formData.append('metadata', JSON.stringify(metadata));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress((e.loaded / e.total) * 100);
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ success: true, coin: response });
        } else {
          resolve({ success: false, error: response.error || 'Upload failed' });
        }
      } catch {
        resolve({ success: false, error: 'Invalid server response' });
      }
    });

    xhr.addEventListener('error', () => {
      resolve({ success: false, error: 'Network error' });
    });

    xhr.open('POST', `${API_BASE}/coins`);
    xhr.send(formData);
  });
}

// ============================================================================
// Query Keys (for TanStack Query)
// ============================================================================

export const queryKeys = {
  coins: ['coins'] as const,
  coin: (id: string) => ['coins', id] as const,
};

// ============================================================================
// Model Caching (optional, for offline support)
// ============================================================================

const MODEL_CACHE_NAME = 'coin-models-v1';

export async function getCachedModel(url: string): Promise<ArrayBuffer | null> {
  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    const response = await cache.match(url);
    if (response) {
      return await response.arrayBuffer();
    }
  } catch (e) {
    console.warn('Cache read failed:', e);
  }
  return null;
}

export async function cacheModel(url: string, data: ArrayBuffer): Promise<void> {
  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    const response = new Response(data, {
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Content-Length': data.byteLength.toString(),
      },
    });
    await cache.put(url, response);
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
}

export async function clearModelCache(): Promise<void> {
  try {
    await caches.delete(MODEL_CACHE_NAME);
  } catch (e) {
    console.warn('Cache clear failed:', e);
  }
}
