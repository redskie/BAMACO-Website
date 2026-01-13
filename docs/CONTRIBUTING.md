# Contributing to BAMACO Website

Thank you for considering contributing to the BAMACO Website! This document provides guidelines for contributing to our Firebase-powered community platform.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Firebase Integration](#firebase-integration)
- [Contribution Workflow](#contribution-workflow)
- [Style Guidelines](#style-guidelines)
- [Content Guidelines](#content-guidelines)

---

## 🤝 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## 🎯 How Can I Contribute?

### 1. Reporting Bugs
Found a bug? Help us fix it!

**Before submitting:**
- Check existing issues to avoid duplicates
- Test on multiple browsers if possible
- Check Firebase connectivity in browser dev tools
- Gather reproduction steps

**Submit via GitHub Issues with:**
- Clear, descriptive title
- Browser and device information
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Browser/OS information

### 2. Suggesting Features
Have an idea? We'd love to hear it!

**Feature requests should include:**
- Clear use case
- Why this feature benefits the community
- Possible implementation approach
- Examples from other sites (if applicable)

### 3. Adding Player Profiles
**Option A: Web Form (Recommended)**
1. Visit `create-profile.html` on the website
2. Fill out profile information
3. Form automatically saves to Firebase
4. Profile instantly available at `player-profile.html?id={friendCode}`

**Option B: Direct Firebase**
1. Add player data directly to Firebase at `/players/{friendCode}`
2. Use the structure from existing players
3. Profile automatically available

### 4. Writing Articles/Guides
1. Add article to Firebase at `/articles/{articleId}` with structure:
   ```json
   {
     "id": "A###",
     "title": "Article Title",
     "description": "Brief description",
     "content": "Full content (HTML supported)",
     "date": "YYYY-MM-DD",
     "author": "Your IGN"
   }
   ```
2. Article instantly available at `article.html?id={articleId}`

### 5. Creating Guild Pages
1. Add guild to Firebase at `/guilds/{guildId}` with structure:
   ```json
   {
     "id": "guild-slug",
     "name": "Guild Name",
     "tag": "[TAG]",
     "description": "Guild description",
     "members": ["friendCode1", "friendCode2"]
   }
   ```
2. Guild page instantly available at `guild-profile.html?id={guildId}`

### 6. Code Contributions
Contributing code? Awesome!

**Areas needing help:**
- UI/UX improvements
- Firebase security optimizations
- Real-time feature enhancements
- Accessibility improvements
- Mobile responsiveness
- Performance optimizations

---

## 💻 Development Setup

### Prerequisites
```bash
# Install Python 3.7+ (for MaiMai API scripts)
python --version

# Install Git
git --version

# Modern web browser with developer tools
```

### Firebase Integration

Our project uses Firebase Realtime Database for all data storage and real-time features.

**Database Structure:**
```
bamaco-queue-default-rtdb/
├── players/{friendCode}/          # Player profiles
├── guilds/{guildId}/              # Guild information
├── articles/{articleId}/          # Articles and guides
└── queue/                         # Real-time queue system
```

**Key Firebase Modules:**
- `assets/players-db.js` - Player CRUD operations
- `assets/guilds-db.js` - Guild CRUD operations
- `assets/articles-db.js` - Article CRUD operations
- `config/firebase-config.js` - Database configuration
```

### Setup Steps
```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/BAMACO-Website.git
cd BAMACO-Website

# 3. Add upstream remote
git remote add upstream https://github.com/redskie/BAMACO-Website.git

# 4. Create a branch
git checkout -b feature/your-feature-name

# 5. Start local server (recommended for testing)
python -m http.server 8080
# Visit http://localhost:8080

# 6. Test Firebase connectivity
# Open browser dev tools > Network tab
# Verify Firebase requests succeed
```

---

## 🔄 Contribution Workflow

### Step 1: Keep Your Fork Updated
```bash
git checkout main
git fetch upstream
git merge upstream/main
```

### Step 2: Make Your Changes

**For Design Changes:**
- Edit ONLY `/assets/tailwind-config.js`
- Changes apply instantly to all pages
- Test on multiple screen sizes

**For Content Changes:**
```javascript
// Example: Adding a new player
import { playersDB } from './assets/players-db.js';

await playersDB.createPlayer({
  friendCode: "123456789",
  ign: "PlayerName",
  guild: "guild-id",
  // ... other data
});
```

**For Code Changes:**
- Use ES6 modules with `import/export`
- Add `type="module"` to script tags
- Follow existing Firebase patterns
- Test real-time functionality

### Step 3: Test Thoroughly
```bash
# Start local server
python -m http.server 8080

# Test checklist:
# ✅ All pages load without errors
# ✅ Firebase connectivity works
# ✅ Real-time updates function
# ✅ Mobile responsive design
# ✅ Cross-browser compatibility
# ✅ No console errors
```
```

### Step 2: Create a Feature Branch
```bash
git checkout -b feature/descriptive-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `style/` - Code style changes
- `refactor/` - Code refactoring

### Step 3: Make Your Changes
- Write clean, readable code
- Follow existing code style
- Comment complex logic
- Test thoroughly

### Step 4: Regenerate Data (if needed)
```bash
python generate_data.py
```

### Step 5: Commit Your Changes
```bash
git add .
git commit -m "Add: Brief description of changes"
```

**Commit message format:**
- `Add:` New features or content
- `Fix:` Bug fixes
- `Update:` Changes to existing features
- `Remove:` Deleted features or files
- `Docs:` Documentation changes
- `Style:` Formatting, no code change
- `Refactor:` Code restructuring

### Step 6: Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### Step 7: Create Pull Request
1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the PR template
5. Submit!

**Pull Request checklist:**
- [ ] Clear, descriptive title
- [ ] Description of changes
- [ ] Screenshots (for UI changes)
- [ ] Tested locally
- [ ] Data regenerated (if applicable)
- [ ] No console errors
- [ ] Mobile responsive (for UI changes)

---

## 📝 Style Guidelines

### HTML
```html
<!-- Use semantic HTML -->
<section class="player-list">
  <article class="player-card">
    <h3>Player Name</h3>
  </article>
</section>

<!-- Indent with 2 spaces -->
<!-- Use double quotes for attributes -->
<!-- Close all tags -->
```

### CSS
```css
/* Use CSS variables for colors */
.element {
  color: var(--text-primary);
  background: var(--bg-card);
}

/* Mobile-first approach */
.element {
  /* Mobile styles first */
  font-size: 14px;
}

@media (min-width: 768px) {
  .element {
    /* Desktop styles */
    font-size: 16px;
  }
}

/* Use BEM-like naming */
.player-card {}
.player-card__title {}
.player-card--featured {}
```

### JavaScript
```javascript
// Use camelCase for variables and functions
const playerData = {};

function loadPlayerData() {
  // Function logic
}

// Use const/let, not var
const immutable = 'value';
let mutable = 0;

// Comment complex logic
// Calculate player rating based on recent games
const rating = calculateRating(games);

// Use async/await for promises
async function fetchData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Python
```python
# Follow PEP 8
def process_player_data(player_info):
    """
    Process player information and generate HTML.

    Args:
        player_info (dict): Player data dictionary

    Returns:
        str: Generated HTML content
    """
    pass

# Use type hints when possible
def sanitize_filename(name: str) -> str:
    return name.lower().replace(' ', '-')
```

---

## 📚 Content Guidelines

### Player Profiles
- **IGN**: Use exact in-game name with correct formatting
- **Friend Code**: Digits only, no dashes/spaces; length is validated by the MaiMai API
- **Bio**: Keep it friendly, appropriate, and under 500 chars
- **Rating**: Update when it changes significantly
- **Achievements**: Notable accomplishments only
- **Photos**: Optional, but must be appropriate

### Guild Pages
- **Name**: Official guild name
- **ID**: Lowercase, underscores for spaces (e.g., 'dragon_warriors')
- **Motto**: Inspiring, appropriate, under 100 chars
- **Members**: Update when members join/leave
- **Description**: Clear, welcoming

### Articles
- **Title**: Clear, descriptive (50 chars max)
- **Content**: Well-structured, helpful information
- **Language**: English, friendly tone
- **Length**: 500-2000 words recommended
- **Credits**: Cite sources if used
- **Code**: Use markdown code blocks
- **Images**: Optional, properly attributed

---

## ✅ Review Process

### What We Look For
- Code quality and readability
- Functionality (does it work?)
- No breaking changes
- Follows style guidelines
- Mobile responsive (if UI)
- Proper testing

### Timeline
- Initial review: Within 3-5 days
- Follow-up: 1-2 days after changes
- Merge: After approval from maintainer

### After Merge
- Your changes go live on the website
- You'll be credited in commit history
- Consider contributing more! 🎉

---

## 🆘 Need Help?

**Stuck? We're here to help!**

1. **Check documentation**: README.md, this file
2. **Search existing issues**: Someone might have had the same question
3. **Ask in issues**: Create a new issue with the 'question' label
4. **Contact maintainers**: Through BAMACO community channels

---

## 🏆 Recognition

Contributors are recognized in:
- Git commit history
- Project contributors page (if we add one)
- BAMACO community announcements

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to BAMACO Website! Together, we're building something amazing for the community! 🎮💜**
