# BAMACO Website - AI Coding Agent Instructions

## 🎯 Quick Start for AI Agents

BAMACO is a **static website with Firebase backend** serving a MaiMai rhythm game community. The key principle: **All design changes happen in ONE file** (`/assets/tailwind-config.js`) to maintain consistency across HTML files.

**Environment guardrails**
- Do **not** run npm/npx/yarn or other Node-based commands here; rely on Python tooling (for example `python -m http.server`) and edit code directly.
- Keep everything in vanilla HTML/CSS/JS; no bundlers or build steps.

**Data layer truth**
- **Firestore (canonical):** `players`, `guilds`, `articles`, `achievements`
- **Realtime Database (queue-only):** `queue`, `currentlyPlaying`, `gameHistory`, `playerCredits`

## 🏗️ Architecture Overview

### Centralized Design System
- **Single Source of Truth**: `/assets/tailwind-config.js` - contains ALL colors, spacing, hover effects, animations
- **NO inline styles** in HTML - everything uses Tailwind utility classes
- **Unified hover effects**: Use `hover-card`, `hover-btn-primary`, `hover-btn-secondary` instead of custom CSS
- Each HTML file loads: `<script src="assets/tailwind-config.js"></script>` then applies config

### Key Data Flow Pattern (Firebase-Based)
1. **Player Data**: Stored in Firestore `players/{friendCode}` - use `playersDB` module
2. **Guilds**: Stored in Firestore `guilds/{id}` - use `guildsDB` module
3. **Articles**: Stored in Firestore `articles/{id}` - use `articlesDB` module
4. **Achievements**: Stored in Firestore `achievements/{id}` - use `achievementsDB` module
5. **Queue System**: Realtime Database only for `queue`, `currentlyPlaying`, `gameHistory`, `playerCredits`
6. **Dynamic Profiles**: Single `player-profile.html?id={friendCode}` loads any player from Firestore

```javascript
// NEW: Firebase player operations
import { playersDB } from './assets/players-db.js';

// Create player
await playersDB.createPlayer(playerData);

// Get player
const player = await playersDB.getPlayer(friendCode);

// Real-time subscription
playersDB.subscribeToPlayers((players) => {
  // Render player list
});
```

### File Organization (Critical Paths)
```
/assets/
├── tailwind-config.js     # 🔥 ONLY place to edit design
├── players-db.js          # 🔥 Firestore CRUD for players
├── guilds-db.js           # Firestore CRUD for guilds
├── articles-db.js         # Firestore CRUD for articles
├── achievements-db.js     # Firestore CRUD for achievements
├── script.js              # Core functions: createPlayerCard(), loadStats()
├── navbar.js              # Centralized navigation generation
├── auth.js                # Authentication system
└── styles.css             # Legacy CSS - avoid editing

/config/
└── firebase-config.js     # Firebase configuration & Firestore/RTDB refs

player-profile.html        # Dynamic player profile page (loads from Firestore)
create-profile.html        # Profile creation (writes to Firestore)
edit-profile.html          # Profile editing (updates Firestore)
queue*.html                # Queue pages (Realtime Database)
```

## 🚨 Critical Workflows

### When Changing Design (Colors, Hover, Animations)
1. **ONLY edit** `/assets/tailwind-config.js` in the `window.BAMACO_TAILWIND_CONFIG` object
2. Changes instantly apply to ALL HTML files
3. **Never** create inline `<script>tailwind.config = {...}</script>` in HTML

### When Working with Player Data
1. **Use playersDB module** - Import from `./assets/players-db.js` (Firestore)
2. **Profile URL format**: `player-profile.html?id={friendCode}`
3. **Real-time updates**: Use `subscribeToPlayers()` or `subscribeToPlayer()`
4. **Authentication**: Password hashing with SHA-256 + salt
5. **Friend code format**: 15 digits, no dashes/spaces (continuous numbers only)

