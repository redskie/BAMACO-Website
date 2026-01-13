# 🚀 BAMACO Website - Quick Reference

Quick commands and common tasks for the Firebase-powered BAMACO Website.

---

## 📋 Common Commands

### Development

```bash
# Start local server
python -m http.server 8080
# Visit: http://localhost:8080

# Alternative with Node.js
npx http-server -p 8080

# VS Code Live Server
# Right-click index.html → Open with Live Server
```

### Firebase Operations

```bash
# Firestore quick test (browser console):
# import { playersDB } from './assets/players-db.js';
# const players = await playersDB.getAllPlayers();
# console.log(players);

# Queue (RTDB) quick test: open queue.html and inspect Network > Firebase
```

### API Integration

```bash
# Test MaiMai API connectivity
python scripts/maimai_api.py

# Run daily Firebase update manually
python scripts/daily_update_firebase.py

# Check API status for all players
# (script will show success/failure for each friend code)
```

### Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "Add: Your changes here"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## 📝 Common Tasks

### Firebase Operations (sanity checks)

```bash
# Firestore: browser console
# import { playersDB } from './assets/players-db.js';
# const players = await playersDB.getAllPlayers();
# console.log(players);

# Queue (RTDB): open queue.html and watch Network tab for Firebase requests
```

### Add New Player Profile

**Option 1: Web Form (Recommended)**
1. Open `create-profile.html` in browser
2. Fill out form completely
3. Form saves directly to Firestore (players collection)
4. Profile available at `player-profile.html?id={friendCode}`

**Option 2: Direct Firestore**
```javascript
// Firebase Console → Firestore → players → Add document (ID = friendCode)
{
  "friendCode": "123456789012345",
  "ign": "PlayerName",
  "guildId": "guild-id",
  "rating": "0",
  "isPublic": true
}
```

### Update Existing Profile

**Option 1: Edit Form**
1. Open `edit-profile.html?id={friendCode}`
2. Fill update form
3. Saves directly to Firestore

**Option 2: Direct Firestore Edit**
- Firebase Console → Firestore → players → select `friendCode`
- Edit fields and save

### Add New Article (Firestore)

```javascript
// Firebase Console → Firestore → articles → Add document (ID = articleId)
{
  "id": "A003",
  "title": "Article Title",
  "excerpt": "Brief description",
  "content": "<p>HTML content here</p>",
  "category": "Guide",
  "isPublished": true,
  "publishedAt": 1700000000000,
  "authorId": "friendCode"
}
# Article available at: article.html?id=A003
```

### Add New Guild (Firestore)

```javascript
// Firebase Console → Firestore → guilds → Add document (ID = guildId)
{
  "id": "guild-slug",
  "name": "Guild Name",
  "tag": "[TAG]",
  "description": "Guild description",
  "members": ["friendCode1", "friendCode2"],
  "founded": "2024-01-15"
}
# Guild available at: guild-profile.html?id=guild-slug
```

---

## 🔍 Troubleshooting Quick Fixes

### Player data not loading
```bash
# Check Firebase connectivity in browser console:
# F12 > Network tab > Look for Firebase requests

# Test database access:
# F12 > Console tab:
import('./assets/players-db.js').then(m => m.playersDB.getAllPlayers()).then(console.log)
```

### Profile not showing in list
```javascript
// Check if data exists in Firebase
// Browser console:
import('./assets/players-db.js').then(async (m) => {
  const player = await m.playersDB.getPlayer('friendCode');
  console.log('Player data:', player);
});
```

### Queue system not working
```bash
# Check Firebase connection
# 1. Open queue.html
# 2. F12 > Console tab
# 3. Look for Firebase connection errors
# 4. Verify config in config/firebase-config.js
```

### Design changes not applying
```bash
# Check if tailwind-config.js loads correctly
# 1. F12 > Network tab
# 2. Reload page
# 3. Verify assets/tailwind-config.js loads successfully
# 4. Check console for JavaScript errors
```

# Check for errors in HTML
# Open players/yourign.html and look for PLAYER_INFO object
```

### Queue not working
```bash
# 1. Check Firebase config
# Open firebase-config.js
# Verify all credentials

# 2. Check browser console
# F12 → Console tab
# Look for Firebase errors

