/**
 * SessionStorage-based cache for dropdown data.
 * Replaces Redis for client-side caching of infrequently changing reference data.
 */

type FetchFn<T> = () => Promise<T>;

/**
 * Get data from sessionStorage cache, or fetch from API and cache it.
 */
export async function getCachedData<T>(key: string, fetchFn: FetchFn<T>): Promise<T> {
  const cached = sessionStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached) as T;
    } catch {
      // corrupted cache, fall through to fetch
    }
  }
  const data = await fetchFn();
  if (data) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
  return data;
}

/**
 * Invalidate a specific cache key
 */
export function invalidateCache(key: string): void {
  sessionStorage.removeItem(key);
}

/**
 * Invalidate all app caches
 */
export function invalidateAllCaches(): void {
  const keys = ['cache_nations', 'cache_politics', 'cache_positions', 'cache_joblevels', 'cache_departments', 'cache_overview'];
  keys.forEach((k) => sessionStorage.removeItem(k));
}

// Cache keys
export const CACHE_KEYS = {
  NATIONS: 'cache_nations',
  POLITICS: 'cache_politics',
  POSITIONS: 'cache_positions',
  JOBLEVELS: 'cache_joblevels',
  DEPARTMENTS: 'cache_departments',
  OVERVIEW: 'cache_overview',
} as const;
