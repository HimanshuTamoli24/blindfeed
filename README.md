# Blindfeed (FairTweets)

> **Read the content, not the crowd.**  
> A lightweight, privacy-first Chrome extension that eliminates engagement bias on X (formerly Twitter) by hiding metrics and blurring identity signals before first paint.

---

## Highlights

- **⚡ Zero-Flash CSS**: Injected at `document_start`. Engagement counts and identities are hidden immediately without flashing on page load or infinite scrolling.
- **🖱️ Usable Action Buttons**: Like, Reply, Repost, and Bookmark buttons remain 100% interactive and clickable — only the numbers are hidden.
- **🔒 Pure Local-First**: No backend, no accounts, no analytics, no external tracking. Uses Chrome’s native `chrome.storage.sync`.
- **🎛️ Independent Toggles**: Customize exactly what to hide or blur with a sleek, minimalist Vercel-style popup.
- **⚡ Master Shield**: Instantly pause or resume all modifications without resetting your saved choices.

---

## Quick Installation (Ready to Use)

You don't need Node.js or any build tools to use Blindfeed. The repository includes the pre-compiled `dist/` folder ready for Chrome.

### Step-by-Step Chrome Setup:

1. **Download or Clone the Repository**:
   ```bash
   git clone https://github.com/HimanshuTamoli24/blindfeed.git
   ```
   *(or download and extract the ZIP from GitHub)*

2. **Open Extensions in Chrome**:
   - Open Google Chrome.
   - Navigate to `chrome://extensions` in the address bar (or go to **Menu (⋮)** → **Extensions** → **Manage Extensions**).

3. **Enable Developer Mode**:
   - In the top-right corner of the Extensions page, switch the **Developer mode** toggle to **ON**.

4. **Load the Extension**:
   - Click the **Load unpacked** button in the top-left corner.
   - Select the **`dist`** folder located inside this repository.

5. **Pin and Use**:
   - Click the puzzle icon in your Chrome toolbar and pin **Blindfeed**.
   - Navigate to [x.com](https://x.com) to enjoy an unbiased reading experience. Click the extension icon anytime to adjust settings.

---

## Development & Building from Source

If you want to modify the code, add new selectors, or customize the styling:

### Prerequisites
- Node.js 20+
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Unit Tests
Verify preferences schema and storage logic:
```bash
npm test
```

### 3. Build Production Bundle
Compile the popup UI (React + Tailwind CSS) and standalone content script into `dist/`:
```bash
npm run build
```

### 4. Start Local Dev Server
Preview and iterate on the popup UI in your browser:
```bash
npm run dev
```

---

## Features & Controls

| Category | Filter | Description |
| :--- | :--- | :--- |
| **Metrics** | **Like counts** | Hides like count digits; heart button remains active |
| **Metrics** | **Reply counts** | Hides reply counters on timeline and threads |
| **Metrics** | **Repost counts** | Hides retweet counts on action buttons & stats |
| **Metrics** | **Quote counts** | Hides quote count link on opened post views |
| **Metrics** | **Views & impressions** | Hides analytics link and view counts |
| **Identity** | **Display names** | Blurs author display name on timeline |
| **Identity** | **Usernames (@handle)** | Blurs handle so content is judged anonymously |
| **Identity** | **Profile pictures** | Soft 6px blur on avatars (including quoted posts) |
| **Identity** | **Verification badges** | Dims and blurs blue/gold verification checkmarks |
| **Identity** | **Timestamps** | Blurs post timestamp to avoid recency bias |

---

## Technical Details

- **Manifest**: Manifest V3
- **Permissions**: `"storage"` only (least privilege principle)
- **Content Script Execution**: `run_at: "document_start"`
- **Styling**: Scoped data-attribute CSS rules driven by root element state (`html[data-blindfeed-...]`)
- **Compatibility**: Supports both `x.com` and `twitter.com`

---

## License

MIT License. Free to use, modify, and distribute.
