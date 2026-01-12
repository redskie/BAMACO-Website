# BAMACO Project Structure - Complete Organization

## 📊 Project Overview

BAMACO (Bataan MaiMai Community) is a community website with a **centralized design system** and **organized file structure** for optimal maintainability.

---

## 📁 Complete Directory Structure

```
BAMACO-Website/
│
├── 📄 .cursorrules                    # AI Assistant Instructions (MUST READ)
├── 📄 .gitignore                      # Git ignore rules
├── 📄 README.md                       # Main project documentation
├── 📄 LICENSE                         # Project license
│
├── 📄 index.html                      # 🏠 Homepage
├── 📄 players.html                    # Players listing page
├── 📄 guilds.html                     # Guilds listing page
├── 📄 articles.html                   # Articles/guides listing

├── 📄 queue.html                      # Queue management
├── 📄 queue-history.html              # Queue history
├── 📄 queue-admin.html                # Queue admin panel
├── 📄 create-profile.html             # Create profile form
├── 📄 edit-profile.html               # Edit profile form
├── 📄 player-profile.html             # Player profile template
├── 📄 guild-profile.html              # Guild profile template
├── 📄 article.html                    # Article template
│
├── 📂 assets/                         # ✨ CORE ASSETS - Design & Functionality
│   ├── tailwind-config.js             # 🔥 SINGLE SOURCE OF TRUTH - All design tokens
│   ├── styles.css                     # Legacy/fallback styles (navbar CSS)
│   ├── enhanced-styles.css            # Enhanced styling (legacy)
│   ├── styles-tailwind.css            # Tailwind utilities (legacy)
│   ├── script.js                      # Main JavaScript functionality
│   ├── navbar.js                      # Centralized navigation system
│   ├── page-transitions.js            # Page transition animations
│   └── design-system.js               # Additional design utilities
│
├── 📂 config/                         # ⚙️ CONFIGURATION FILES
│   ├── data.json                      # Player/guild/article database
│   ├── firebase-config.js             # Firebase configuration
│   └── tailwind.config.js             # Tailwind build config (for CLI)
│
├── 📂 docs/                           # 📚 DOCUMENTATION
│   ├── API_INTEGRATION_GUIDE.md       # API integration guide
│   ├── API_STATUS.md                  # API status & endpoints
│   ├── CHANGELOG.md                   # Version history
│   ├── CONTRIBUTING.md                # Contribution guidelines
│   ├── DEPLOYMENT.md                  # Deployment instructions
│   ├── DESIGN_UPDATE_COMPLETE.md      # Design update notes
│   ├── HOVER_EFFECTS_GUIDE.md         # Hover effects documentation
│   ├── PAGE_TRANSITIONS.md            # Page transitions guide
│   ├── QUICK_REFERENCE.md             # Quick reference guide
│   ├── TAILWIND_MIGRATION_GUIDE.md    # Tailwind migration guide
│   ├── TAILWIND_MIGRATION_SUMMARY.md  # Migration summary
│   ├── TAILWIND_SETUP.md              # Tailwind setup guide
│   └── UPDATE_COLORS.md               # Color update guide
│
├── 📂 scripts/                        # 🛠️ AUTOMATION SCRIPTS
│   ├── daily_update.py                # Daily automated updates
│   ├── generate_data.py               # Generate data.json
│   ├── manual_update.py               # Manual data updates
│   ├── content_editor.py              # Content editor utility
│   ├── maimai_api.py                  # MaiMai API integration
│   ├── process_profile_request.py     # Process profile requests
│   ├── update-tailwind-config.ps1     # Update Tailwind configs
│   ├── standardize-hover-effects.ps1  # Standardize hover effects
│   └── update-paths.ps1               # Update file paths after reorganization
│
├── 📂 players/                        # 👤 PLAYER PROFILE PAGES
│   ├── hayate.html
│   ├── bmcmarx_godarx.html
│   ├── kuriyama.html
│   ├── joo.html
│   ├── k.html
│   ├── sette.html
│   ├── jetlagg.html
│   └── playerprofiletemplate.html     # Template for new players
│
├── 📂 guilds/                         # 🛡️ GUILD PROFILE PAGES
│   ├── godarx.html
│   └── guildtemplate.html             # Template for new guilds
│
├── 📂 articles/                       # 📝 ARTICLE/GUIDE PAGES
│   ├── A001.html
│   ├── A002.html
│   └── articletemplate.html           # Template for new articles
│

│   ├── api_demo.html
│   ├── API_DOCUMENTATION.md
│   ├── API_INTEGRATION_ARCHITECTURE.md
│   ├── API_QUICK_REFERENCE.md
│   ├── CHEAT_SHEET.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── FILE_DISTRIBUTION.md
│   ├── analysis.md
│   └── create-client-package.ps1
│
└── 📂 .github/                        # 🤖 GITHUB AUTOMATION
    ├── workflows/
    │   ├── daily-update.yml
    │   └── process-profile.yml
    └── ISSUE_TEMPLATE/
        ├── player-profile-request.yml
        └── player-profile-update.yml
```

---

## 🎯 Key Principles

