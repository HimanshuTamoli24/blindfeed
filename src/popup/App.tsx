import React, { useEffect, useState } from 'react';
import {
  Heart,
  MessageSquare,
  Eye,
  Repeat,
  Quote,
  User,
  AtSign,
  ShieldCheck,
  Clock,
  RotateCcw,
  Check,
  X,
  EyeOff,
  Type
} from 'lucide-react';
import {
  DEFAULT_PREFERENCES,
  IDENTITY_KEYS,
  METRIC_KEYS,
  Preferences,
  PreferenceKey
} from '../shared/preferences';
import { getPreferences, setPreferences } from '../shared/storage';

interface ToggleItemProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({
  label,
  description,
  checked,
  disabled = false,
  icon,
  onChange,
}) => {
  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`group flex items-center justify-between p-2.5 rounded-lg transition-all duration-150 border cursor-pointer select-none ${
        disabled
          ? 'opacity-30 cursor-not-allowed bg-black border-neutral-900'
          : checked
          ? 'bg-[#0a0a0a] hover:bg-[#121212] border-neutral-800 hover:border-neutral-700'
          : 'bg-black hover:bg-[#0a0a0a] border-neutral-900 hover:border-neutral-800'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`p-1.5 rounded-md transition-colors ${
            checked && !disabled
              ? 'text-white bg-neutral-900 border border-neutral-800'
              : 'text-neutral-500 bg-neutral-950 border border-neutral-900'
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-medium text-neutral-200 group-hover:text-white transition-colors">
            {label}
          </div>
          <div className="text-[11px] text-neutral-500 leading-tight">
            {description}
          </div>
        </div>
      </div>

      {/* Vercel-style high contrast switch */}
      <div
        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-150 ${
          checked && !disabled
            ? 'bg-white'
            : 'bg-neutral-900 border border-neutral-800'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full transition-transform duration-150 ${
            checked && !disabled
              ? 'bg-black translate-x-4 shadow-sm'
              : 'bg-neutral-600 translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPreferences().then((loaded) => {
      setPrefs(loaded);
      setLoading(false);
    });
  }, []);

  const updatePreference = async (key: PreferenceKey, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await setPreferences({ [key]: value });
  };

  const handleMasterToggle = async (enabled: boolean) => {
    updatePreference('enabled', enabled);
  };

  const handleEnableAll = async () => {
    const updated: Preferences = {
      ...prefs,
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
    setPrefs(updated);
    await setPreferences(updated);
  };

  const handleDisableAll = async () => {
    const updated: Preferences = {
      ...prefs,
      hideLikes: false,
      hideReplies: false,
      hideViews: false,
      hideReposts: false,
      hideQuotes: false,
      blurDisplayName: false,
      blurUsername: false,
      blurAvatar: false,
      blurBadge: false,
      blurTimestamp: false,
    };
    setPrefs(updated);
    await setPreferences(updated);
  };

  const handleReset = async () => {
    setPrefs(DEFAULT_PREFERENCES);
    await setPreferences(DEFAULT_PREFERENCES);
  };

  const activeCount = [
    ...METRIC_KEYS,
    ...IDENTITY_KEYS,
  ].filter((key) => prefs[key]).length;

  if (loading) {
    return (
      <div className="w-[370px] h-[550px] flex items-center justify-center bg-black text-neutral-500 font-mono text-xs">
        LOADING...
      </div>
    );
  }

  return (
    <div className="w-[370px] bg-black text-white flex flex-col font-sans border border-neutral-900 antialiased">
      {/* Top Header */}
      <div className="p-3.5 border-b border-neutral-900 bg-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center shadow-sm">
              <EyeOff className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-white">Blindfeed</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                  FairTweets
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">Read content, not popularity</p>
            </div>
          </div>

          <div>
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] border ${
                prefs.enabled
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-500'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  prefs.enabled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-neutral-600'
                }`}
              />
              {prefs.enabled ? 'ACTIVE' : 'PAUSED'}
            </div>
          </div>
        </div>

        {/* Master Toggle Card */}
        <div
          role="switch"
          aria-checked={prefs.enabled}
          tabIndex={0}
          onClick={() => handleMasterToggle(!prefs.enabled)}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleMasterToggle(!prefs.enabled);
            }
          }}
          className={`mt-3 p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all duration-150 select-none ${
            prefs.enabled
              ? 'bg-[#0a0a0a] hover:bg-[#111111] border-neutral-800 hover:border-neutral-700'
              : 'bg-black hover:bg-[#0a0a0a] border-neutral-900'
          }`}
        >
          <div>
            <div className="text-[13px] font-medium text-white flex items-center gap-2">
              Master Shield
              <span className="text-[11px] font-mono text-neutral-500">
                ({prefs.enabled ? `${activeCount}/10 active` : 'disabled'})
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              {prefs.enabled
                ? 'Zero-flash filters active on X'
                : 'Pause filters without resetting options'}
            </div>
          </div>

          <div
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-150 ${
              prefs.enabled
                ? 'bg-white'
                : 'bg-neutral-900 border border-neutral-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform duration-150 ${
                prefs.enabled ? 'bg-black translate-x-5 shadow-sm' : 'bg-neutral-600 translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Action presets - Vercel style buttons */}
        <div className="grid grid-cols-3 gap-1.5 mt-2.5">
          <button
            type="button"
            onClick={handleEnableAll}
            className="flex items-center justify-center gap-1 py-1 px-2 rounded-md text-[11px] font-medium bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-850 hover:border-neutral-750 transition-colors"
          >
            <Check className="w-3 h-3 text-white" />
            Enable all
          </button>
          <button
            type="button"
            onClick={handleDisableAll}
            className="flex items-center justify-center gap-1 py-1 px-2 rounded-md text-[11px] font-medium bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-850 hover:border-neutral-750 transition-colors"
          >
            <X className="w-3 h-3 text-neutral-500" />
            Disable all
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1 py-1 px-2 rounded-md text-[11px] font-medium bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-750 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Filter Items */}
      <div className="p-3.5 space-y-4 max-h-[380px] overflow-y-auto">
        {/* Section 1: Engagement Metrics */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Engagement Metrics
            </span>
            <span className="text-[10px] font-mono text-neutral-600">BUTTONS STAY USABLE</span>
          </div>
          <div className="space-y-1.5">
            <ToggleItem
              label="Like counts"
              description="Hides count on heart button & opened post"
              icon={<Heart className="w-3.5 h-3.5" />}
              checked={prefs.hideLikes}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('hideLikes', val)}
            />
            <ToggleItem
              label="Reply counts"
              description="Hides replies count on feed & threads"
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              checked={prefs.hideReplies}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('hideReplies', val)}
            />
            <ToggleItem
              label="Repost counts"
              description="Hides retweet number on buttons & stats"
              icon={<Repeat className="w-3.5 h-3.5" />}
              checked={prefs.hideReposts}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('hideReposts', val)}
            />
            <ToggleItem
              label="Quote post counts"
              description="Hides quote link numbers on tweet page"
              icon={<Quote className="w-3.5 h-3.5" />}
              checked={prefs.hideQuotes}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('hideQuotes', val)}
            />
            <ToggleItem
              label="Views & impressions"
              description="Hides view counts & analytics links"
              icon={<Eye className="w-3.5 h-3.5" />}
              checked={prefs.hideViews}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('hideViews', val)}
            />
          </div>
        </div>

        {/* Section 2: Identity & Author Context */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Identity & Context
            </span>
            <span className="text-[10px] font-mono text-neutral-600">6PX SOFT BLUR</span>
          </div>
          <div className="space-y-1.5">
            <ToggleItem
              label="Display names"
              description="Blurs author display name on timeline"
              icon={<Type className="w-3.5 h-3.5" />}
              checked={prefs.blurDisplayName}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('blurDisplayName', val)}
            />
            <ToggleItem
              label="Usernames (@handle)"
              description="Blurs handle so text is judged anonymously"
              icon={<AtSign className="w-3.5 h-3.5" />}
              checked={prefs.blurUsername}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('blurUsername', val)}
            />
            <ToggleItem
              label="Profile pictures (Avatars)"
              description="Blurs avatars including inside quoted posts"
              icon={<User className="w-3.5 h-3.5" />}
              checked={prefs.blurAvatar}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('blurAvatar', val)}
            />
            <ToggleItem
              label="Verification badges"
              description="Blurs blue and gold checkmark badges"
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
              checked={prefs.blurBadge}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('blurBadge', val)}
            />
            <ToggleItem
              label="Timestamps"
              description="Blurs post date/time to avoid recency bias"
              icon={<Clock className="w-3.5 h-3.5" />}
              checked={prefs.blurTimestamp}
              disabled={!prefs.enabled}
              onChange={(val) => updatePreference('blurTimestamp', val)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2.5 px-3.5 bg-black border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-500">
        <span>PURE CSS • ZERO TRACKING</span>
        <span className="text-neutral-600">v1.0.0</span>
      </div>
    </div>
  );
};
