/**
 * Selectors for X / Twitter DOM elements.
 * Based on stable data-testid hooks and semantic link patterns.
 */

export const SELECTORS = {
  // Post container
  article: 'article',
  tweet: 'article[data-testid="tweet"]',

  // Metric counts (text transitions inside action buttons)
  countContainer: 'article [data-testid="app-text-transition-container"]',
  likeButtonCount: 'article [data-testid="like"] [data-testid="app-text-transition-container"], article [data-testid="unlike"] [data-testid="app-text-transition-container"]',
  replyButtonCount: 'article [data-testid="reply"] [data-testid="app-text-transition-container"]',
  repostButtonCount: 'article [data-testid="retweet"] [data-testid="app-text-transition-container"], article [data-testid="unretweet"] [data-testid="app-text-transition-container"]',
  bookmarkButtonCount: 'article [data-testid="bookmark"] [data-testid="app-text-transition-container"]',

  // Opened post metric links
  viewCountLink: 'article a[href$="/analytics"]',
  repostCountLink: 'article a[href$="/retweets"]',
  quoteCountLink: 'article a[href$="/quotes"]',
  likeCountLink: 'article a[href$="/likes"]',

  // View count sibling after timestamp on opened post
  viewCountAfterTimestamp: 'article a[href*="/status/"]:has(> time) ~ *, article div:has(> a[href*="/status/"] > time) ~ *',

  // Identity elements
  userNameContainer: 'article [data-testid="User-Name"]',
  displayName: 'article [data-testid="User-Name"] a[role="link"]:not([tabindex="-1"])',
  userHandle: 'article [data-testid="User-Name"] a[tabindex="-1"]',
  verifiedBadge: 'article [data-testid="icon-verified"]',
  socialContext: 'article [data-testid="socialContext"]',
  avatarContainer: 'article [data-testid^="UserAvatar-Container"], article [data-testid="Tweet-User-Avatar"]',
  timestamp: 'article time',
} as const;