### 1. **CENTRALIZATION** 🔥
- **ALL design tokens** (colors, spacing, animations) → `/assets/tailwind-config.js`
- **ALL data** (players, guilds, articles) → `/config/data.json`
- **ALL navigation** → `/assets/navbar.js`
- **NEVER** inline styles, configs, or hardcoded data

### 2. **ORGANIZATION** 📦
- Assets (CSS/JS) → `/assets/`
- Configurations → `/config/`
- Documentation → `/docs/`
- Scripts → `/scripts/`
- HTML pages → Root or subdirectories (players/, guilds/, articles/)

### 3. **CONSISTENCY** ✨
- Use unified hover classes: `hover-card`, `hover-btn-primary`, `hover-btn-secondary`
- Use color tokens: `accent-pink`, `bg-primary`, not `#ff6b9d`
- Use centralized navigation: `navbar.js` generates all menus
- Use page transitions: `page-transitions.js` handles animations

---

## 📝 File Path Reference

### Root HTML Files Reference:
```html
<!-- Assets -->
<script src="assets/tailwind-config.js"></script>
<script src="assets/script.js"></script>
<script src="assets/navbar.js"></script>
<script src="assets/page-transitions.js"></script>
<link rel="stylesheet" href="assets/styles.css" />

<!-- Config -->
<script src="config/firebase-config.js"></script>
<!-- In JS: fetch('config/data.json') -->
```

### Subdirectory HTML Files Reference (players/, guilds/, articles/):
```html
<!-- Assets -->
<script src="../assets/tailwind-config.js"></script>
<script src="../assets/script.js"></script>
<script src="../assets/navbar.js"></script>
<script src="../assets/page-transitions.js"></script>
<link rel="stylesheet" href="../assets/styles.css" />

<!-- Config -->
<script src="../config/firebase-config.js"></script>
<!-- In JS: fetch('../config/data.json') -->
```

---

## 🔧 How to Make Changes

### Change Design (Colors, Spacing, Animations):
1. Edit `/assets/tailwind-config.js`
2. Changes apply to **all 26+ HTML files** instantly
3. No need to update individual pages

### Change Hover Effects:
1. Edit hover classes in `/assets/tailwind-config.js` (after line 110)
2. Modify CSS properties (transform, box-shadow, border-color)
3. Effects update across entire site

### Add/Update Content (Player, Guild, Article):
1. Edit `/config/data.json`
2. Add entry with proper structure
3. Content appears automatically on listing pages

### Update Navigation:
1. Edit `/assets/navbar.js`
2. Modify `NAVBAR_CONFIG.links` array
3. Navigation updates across all pages

### Add New Page:
1. Create HTML file in appropriate location
2. Reference assets with correct paths (`assets/` or `../assets/`)
3. Use centralized Tailwind config: `<script src="assets/tailwind-config.js"></script>`
4. Use unified hover classes

---

## ✅ Quality Checklist

Before committing changes:
- [ ] All colors use tailwind-config.js tokens (no hardcoded values)
- [ ] All hover effects use unified classes
- [ ] File paths reference organized folders
- [ ] No inline `<script>tailwind.config = {...}</script>`
- [ ] All scripts in `/scripts/`
- [ ] All docs in `/docs/`
- [ ] All configs in `/config/`
- [ ] All assets in `/assets/`

---

## 🚀 Quick Commands

```bash
# Development
npm start                  # Start local server (if configured)

# Update Paths (if needed)
./scripts/update-paths.ps1

# Standardize Hover Effects
./scripts/standardize-hover-effects.ps1

# Update Tailwind Configs
./scripts/update-tailwind-config.ps1

# Generate Data
python scripts/generate_data.py

# Daily Update
python scripts/daily_update.py
```

---

## 📚 Important Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `.cursorrules` | AI assistant instructions | When changing project standards |
| `assets/tailwind-config.js` | **DESIGN SYSTEM** | Changing any visual aspect |
| `config/data.json` | Content database | Adding/updating content |
| `assets/script.js` | Core functionality | Adding features |
| `assets/navbar.js` | Navigation system | Changing menu structure |
| `assets/styles.css` | Legacy styles | Navbar CSS, fallbacks only |

---

## 🎨 Design System Quick Reference

### Colors (from tailwind-config.js)
```
Backgrounds:  bg-primary, bg-secondary, bg-tertiary, bg-card
Text:         text-primary, text-secondary, text-muted
Accents:      accent-pink, accent-purple, accent-blue
Borders:      border-primary, border-glow
```

### Hover Effects
```
hover-card           → Cards (lifts 0.5rem, pink shadow)
hover-btn-primary    → Primary buttons (lifts 0.25rem, pink glow)
hover-btn-secondary  → Secondary buttons (border color change, lift)
hover-subtle         → Stats/info boxes (minimal scale)
hover-gradient-line  → Gradient top line on hover
```

---

## 🔥 Remember

> **"One file to rule them all"** - `tailwind-config.js` controls ALL design

> **"Everything in its place"** - Organized folders = maintainable code

> **"Consistency is key"** - Use centralized classes, never inline

---

**Last Updated**: January 12, 2026  
**Organization Complete**: ✅  
**Files Organized**: 13+ docs, 8+ scripts, 8+ assets, 3+ configs, 26+ HTML pages  
**Centralization Status**: 100% Complete