### Queue System (Firebase Integration)
- **Realtime Database only**: `queue`, `currentlyPlaying`, `gameHistory`, `playerCredits`
- **Entry points**: `queue.html` (public), `queue-admin.html` (protected), `queue-history.html`
- **Pattern**: Import from `./config/firebase-config.js`, set up `onValue` listeners, update DOM

## 🎨 Project-Specific Patterns

### Marquee Effect for Long Titles
```javascript
// Auto-activates for titles >= 25 characters
if (title.length >= 25) {
  const container = document.createElement('div');
  container.className = 'marquee-container';
  const content = document.createElement('span');
  content.className = 'marquee-content';
  content.textContent = title;
  container.appendChild(content);
  // ... replace element
}
```

### Player Profile Links (IMPORTANT!)
```javascript
// Always use player-profile.html with friendCode
const profileUrl = `player-profile.html?id=${player.friendCode || player.id}`;

// NOT: players/ign.html (old static file system - deprecated)
```

### Card Generation Functions (in `/assets/script.js`)
- `createPlayerCard(player)` - Unified player display (links to player-profile.html)
- `createGuildCard(guild)` - Guild listings
- `createArticleCard(article)` - Article previews
- All automatically use centralized hover classes and design tokens

### Mobile-First Responsive Pattern
```html
<!-- Standard responsive classes -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
<!-- Text sizing -->
<h1 class="text-3xl sm:text-4xl lg:text-6xl">
<!-- Touch targets on mobile -->
<a class="min-h-10 flex items-center justify-center">
```

## 🔧 External Dependencies

### MaiMai API Integration (`scripts/maimai_api.py`)
- **Endpoint**: `https://maimai-data-get.onrender.com/api/player/{friend_code}`
- **Purpose**: Fetch real IGN, rating, trophy from official game servers
- **Used During**: Profile creation (validates friend code)
- **Authentication**: API requires active backend session (can fail with 500 errors)

### Firebase Database System
- **Config**: Import from `./config/firebase-config.js` with pre-configured Firestore and RTDB refs
- **Players/Guilds/Articles/Achievements**: Use `./assets/*-db.js` (Firestore) for CRUD operations
- **Queue**: Uses RTDB with `onValue(ref, callback)` listeners
- **Security**: Admin panel protected by password prompt

## ⚡ Common Anti-Patterns to Avoid
❌ **Never edit** `config/data.json` manually - it's generated (and not the source of truth)
❌ **Never use** inline `style=""` or `<style>` tags - use Tailwind tokens
❌ **Never hardcode** colors like `#ff6b9d` - use `accent-pink` from config
❌ **Never break** relative paths: use `../assets/` from subdirectories
❌ **Never edit** hover effects per-element - use unified classes
❌ **Never link** to `players/*.html` - use `player-profile.html?id=`
❌ **Never run npm/npx/yarn** in this repo - use Python tooling instead

## 🎯 Key Files for Quick Edits
| Task | Edit This File | Pattern |
|------|---------------|---------|
| Change colors/design | `/assets/tailwind-config.js` | Modify `window.BAMACO_TAILWIND_CONFIG` |
| Add/update player | `create-profile.html` or `edit-profile.html` | Saves to Firestore via `playersDB` |
| Manage guild data | Firestore console or `guilds-db.js` helpers | `guild-profile.html?id={guildId}` |
| Manage articles | Firestore console or `articles-db.js` helpers | `article.html?id={articleId}` |
| Fix queue issues | `/config/firebase-config.js` | RTDB refs for queue pages |
| Navigation changes | `/assets/navbar.js` | Edit `NAVBAR_CONFIG.links` |

## 🔍 Debugging Quick Wins
- **Missing player/guild/article**: Check Firestore for document existence (`players/{friendCode}`, `guilds/{id}`, `articles/{id}`)
- **Design inconsistency**: Verify all pages load `/assets/tailwind-config.js`
- **Queue not updating**: Check Firebase console (RTDB) for connection errors on queue paths
- **API failures**: Check `scripts/maimai_api.py` for 500 errors (backend session expired)
- **Profile not loading**: Confirm URL has `?id={friendCode}` and Firestore has matching doc
