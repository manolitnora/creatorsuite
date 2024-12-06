import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { storage } from '../storage';

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('set', () => {
    it('should store item with expiration', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttlSeconds = 3600; // 1 hour

      storage.set(key, value, ttlSeconds);
      const storedItem = JSON.parse(localStorage.getItem(key) || '');

      expect(storedItem.value).toEqual(value);
      expect(storedItem.expiry).toBeDefined();
      expect(typeof storedItem.expiry).toBe('number');
    });

    it('should store item without expiration', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      storage.set(key, value);
      const storedItem = JSON.parse(localStorage.getItem(key) || '');

      expect(storedItem.value).toEqual(value);
      expect(storedItem.expiry).toBeUndefined();
    });

    it('should override existing item', () => {
      const key = 'test-key';
      const value1 = { data: 'value-1' };
      const value2 = { data: 'value-2' };

      storage.set(key, value1);
      storage.set(key, value2);

      const storedItem = JSON.parse(localStorage.getItem(key) || '');
      expect(storedItem.value).toEqual(value2);
    });
  });

  describe('get', () => {
    it('should retrieve non-expired item', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttlSeconds = 3600;

      storage.set(key, value, ttlSeconds);
      const retrievedValue = storage.get(key);

      expect(retrievedValue).toEqual(value);
    });

    it('should return null for expired item', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      
      // Set item with immediate expiration
      storage.set(key, value, -1);
      const retrievedValue = storage.get(key);

      expect(retrievedValue).toBeNull();
      expect(localStorage.getItem(key)).toBeNull(); // Should be removed
    });

    it('should return null for non-existent item', () => {
      const retrievedValue = storage.get('non-existent-key');
      expect(retrievedValue).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove existing item', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      storage.set(key, value);
      storage.remove(key);

      expect(localStorage.getItem(key)).toBeNull();
    });

    it('should not throw when removing non-existent item', () => {
      expect(() => storage.remove('non-existent-key')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');

      storage.clear();

      expect(localStorage.length).toBe(0);
    });
  });

  describe('clearExpired', () => {
    it('should remove expired items', () => {
      // Set non-expired item
      storage.set('valid-key', 'valid-value', 3600);
      
      // Set expired item
      storage.set('expired-key', 'expired-value', -1);

      storage.clearExpired();

      expect(storage.get('valid-key')).not.toBeNull();
      expect(storage.get('expired-key')).toBeNull();
    });

    it('should not affect items without expiration', () => {
      storage.set('key', 'value'); // No expiration
      storage.clearExpired();
      expect(storage.get('key')).not.toBeNull();
    });
  });

  describe('token management', () => {
    const ttlSeconds = 3600;

    it('should store and retrieve auth token', () => {
      const token = 'test-token';
      storage.setAuthToken(token, ttlSeconds);
      expect(storage.getAuthToken()).toBe(token);
    });

    it('should store and retrieve refresh token', () => {
      const token = 'refresh-token';
      storage.setRefreshToken(token, ttlSeconds);
      expect(storage.getRefreshToken()).toBe(token);
    });

    it('should clear tokens on logout', () => {
      storage.setAuthToken('auth-token', ttlSeconds);
      storage.setRefreshToken('refresh-token', ttlSeconds);

      storage.clearAuth();

      expect(storage.getAuthToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
    });
  });
});