# 3. Test Firebase connection
# Visit: https://console.firebase.google.com
# Check Realtime Database
```

### CSS not applying
- Verify `assets/tailwind-config.js` loads (Network tab)
- Check console for Tailwind config errors

---

## 📂 File Locations Quick Reference

### Main HTML Pages
- **Homepage:** `index.html`
- **Players List:** `players.html`
- **Guilds List:** `guilds.html`
- **Articles List:** `articles.html`
- **Queue:** `queue.html`
- **Admin Queue:** `queue-admin.html` (password protected)
- **Queue History:** `queue-history.html`
- **Create Profile:** `create-profile.html`
- **Edit Profile:** `edit-profile.html`

### Dynamic Content Pages
- **Player Profiles:** `player-profile.html?id={friendCode}`
- **Guild Pages:** `guild-profile.html?id={guildId}`
- **Articles:** `article.html?id={articleId}`

### Firebase Modules
- **Player Database:** `assets/players-db.js`
- **Guild Database:** `assets/guilds-db.js`
- **Article Database:** `assets/articles-db.js`
- **Achievements Database:** `assets/achievements-db.js`
- **Firebase Config:** `config/firebase-config.js`

### Core Scripts
- **Main JavaScript:** `assets/script.js`
- **Navigation:** `assets/navbar.js`
- **Design System:** `assets/tailwind-config.js`
- **Authentication:** `assets/auth.js`

### Python Scripts
- **Daily Updates:** `scripts/daily_update_firebase.py`
- **API Integration:** `scripts/maimai_api.py`

---

## 🎨 CSS Variables Quick Reference

```css
/* Use these in your custom styles */
--bg-primary: #0a0a0a;
--bg-secondary: #121212;
--bg-card: #1a1a1a;
--text-primary: #e0e0e0;
--text-secondary: #a0a0a0;
--text-muted: #707070;
--accent-primary: #9b59b6;
--accent-secondary: #8e44ad;
```

---

## 🔐 Security Quick Checks

### Before Production
```bash
# 1) Firestore rules (players/guilds/articles/achievements)
# - Allow read if intended public, restrict writes to authenticated/admin

# 2) Realtime Database rules (queue, currentlyPlaying, gameHistory, playerCredits)
# - Lock writes to authorized admin functions; read-only if public queue display is desired

# 3) Validate admin panel access
# - queue-admin.html password protection; no hardcoded secrets in JS

# 4) Check for exposed secrets
grep -r "password\|secret\|key" --exclude-dir=.git .
```

---

## 📊 Data Structure Quick Reference

### Player Object (Firestore)
```javascript
{
  friendCode: "123456789012345",
  ign: "InGameName",
  rating: "15.50",
  rank: "SSS",
  guildId: "guild-id",
  articleIds: ["art_001"],
  achievementIds: ["ach_001"],
  isPublic: true,
  createdAt: 1700000000000,
  updatedAt: 1700000000000
}
```

### Guild Object (Firestore)
```javascript
{
  id: "guild-slug",
  name: "Guild Name",
  tag: "[TAG]",
  description: "Guild description",
  members: ["friendCode1", "friendCode2"],
  founded: "2024-01-15"
}
```

### Article Object (Firestore)
```javascript
{
  id: "A003",
  title: "Article Title",
  excerpt: "Brief description",
  content: "<p>HTML content</p>",
  category: "Guide",
  authorId: "friendCode",
  isPublished: true,
  publishedAt: 1700000000000
}
```

---

## 🌐 URLs Quick Reference

### GitHub
- **Repository:** `https://github.com/redskie/BAMACO-Website`
- **Issues:** `https://github.com/redskie/BAMACO-Website/issues`
- **Actions:** `https://github.com/redskie/BAMACO-Website/actions`

### Firebase
- **Console:** `https://console.firebase.google.com`
- **Firestore:** Firebase Console → Firestore Database (players/guilds/articles/achievements)
- **Realtime DB (queue only):** Firebase Console → Realtime Database → queue/ currentlyPlaying/ gameHistory/ playerCredits
- **Rules:** Configure Firestore rules for reads/writes; RTDB rules for queue paths

### Deployment
- **GitHub Pages:** `https://redskie.github.io/BAMACO-Website/`
- **Custom Domain:** (Configure in repo settings)

---

## 📞 Getting Help

### Documentation
1. **README.md** - Complete project guide
2. **CONTRIBUTING.md** - How to contribute
3. **DEPLOYMENT.md** - Deployment guide
4. **PROJECT_SUMMARY.md** - What changed
5. This file - Quick reference

### Support
- **GitHub Issues:** For bugs and features
- **Pull Requests:** For code contributions
- **Community:** BAMACO Discord/Telegram

---

## ✅ Pre-Commit Checklist

```bash
# Run before each commit:

# 1. Test locally
[ ] python -m http.server 8000
[ ] Check main pages load

# 2. Verify no errors
[ ] Open browser console (F12)
[ ] Check for errors (Firestore/queue requests)

# 3. Commit
[ ] git add .
[ ] git commit -m "Clear message"
[ ] git push origin main
```

---

## 🎯 Performance Tips

```bash
# Check page load time
# 1. Open DevTools (F12)
# 2. Network tab
# 3. Reload page (Ctrl+R)
# 4. Check total load time

# Optimize images
# Use tools like: TinyPNG, ImageOptim

# Minify CSS/JS (optional)
# Use online tools or build tools

# Test mobile performance
# DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

---

**Keep this file handy for quick reference! 📌**
