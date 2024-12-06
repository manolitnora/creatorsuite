interface StorageItem<T> {
  value: T;
  expiry?: number;
}

class StorageService {
  private storage: Storage;

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage;
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    const item: StorageItem<T> = {
      value,
      ...(ttlSeconds && { expiry: new Date().getTime() + ttlSeconds * 1000 }),
    };

    try {
      this.storage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to storage:', error);
      // If storage is full, clear expired items and try again
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.clearExpired();
        try {
          this.storage.setItem(key, JSON.stringify(item));
        } catch (retryError) {
          console.error('Storage still full after clearing expired items:', retryError);
        }
      }
    }
  }

  get<T>(key: string): T | null {
    const itemStr = this.storage.getItem(key);
    if (!itemStr) return null;

    try {
      const item: StorageItem<T> = JSON.parse(itemStr);

      // Check if the item has expired
      if (item.expiry && new Date().getTime() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  clearExpired(): void {
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        const itemStr = this.storage.getItem(key);
        if (itemStr) {
          try {
            const item: StorageItem<unknown> = JSON.parse(itemStr);
            if (item.expiry && new Date().getTime() > item.expiry) {
              this.remove(key);
            }
          } catch (error) {
            console.error(`Error parsing storage item ${key}:`, error);
          }
        }
      }
    }
  }

  // Session-specific methods
  setAuthToken(token: string, ttlSeconds: number): void {
    this.set('auth_token', token, ttlSeconds);
  }

  setRefreshToken(token: string, ttlSeconds: number): void {
    this.set('refresh_token', token, ttlSeconds);
  }

  getAuthToken(): string | null {
    return this.get<string>('auth_token');
  }

  getRefreshToken(): string | null {
    return this.get<string>('refresh_token');
  }

  clearAuth(): void {
    this.remove('auth_token');
    this.remove('refresh_token');
  }
}

export const storage = new StorageService();
