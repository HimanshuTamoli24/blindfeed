/**
 * Selectors for X (Twitter) and Instagram DOM elements.
 * Based on stable semantic hooks, aria-labels, and data-testid attributes.
 */

export const X_SELECTORS = {
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

export const INSTAGRAM_SELECTORS = {
  // Post container
  article: 'article',
  postModal: 'div[role="dialog"] article',

  // Likes
  likeCountFeed: 'article a[href*="/liked_by/"], article section ~ div:has(a[href*="/liked_by/"])',
  likeCountReels: 'div:has(> svg[aria-label="Like"]) + span, div:has(> svg[aria-label="Unlike"]) + span, button:has(svg[aria-label="Like"]) + div',
  
  // Comments
  commentCountFeed: 'article a[href^="/p/"][href*="comments"], article a:has(> span:has-text("View all"))',
  commentCountReels: 'div:has(> svg[aria-label="Comment"]) + span, button:has(svg[aria-label="Comment"]) + div',

  // Shares / Reposts
  shareCountReels: 'div:has(> svg[aria-label="Share"]) + span, div:has(> svg[aria-label="Share Post"]) + span, button:has(svg[aria-label="Share Post"]) + div',

  // Views & Explore overlays
  viewsText: 'article span:has-text("views"), article span:has-text("plays")',
  exploreOverlay: 'a[href^="/p/"] ul:has(svg), a[href^="/reel/"] ul:has(svg)',

  // Identity
  avatar: 'article header img, article header canvas, article img[alt*="profile picture"]',
  username: 'article header a[role="link"], article header h2',
  verifiedBadge: 'article header svg[aria-label*="Verified"], svg[aria-label*="Verified"]',
  timestamp: 'article time, article header time, time[datetime]',
} as const;

export const SELECTORS = {
  ...X_SELECTORS,
  instagram: INSTAGRAM_SELECTORS,
} as const;
