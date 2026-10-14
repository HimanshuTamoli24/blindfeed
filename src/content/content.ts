import { Preferences } from '../shared/preferences';
import { getPreferences, onPreferencesChanged } from '../shared/storage';

/**
 * Apply preference attributes to the root <html> element.
 * This triggers our instant, zero-flash CSS rules cleanly without DOM mutation overhead.
 */
function applyPreferencesToRoot(prefs: Preferences): void {
  const root = document.documentElement;
  if (!root) return;

  root.setAttribute('data-blindfeed-enabled', prefs.enabled ? 'true' : 'false');
  root.setAttribute('data-blindfeed-hide-likes', prefs.hideLikes ? 'true' : 'false');
  root.setAttribute('data-blindfeed-hide-replies', prefs.hideReplies ? 'true' : 'false');
  root.setAttribute('data-blindfeed-hide-views', prefs.hideViews ? 'true' : 'false');
  root.setAttribute('data-blindfeed-hide-reposts', prefs.hideReposts ? 'true' : 'false');
  root.setAttribute('data-blindfeed-hide-quotes', prefs.hideQuotes ? 'true' : 'false');
  root.setAttribute('data-blindfeed-blur-name', prefs.blurDisplayName ? 'true' : 'false');
  root.setAttribute('data-blindfeed-blur-username', prefs.blurUsername ? 'true' : 'false');
  root.setAttribute('data-blindfeed-blur-avatar', prefs.blurAvatar ? 'true' : 'false');
  root.setAttribute('data-blindfeed-blur-badge', prefs.blurBadge ? 'true' : 'false');
  root.setAttribute('data-blindfeed-blur-timestamp', prefs.blurTimestamp ? 'true' : 'false');
}

/**
 * Initialize Blindfeed content script
 */
async function initBlindfeed(): Promise<void> {
  try {
    const prefs = await getPreferences();
    applyPreferencesToRoot(prefs);

    // Listen for live preference changes from popup
    onPreferencesChanged((newPrefs) => {
      applyPreferencesToRoot(newPrefs);
    });
  } catch (err) {
    console.error('[Blindfeed] Failed to initialize:', err);
  }
}

// Run immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlindfeed);
} else {
  initBlindfeed();
}
