/**
 * Simple in-memory cache untuk data yang tidak sering berubah
 * Cache akan di-reset saat server restart
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if cache expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get or set with async function
   * Prevents race conditions by tracking pending promises
   */
  private pendingPromises: Map<string, Promise<any>> = new Map();

  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingPromises.get(key);
    if (pending) {
      // Wait for the pending request instead of creating a new one
      return pending as Promise<T>;
    }

    // Create new promise and track it
    const promise = fn().then((data) => {
      this.set(key, data, ttl);
      this.pendingPromises.delete(key); // Remove from pending after completion
      return data;
    }).catch((error) => {
      this.pendingPromises.delete(key); // Remove from pending on error
      throw error;
    });

    this.pendingPromises.set(key, promise);
    return promise;
  }
}

// Singleton instance
export const cache = new SimpleCache();

// Cache keys
export const CACHE_KEYS = {
  CATEGORIES: 'categories:with-articles',
  MARKET_DATA: 'market:data',
} as const;

