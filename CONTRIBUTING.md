# Contributing to BAMACO Website

Thank you for considering contributing to the BAMACO Website! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
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
- Gather reproduction steps

**Submit via GitHub Issues with:**
- Clear, descriptive title
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
**Option A: Automated (Recommended)**
1. Visit `create-profile.html`
2. Fill out your information
3. Click "Create GitHub Issue"
4. Submit the pre-filled issue
5. Wait for automation to process

**Option B: Manual**
1. Copy `players/playerprofiletemplate.html`
2. Rename to `yourign.html` (lowercase, no special chars)
3. Edit the `PLAYER_INFO` object
4. Run `python generate_data.py`
5. Submit a pull request

### 4. Writing Articles/Guides
1. Copy `articles/articletemplate.html`
2. Rename to `A###.html` (e.g., A003.html)
3. Edit the `ARTICLE_INFO` object
4. Write your content
5. Run `python generate_data.py`
6. Submit a pull request

### 5. Creating Guild Pages
1. Copy `guilds/guildtemplate.html`
2. Rename to your guild slug (e.g., `dragon_warriors.html`)
3. Edit the `GUILD_INFO` object
4. Update player files with `guildId` matching your guild
5. Run `python generate_data.py`
6. Submit a pull request

### 6. Code Contributions
Contributing code? Awesome!

**Areas needing help:**
- UI/UX improvements
- Performance optimizations
- Accessibility enhancements
- Mobile responsiveness
- Firebase security rules
- Automation improvements

---

## 💻 Development Setup

### Prerequisites
```bash
# Install Python 3.7+
python --version

# Install Git
git --version
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

# 5. Start local server (optional but recommended)
python -m http.server 8000
# Visit http://localhost:8000
```

---

## 🔄 Contribution Workflow

### Step 1: Keep Your Fork Updated
```bash
git checkout main
git fetch upstream
git merge upstream/main
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
- **Friend Code**: Format as ###-###-###
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
