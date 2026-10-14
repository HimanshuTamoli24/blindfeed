import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_PREFERENCES,
  IDENTITY_KEYS,
  METRIC_KEYS,
} from '../src/shared/preferences';
import {
  getPreferences,
  setPreferences,
} from '../src/shared/storage';

// Polyfill localStorage for Node test runner
const storageMap = new Map<string, string>();
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (k: string) => storageMap.get(k) ?? null,
    setItem: (k: string, v: string) => storageMap.set(k, String(v)),
    removeItem: (k: string) => storageMap.delete(k),
    clear: () => storageMap.clear(),
    key: (i: number) => Array.from(storageMap.keys())[i] ?? null,
    get length() {
      return storageMap.size;
    },
  };
}

describe('Preferences Model', () => {
  it('should have all 10 feature flags enabled by default plus master enable', () => {
    expect(DEFAULT_PREFERENCES.enabled).toBe(true);
    expect(DEFAULT_PREFERENCES.hideLikes).toBe(true);
    expect(DEFAULT_PREFERENCES.hideReplies).toBe(true);
    expect(DEFAULT_PREFERENCES.hideViews).toBe(true);
    expect(DEFAULT_PREFERENCES.hideReposts).toBe(true);
    expect(DEFAULT_PREFERENCES.hideQuotes).toBe(true);
    expect(DEFAULT_PREFERENCES.blurDisplayName).toBe(true);
    expect(DEFAULT_PREFERENCES.blurUsername).toBe(true);
    expect(DEFAULT_PREFERENCES.blurAvatar).toBe(true);
    expect(DEFAULT_PREFERENCES.blurBadge).toBe(true);
    expect(DEFAULT_PREFERENCES.blurTimestamp).toBe(true);
  });

  it('should define 5 metric keys and 5 identity keys', () => {
    expect(METRIC_KEYS).toHaveLength(5);
    expect(IDENTITY_KEYS).toHaveLength(5);
  });
});

describe('Storage Helpers (fallback test)', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('should return default preferences when nothing is stored', async () => {
    const prefs = await getPreferences();
    expect(prefs).toEqual(DEFAULT_PREFERENCES);
  });

  it('should update partial preferences and persist them', async () => {
    const updated = await setPreferences({ hideLikes: false, blurAvatar: false });
    expect(updated.hideLikes).toBe(false);
    expect(updated.blurAvatar).toBe(false);
    expect(updated.hideReplies).toBe(true); // untouched default

    const reloaded = await getPreferences();
    expect(reloaded.hideLikes).toBe(false);
    expect(reloaded.blurAvatar).toBe(false);
    expect(reloaded.hideReplies).toBe(true);
  });

  it('should support disabling master switch while preserving individual preferences', async () => {
    await setPreferences({ hideLikes: false });
    const disabled = await setPreferences({ enabled: false });
    expect(disabled.enabled).toBe(false);
    expect(disabled.hideLikes).toBe(false);

    const reEnabled = await setPreferences({ enabled: true });
    expect(reEnabled.enabled).toBe(true);
    expect(reEnabled.hideLikes).toBe(false);
  });
});
