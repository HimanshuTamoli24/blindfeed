import { DEFAULT_PREFERENCES, Preferences } from './preferences';

const STORAGE_KEY = 'blindfeed_preferences';

/**
 * Check if chrome.storage.sync is available
 */
function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && !!chrome?.storage?.sync;
}

/**
 * Load preferences from storage (chrome.storage.sync with localStorage fallback)
 */
export async function getPreferences(): Promise<Preferences> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get([STORAGE_KEY], (result) => {
          if (chrome.runtime.lastError) {
            console.warn('[Blindfeed] chrome.storage.sync read error:', chrome.runtime.lastError);
            resolve({ ...DEFAULT_PREFERENCES });
            return;
          }
          const stored = result?.[STORAGE_KEY];
          if (stored && typeof stored === 'object') {
            resolve({ ...DEFAULT_PREFERENCES, ...stored });
          } else {
            resolve({ ...DEFAULT_PREFERENCES });
          }
        });
      } catch (err) {
        console.warn('[Blindfeed] Failed to access chrome storage:', err);
        resolve({ ...DEFAULT_PREFERENCES });
      }
    });
  }

  // Fallback for development / mock environments
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(item) };
    }
  } catch {
    // ignore localStorage errors
  }
  return { ...DEFAULT_PREFERENCES };
}

/**
 * Save full or partial preferences to storage
 */
export async function setPreferences(prefs: Partial<Preferences>): Promise<Preferences> {
  const current = await getPreferences();
  const updated: Preferences = { ...current, ...prefs };

  if (isChromeStorageAvailable()) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({ [STORAGE_KEY]: updated }, () => {
          if (chrome.runtime.lastError) {
            console.error('[Blindfeed] chrome.storage.sync write error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(updated);
        });
      } catch (err) {
        console.error('[Blindfeed] Exception setting preferences:', err);
        reject(err);
      }
    });
  }

  // Fallback
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

/**
 * Subscribe to storage updates from popup or other tabs
 */
export function onPreferencesChanged(callback: (newPrefs: Preferences) => void): () => void {
  if (isChromeStorageAvailable() && chrome.storage.onChanged) {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'sync' && changes[STORAGE_KEY]) {
        const newValue = changes[STORAGE_KEY].newValue;
        if (newValue) {
          callback({ ...DEFAULT_PREFERENCES, ...newValue });
        }
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }

  // Window storage event fallback for dev
  const windowListener = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      callback({ ...DEFAULT_PREFERENCES, ...JSON.parse(e.newValue) });
    }
  };
  window.addEventListener('storage', windowListener);
  return () => window.removeEventListener('storage', windowListener);
}
