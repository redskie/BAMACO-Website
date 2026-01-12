# 🚀 BAMACO Website - Quick Reference

Quick commands and common tasks for the BAMACO Website project.

---

## 📋 Common Commands

### Development

```bash
# Start local server
python -m http.server 8000
# Visit: http://localhost:8000

# Alternative with Node.js
npx http-server

# VS Code Live Server
# Right-click index.html → Open with Live Server
```

### Data Management

```bash
# Regenerate data.json from HTML files
python generate_data.py

# Always run after adding/editing:
# - Player profiles in players/
# - Guild pages in guilds/
# - Articles in articles/
```

### API Integration

```bash
# Test API health and connectivity
python test_api_health.py

# Test single player API fetch
python test_api_integration.py

# Run daily update manually (updates all profiles)
python scripts/daily_update.py

# Test API module directly
python scripts/maimai_api.py
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

### Add New Player Profile

**Option 1: Automated (Recommended)**
1. Open `create-profile.html` in browser
2. Fill out form
3. Click "Create GitHub Issue"
4. Wait for automation (2-5 minutes)

**Option 2: Manual**
```bash
# 1. Copy template
cp players/playerprofiletemplate.html players/yourign.html

# 2. Edit the PLAYER_INFO object in yourign.html

# 3. Regenerate data
python generate_data.py

# 4. Commit and push
git add .
git commit -m "Add: New player profile - YourIGN"
git push origin main
```

### Update Existing Profile

**Option 1: Via Edit Key**
1. Open `edit-profile.html`
2. Enter your edit key
3. Fill update form
4. Submit GitHub Issue

**Option 2: Manual**
```bash
# 1. Edit your profile HTML directly
# Edit: players/yourign.html

# 2. Regenerate data
python generate_data.py

# 3. Commit and push
git add players/yourign.html data.json
git commit -m "Update: YourIGN profile"
git push origin main
```

### Add New Article

```bash
# 1. Copy template
cp articles/articletemplate.html articles/A003.html

# 2. Edit ARTICLE_INFO object

# 3. Regenerate data
python generate_data.py

# 4. Commit
git add articles/A003.html data.json
git commit -m "Add: New article - Your Title"
git push origin main
```

### Add New Guild

```bash
# 1. Copy template
cp guilds/guildtemplate.html guilds/yourguild.html

# 2. Edit GUILD_INFO object

# 3. Update player files with guildId

# 4. Regenerate data
python generate_data.py

# 5. Commit
git add guilds/yourguild.html players/*.html data.json
git commit -m "Add: New guild - Your Guild"
git push origin main
```

---

## 🔍 Troubleshooting Quick Fixes

### Data not updating on website
```bash
# 1. Regenerate data
python generate_data.py

# 2. Hard refresh browser
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# 3. Check if committed
git status
git add data.json
git commit -m "Update data"
git push origin main
```

### Profile not showing in list
```bash
# Check if in data.json
cat data.json | grep "yourign"

# If not found, regenerate
python generate_data.py

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
```bash
# 1. Check file paths in HTML
<link rel="stylesheet" href="styles.css" />
<link rel="stylesheet" href="enhanced-styles.css" />

# 2. Hard refresh browser
# Ctrl + Shift + R (Windows/Linux)
# Cmd + Shift + R (Mac)

# 3. Check for CSS errors
# F12 → Console → Look for 404 errors
```

---

## 📂 File Locations Quick Reference

### HTML Pages
- **Homepage:** `index.html`
- **Players List:** `players.html`
- **Guilds List:** `guilds.html`
- **Articles List:** `articles.html`
- **Queue:** `queue.html`
- **Admin Queue:** `queue-admin.html`
- **Queue History:** `queue-history.html`
- **Create Profile:** `create-profile.html`
- **Edit Profile:** `edit-profile.html`

### Individual Content
- **Player Profiles:** `players/yourign.html`
- **Guild Pages:** `guilds/yourguild.html`
- **Articles:** `articles/A###.html`

### Templates
- **Player Template:** `players/playerprofiletemplate.html`
- **Guild Template:** `guilds/guildtemplate.html`
- **Article Template:** `articles/articletemplate.html`

### Scripts
- **Data Generator:** `generate_data.py`
- **Profile Processor:** `scripts/process_profile_request.py`
- **Main JavaScript:** `script.js`
- **Navigation:** `navbar.js`
- **Firebase Config:** `firebase-config.js`

### Styles
- **Main CSS:** `styles.css`
- **Enhanced CSS:** `enhanced-styles.css`

### Data
- **Site Data:** `data.json` (auto-generated, don't edit manually)

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
--border-color: #2a2a2a;
--success: #27ae60;
--warning: #f39c12;
--danger: #e74c3c;
```

---

## 🔐 Security Quick Checks

### Before Production
```bash
# 1. Change admin password
# Edit: queue-admin.html
# Line: const ADMIN_PASSWORD = 'Nachi';

# 2. Update Firebase rules
# Go to: Firebase Console → Realtime Database → Rules
# Copy rules from: DEPLOYMENT.md

# 3. Check for exposed secrets
grep -r "password\|secret\|key" --exclude-dir=.git

# 4. Validate inputs
# Check all forms have validation
```

---

## 📊 Data Structure Quick Reference

### Player Object
```javascript
{
  id: "playerid",
  name: "Full Name",
  ign: "InGameName",
  maimaiFriendCode: "123456789012345",
  nickname: "Nick",
  motto: "Player motto",
  age: 20,
  rating: 15000,
  role: "Community Member",
  rank: "S+",
  joined: "2025",
  bio: "Player bio",
  guildId: "guildid",
  achievements: [],
  articles: []
}
```

### Guild Object
```javascript
{
  id: "guildid",
  name: "Guild Name",
  motto: "Guild motto",
  founded: "2025",
  level: 10,
  memberCount: 5,
  description: "Guild description",
  members: []
}
```

### Article Object
```javascript
{
  id: "A001",
  title: "Article Title",
  excerpt: "Brief excerpt...",
  category: "Guide",
  author: "AuthorIGN",
  date: "Jan 1, 2026",
  content: "Full content"
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
- **Database:** Check Firebase Console → Realtime Database
- **Rules:** Firebase Console → Realtime Database → Rules

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

# 1. Regenerate data if content changed
[ ] python generate_data.py

# 2. Test locally
[ ] python -m http.server 8000
[ ] Check main pages load

# 3. Verify no errors
[ ] Open browser console (F12)
[ ] Check for errors

# 4. Commit
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
