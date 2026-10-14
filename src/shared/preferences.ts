export type Preferences = {
  enabled: boolean;
  hideLikes: boolean;
  hideReplies: boolean;
  hideViews: boolean;
  hideReposts: boolean;
  hideQuotes: boolean;
  blurDisplayName: boolean;
  blurUsername: boolean;
  blurAvatar: boolean;
  blurBadge: boolean;
  blurTimestamp: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  enabled: true,
  hideLikes: true,
  hideReplies: true,
  hideViews: true,
  hideReposts: true,
  hideQuotes: true,
  blurDisplayName: true,
  blurUsername: true,
  blurAvatar: true,
  blurBadge: true,
  blurTimestamp: true,
};

export type PreferenceKey = keyof Preferences;

export const METRIC_KEYS: PreferenceKey[] = [
  'hideLikes',
  'hideReplies',
  'hideViews',
  'hideReposts',
  'hideQuotes',
];

export const IDENTITY_KEYS: PreferenceKey[] = [
  'blurDisplayName',
  'blurUsername',
  'blurAvatar',
  'blurBadge',
  'blurTimestamp',
];
