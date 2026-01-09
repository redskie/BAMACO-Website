# BAMACO Website

## Bataan MaiMai Community Gaming Website

A modern, feature-rich website for the Bataan MaiMai Community (BAMACO) - a rhythm gaming community. This project features player profiles, guild management, community articles, and a real-time queue system powered by Firebase.

---

## 🎯 Project Overview

BAMACO Website is a comprehensive web platform designed to:
- **Showcase community members** with detailed player profiles
- **Manage guilds** with member rosters and achievements
- **Share knowledge** through community-written guides and articles
- **Coordinate gameplay** with a real-time queue management system
- **Automate profile creation** via GitHub Issues integration

---

## ✨ Key Features

### 🎨 User Interface
- **Dark Modern Theme** - Sleek purple accent color scheme optimized for readability
- **Mobile-First Design** - Fully responsive with touch-optimized controls
- **Smooth Animations** - Enhanced UX with fluid transitions and hover effects
- **Card-Based Layout** - Clean, organized content presentation
- **Search & Filter** - Quick content discovery across all sections

### 👥 Player System
- **Individual Profiles** - Showcase IGN, stats, achievements, and bio
- **Automated Creation** - GitHub Issues workflow for profile requests
- **Edit Keys** - Secure profile updates with device fingerprinting
- **Guild Integration** - Link players to their guilds
- **Article Attribution** - Display authored guides on profiles

### 🛡️ Guild System
- **Guild Pages** - Display guild info, members, and motto
- **Member Management** - Automatic member lists from player data
- **Guild Emblems** - Custom branding for each guild

### 📚 Articles & Guides
- **Community Content** - Player-written tips, guides, and strategies
- **Author Linking** - Articles automatically link to author profiles
- **Categories** - Organized by type (Guide, Techniques, Tips, etc.)
- **Dynamic Loading** - Content pulled from data.json

### ⏱️ Queue System (Firebase)
- **Real-Time Queue** - Live player queue for arcade sessions
- **Admin Panel** - Manage queue, mark paid, swap players
- **Game History** - Track past games and player rotations
- **Currently Playing** - Display active players
- **Credit System** - Optional player credit tracking

---

## 📁 Project Structure

```
BAMACO-Website/
├── index.html                      # Homepage with stats and featured content
├── players.html                    # All players listing page
├── player-profile.html             # Player profile template
├── guilds.html                     # All guilds listing page
├── guild-profile.html              # Guild profile template
├── articles.html                   # All articles listing page
├── article.html                    # Article template
├── queue.html                      # Public queue viewer
├── queue-admin.html                # Admin queue management
├── queue-history.html              # Game history viewer
├── create-profile.html             # Profile creation form
├── edit-profile.html               # Profile editing form
├── styles.css                      # Main stylesheet
├── enhanced-styles.css             # Enhanced UI/UX styles
├── script.js                       # Core JavaScript
├── navbar.js                       # Navigation component
├── firebase-config.js              # Firebase configuration
├── data.json                       # Site data (players, guilds, articles)
├── generate_data.py                # Data generator script
├── content_editor.py               # Content management tool
│
├── players/                        # Individual player HTML files
│   ├── playerprofiletemplate.html
│   ├── bmcmarx_godarx.html
│   ├── hayate.html
│   └── ... (more player files)
│
├── guilds/                         # Individual guild HTML files
│   ├── guildtemplate.html
│   ├── godarx.html
│   └── ... (more guild files)
│
├── articles/                       # Individual article HTML files
│   ├── articletemplate.html
│   ├── A001.html
│   └── ... (more article files)
│
├── scripts/                        # Python automation scripts
│   └── process_profile_request.py # GitHub Issues processor
│
├── .github/                        # GitHub automation
│   ├── workflows/
│   │   └── process-profile.yml    # Profile automation workflow
│   └── ISSUE_TEMPLATE/
│       ├── player-profile-request.yml
│       └── player-profile-update.yml
│
├── LICENSE                         # Project license
└── README.md                       # This file
```

---

## 🚀 How Everything Works

### 1. **Static Website Core**
The site is built with vanilla HTML, CSS, and JavaScript - no frameworks required. The main data source is `data.json`, which contains all players, guilds, and articles. JavaScript dynamically loads and renders this data across all pages.

### 2. **Data Generation System**
`generate_data.py` scans the `players/`, `guilds/`, and `articles/` directories, extracts data from HTML files, and generates `data.json`. This ensures the homepage and listing pages always show current content.

**How it works:**
- Reads JavaScript object literals from HTML files (e.g., `const PLAYER_INFO = {...}`)
- Parses player stats, guild memberships, achievements, and articles
- Automatically selects top 3 rated players as "featured"
- Sorts articles by date to show latest content
- Outputs formatted JSON with all site data

**Run it:**
```bash
python generate_data.py
```

### 3. **Automated Profile System (GitHub Integration)**

The website includes a sophisticated automated profile creation system using GitHub Issues and Actions.

**User Flow:**
1. User visits `create-profile.html` and fills out their info
2. System generates a unique edit key and device fingerprint
3. User clicks "Create GitHub Issue" which opens a pre-filled issue template
4. Upon issue submission, GitHub Actions automatically triggers
5. `process_profile_request.py` parses the issue body
6. Script generates HTML file in `players/` directory
7. Changes are committed and pushed
8. Issue is closed with confirmation comment
9. User can update their profile later using the same edit key

**Why GitHub Issues?**
- No backend server required
- Built-in authentication and security
- Free automation with GitHub Actions
- Issue tracking provides audit trail
- Easy moderation by repository maintainers

**Scripts involved:**
- `scripts/process_profile_request.py` - Main processor
- `.github/workflows/process-profile.yml` - GitHub Actions workflow
- `.github/ISSUE_TEMPLATE/` - Issue form templates

### 4. **MaiMai API Integration** 🆕

Automated player data fetching from official MaiMai servers using the MaiMai DX Player Data API.

**What It Does:**
- **Auto-fetch IGN**: Player's in-game name pulled from MaiMai servers (cannot be manually entered)
- **Current Rating**: DX Rating automatically fetched and updated daily
- **Profile Data**: Trophy/title and avatar icon synced from game servers
- **Daily Updates**: All player profiles auto-update at 10:00 AM daily

**How It Works:**
1. Player enters their 15-digit friend code
2. System queries MaiMai API: `https://maimai-data-get.onrender.com`
3. Fetches official IGN, rating, trophy, and icon
4. Profile created with real-time game data
5. GitHub Actions runs daily updates automatically

**API Features:**
- Single player fetch: `/api/player/{friend_code}`
- Batch fetching: Up to 10 players per request
- Automatic retry logic for reliability
- Session handling for authentication
- 60-second timeout for cold starts

**Automated Updates:**
- **Schedule**: Daily at 10:00 AM Philippine Time (2:00 AM UTC)
- **Updates**: IGN, Rating, Trophy, Avatar Icon
- **Script**: `scripts/daily_update.py`
- **Workflow**: `.github/workflows/daily-update.yml`
- **Success Rate**: 6/9 players (67%)

**Manual Testing:**
```bash
# Test single player
python scripts/maimai_api.py

# Run daily update manually
python scripts/daily_update.py

# Check API health
python test_api_health.py
```

**Note**: API requires active backend session. If player data endpoints return 500 errors, the API maintainer needs to renew authentication. See [API_STATUS.md](API_STATUS.md) for current status.

### 5. **Queue System (Firebase)**

Real-time queue management for arcade gaming sessions powered by Firebase Realtime Database.

**Features:**
- **Add to Queue**: Players join with name and optional credits
- **Mark as Paid**: Track who has paid for their session
- **Currently Playing**: Move top 2 players to active play
- **Game History**: Record completed games with timestamp
- **Admin Controls**: Password-protected panel for queue management
- **Real-time Updates**: All changes instantly visible to all users

**Firebase Structure:**
```
bamaco-queue/
├── queue/                 # Current queue
│   ├── {pushId}/
│   │   ├── name
│   │   ├── credits
│   │   ├── paid
│   │   └── timestamp
├── currentlyPlaying/      # Active players
├── gameHistory/           # Past games
└── playerCredits/         # Credit tracking
```

**Access:**
- Public queue viewer: `queue.html`
- Admin panel: `queue-admin.html` (password: Nachi)
- History viewer: `queue-history.html`

### 6. **Content Management**

**For Players:**
- Use templates in `players/playerprofiletemplate.html`
- Edit the `PLAYER_INFO` JavaScript object
- Or use the automated GitHub Issues system with API integration

**For Guilds:**
- Use templates in `guilds/guildtemplate.html`
- Edit the `GUILD_INFO` JavaScript object
- Link members by setting their `guildId`

**For Articles:**
- Use templates in `articles/articletemplate.html`
- Edit the `ARTICLE_INFO` JavaScript object
- Articles auto-link to author profiles by IGN

**After editing any HTML file, regenerate data:**
```bash
python generate_data.py
```

---

## 🛠️ Setup & Development

### Prerequisites
- **Web Browser** (Chrome, Firefox, Edge, Safari)
- **Python 3.7+** (for data generation scripts)
- **Text Editor** (VS Code recommended)
- **Git** (for version control)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/redskie/BAMACO-Website.git
   cd BAMACO-Website
   ```

2. **Open in browser**
   - Simply open `index.html` in your browser
   - Or use a local server for better development experience:
   
   **Python:**
   ```bash
   python -m http.server 8000
   ```
   
   **Node.js:**
   ```bash
   npx http-server
   ```
   
   **VS Code:**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Make changes**
   - Edit HTML/CSS/JS files as needed
   - Add/modify player, guild, or article files
   - Update `firebase-config.js` if using your own Firebase project

4. **Regenerate data**
   ```bash
   python generate_data.py
   ```

5. **Test thoroughly**
   - Check all pages load correctly
   - Verify responsive design on mobile
   - Test search and filter functions
   - Ensure Firebase queue system works

### Firebase Setup (Optional)

If you want to use your own Firebase project:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Realtime Database
3. Set database rules to allow read/write:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
4. Copy your config from Firebase Console
5. Update `firebase-config.js` with your credentials

---

## 📝 Content Guidelines

### Player Profiles
- Use real IGNs (In-Game Names) from MaiMai
- Provide accurate friend codes
- Keep bios appropriate and friendly
- Update ratings regularly
- Link articles you've written

### Guild Pages
- Choose unique guild IDs (e.g., 'godarx', 'dragon_warriors')
- Ensure guild filenames match IDs
- Update member lists by setting player `guildId` fields
- Keep guild mottos inspiring

### Articles
- Write helpful, accurate guides
- Credit sources if applicable
- Use clear, friendly language
- Break content into readable sections
- Link to relevant player profiles or other articles

---

## 🔒 Security & Privacy

- **Edit Keys**: Generated client-side, stored in localStorage
- **Device Fingerprinting**: Basic browser fingerprint for update verification
- **Admin Password**: Hardcoded in `queue-admin.html` (change for production!)
- **Firebase Rules**: Currently open - **IMPORTANT**: Restrict in production
- **Personal Data**: Names marked as "REDACTED" for privacy
- **GitHub Actions**: Automated but reviewed by repo maintainers

**Production Recommendations:**
1. Implement proper Firebase authentication
2. Use environment variables for passwords
3. Add rate limiting for queue operations
4. Implement CAPTCHA for profile submissions
5. Regular security audits

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads with correct stats
- [ ] Player cards display IGNs correctly
- [ ] Search/filter functions work
- [ ] Guild pages show correct members
- [ ] Articles link to author profiles
- [ ] Queue system adds/removes players
- [ ] Admin panel requires password
- [ ] Mobile responsive design works
- [ ] All navigation links function
- [ ] Firebase real-time updates work

### Python Scripts
```bash
# Test data generation
python generate_data.py

# Test profile processor (requires issue data)
python scripts/process_profile_request.py
```

---

## 🐛 Known Issues & Fixes

### Issue: Data not updating
**Fix:** Run `python generate_data.py` after editing HTML files

### Issue: Queue not working
**Fix:** Check Firebase credentials in `firebase-config.js`

### Issue: Profile creation fails
**Fix:** Ensure GitHub Actions has write permissions in repo settings

### Issue: Search returns no results
**Fix:** Check that `data.json` is loaded and contains data

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Run `python generate_data.py` to update data
5. Test thoroughly
6. Commit with clear messages (`git commit -m 'Add: New feature'`)
7. Push to your fork (`git push origin feature/YourFeature`)
8. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Credits

**Developer:** TriD (Red)  
**Community:** Bataan MaiMai Community (BAMACO)  
**Contributors:** All BAMACO members who submitted profiles and articles

---

## 📞 Support

For questions or issues:
- Open a GitHub Issue
- Contact through BAMACO community channels
- Check existing documentation in the repo

---

## 🎮 About MaiMai

MaiMai is a popular arcade rhythm game where players tap, hold, and slide on a circular touchscreen to the beat of music. BAMACO is a community of MaiMai players in the Bataan region of the Philippines, united by their love for rhythm games and community building.

---

**Made with ❤️ by the BAMACO Community**

---

## ➕ Adding New Content

**IMPORTANT:** This website uses an **automated data generation system**. 
- Content is managed through HTML files, not by manually editing `data.json`
- Run `python generate_data.py` after adding or modifying any content
- See [DATA_MANAGEMENT.md](DATA_MANAGEMENT.md) for detailed instructions

### Quick Start:

1. **Adding a Player**: Copy `players/playerprofiletemplate.html`, rename it, edit the `PLAYER_INFO` object
2. **Adding a Guild**: Copy `guilds/guildtemplate.html`, rename it, edit the `GUILD_INFO` object
3. **Adding an Article**: Copy `articles/articletemplate.html`, rename it, edit the content
4. **Run**: `python generate_data.py` to update the website
5. **Done!** All data is automatically extracted and organized

### 🤖 Automated Features:

- ✅ **Guild member counts** are auto-calculated based on player profiles
- ✅ **Featured players** automatically show top 3 highest-rated
- ✅ **Latest articles** automatically show 3 most recent
- ✅ **Guild member lists** auto-populate from player `guildId` fields

---

## 🔧 For Advanced Users

If you need to manually edit data, all content is stored in `data.json`. However, this file is **auto-generated** and will be overwritten when you run `generate_data.py`.

### Guild Member Count Automation

Guild member counts are **automatically calculated** and should NOT be manually set:
- Each player profile has a `guildId` field
- The script counts players with matching guild IDs
- The `memberCount` for each guild updates automatically
- Example: If 5 players have `guildId: 'dragon_warriors'`, that guild's count becomes 5

---

## 📝 Content Templates (Legacy Information)

The following templates show the data structure, but you should use the HTML templates instead of editing JSON directly.

### Adding a New Player (Legacy - Use HTML templates instead!)

Add a new object to the `"players"` array in `data.json`:

```json
{
  "id": "unique-player-id",
  "name": "Player Display Name",
  "ign": "In-Game Name",
  "maimaiFriendCode": "0000-0000-0000",
  "nickname": "Preferred Nickname",
  "motto": "Player's personal motto or catchphrase",
  "age": 25,
  "rating": 15000,
  "role": "Player's Main Role/Class",
  "level": 75,
  "rank": "S",
  "joined": "Month Year",
  "bio": "Brief description of the player's playstyle and achievements.",
  "guildId": "guild-id-or-null",
  "achievements": [
    {
      "icon": "🏆",
      "name": "Achievement Name",
      "description": "What this achievement represents"
    },
    {
      "icon": "⚔️",
      "name": "Another Achievement",
      "description": "Achievement description"
    }
  ]
}
```

**Fields Explanation:**

- `id`: Unique identifier (use lowercase, hyphens, no spaces)
- `name`: Player's display name
- `ign`: In-Game Name (can be same as name)
- `maimaiFriendCode`: MaiMai friend code in format "0000-0000-0000"
- `nickname`: Preferred nickname or shortened name
- `motto`: Personal motto, catchphrase, or quote
- `age`: Player's age (number)
- `rating`: MaiMai rating score (number)
- `role`: Main role/class (e.g., "DPS Specialist", "Tank", "Support Main")
- `level`: Player level (number)
- `rank`: Player rank (e.g., "S", "A+", "B")
- `joined`: When they joined (e.g., "Jan 2025")
- `bio`: Short biography (1-2 sentences)
- `guildId`: The guild's ID or `null` if no guild
- `achievements`: Array of achievement objects with icon (emoji), name, and description

**Suggested Achievement Icons:** 🏆 🎯 ⚔️ 🛡️ 💚 ✨ 🗡️ 🔮 ⚡ 🏹 💪 👑 🎖️ 🌟

---

### Adding a New Guild (Legacy - Use HTML templates instead!)

Add a new object to the `"guilds"` array in `data.json`:

```json
{
  "id": "unique-guild-id",
  "name": "Guild Name",
  "motto": "Guild Motto or Tagline",
  "memberCount": 25,  // NOTE: Auto-calculated by generate_data.py - don't set manually!
  "level": 45,
  "established": "Month Year",
  "description": "Detailed description of the guild's focus, playstyle, and values. This can be several sentences long.",
  "achievements": [
    {
      "icon": "🏆",
      "name": "Achievement Name",
      "description": "What the guild accomplished"
    },
    {
      "icon": "👥",
      "name": "Another Achievement",
      "description": "Achievement description"
    }
  ]
}
```

**Fields Explanation:**

- `id`: Unique identifier (use lowercase, hyphens, no spaces)
- `name`: Guild's display name
- `motto`: Short motto or tagline
- `memberCount`: **AUTO-CALCULATED** - Number of players with this guildId
- `level`: Guild level (number)
- `established`: When the guild was founded (e.g., "Dec 2024")
- `description`: Detailed guild description (2-4 sentences)
- `achievements`: Array of guild achievement objects

**Guild Achievement Icon Suggestions:** 🏆 🔥 👥 💎 ✨ 📚 🎓 🌟 ⚔️ 🛡️ 👑

---

### Adding a New Article/Guide

Add a new object to the `"articles"` array in `data.json`:

```json
{
  "id": "unique-article-id",
  "title": "Article Title Goes Here",
  "excerpt": "A short summary of what this article covers. Keep it to 2-3 sentences for the preview card.",
  "category": "Article Category",
  "authorId": "player-id-of-author",
  "date": "Month Day, Year",
  "content": "<h2>Section Heading</h2><p>Article content goes here. You can use HTML tags for formatting.</p><h2>Another Section</h2><p>More content here.</p><ul><li>Bullet point 1</li><li>Bullet point 2</li></ul>"
}
```

**Fields Explanation:**

- `id`: Unique identifier (use lowercase, hyphens, no spaces)
- `title`: Article title
- `excerpt`: Short preview (2-3 sentences max)
- `category`: Article category for filtering (see categories below)
- `authorId`: The player ID of the author (must exist in players array)
- `date`: Publication date (e.g., "Jan 5, 2026")
- `content`: Full article content in HTML format

**Article Categories:**

- `DPS` - Damage dealer guides
- `Support` - Support and healer guides
- `Tank` - Tank and defender guides
- `Stealth` - Stealth and assassination guides
- `Magic` - Mage and spellcaster guides
- `Ranged` - Marksman and archer guides
- `Strategy` - General strategy and team composition guides
- `Beginner` - Beginner-friendly tutorials
- `Advanced` - Advanced techniques and theory

**Content Formatting:**
Use these HTML tags in the `content` field:

- `<h2>Section Title</h2>` - For main sections
- `<h3>Subsection</h3>` - For subsections
- `<p>Paragraph text</p>` - For paragraphs
- `<ul><li>Item</li></ul>` - For bullet lists
- `<ol><li>Item</li></ol>` - For numbered lists
- `<strong>bold text</strong>` - For emphasis

---

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css` (lines 6-20):

```css
:root {
  /* Background Colors */
  --bg-primary: #0a0e14; /* Main background */
  --bg-secondary: #151a23; /* Secondary background */
  --bg-card: #1a202c; /* Card backgrounds */

  /* Text Colors */
  --text-primary: #e2e8f0; /* Main text */
  --text-secondary: #94a3b8; /* Secondary text */

  /* Accent Colors */
  --accent-primary: #8b5cf6; /* Purple accent */
  --accent-secondary: #6366f1; /* Blue-purple accent */
}
```

### Changing Fonts

Edit line 36 in `styles.css`:

```css
font-family: 'Your Font', Tahoma, Geneva, Verdana, sans-serif;
```

### Adjusting Border Radius (Roundness)

Edit the border radius variables in `styles.css` (lines 22-26):

```css
--radius-sm: 8px; /* Small elements */
--radius-md: 12px; /* Medium elements */
--radius-lg: 16px; /* Large cards */
--radius-xl: 20px; /* Extra large */
```

---

## 🔧 Development Tips

### Running a Local Server

While you can open the files directly in a browser, using a local server is recommended for development:

**Using Python:**

```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

**Using Node.js (http-server):**

```bash
npx http-server -p 8000
```

**Using VS Code:**

- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

### Validating Your JSON

After editing `data.json`, make sure it's valid:

- Use an online JSON validator (jsonlint.com)
- Or use VS Code's built-in JSON validation (it will show errors with red underlines)

### Testing

After adding new content:

1. Check the relevant listing page (players/guilds/articles)
2. Click on the card to verify the profile/article page loads correctly
3. Test the search functionality
4. Check that all links work properly

---

## 📝 Content Guidelines

### Writing Player Bios

- Keep it concise (1-2 sentences)
- Highlight their playstyle or main strengths
- Mention any notable achievements

### Writing Guild Descriptions

- Explain the guild's focus and values
- Mention what makes the guild unique
- Include information about skill level or player types (casual/competitive)

### Writing Articles

- Start with an introduction explaining what the guide covers
- Use clear section headings (h2, h3 tags)
- Break content into digestible chunks
- Include practical tips and examples
- Use bullet points for lists of tips
- End with a conclusion or summary

---

## 🐛 Troubleshooting

### Content Not Showing Up

- Verify your `data.json` is valid JSON (no syntax errors)
- Check that IDs are unique and match between linked items
- Make sure `authorId` and `guildId` reference existing entries
- Refresh your browser (Ctrl+F5 for hard refresh)

### Images Not Loading

- The current version uses text initials instead of images
- To add actual images, you'll need to create an `images/` folder and update the JavaScript

### Search Not Working

- Make sure you're using a local server (not file://)
- Check the browser console (F12) for JavaScript errors

---

## 📱 Browser Compatibility

This website works on:

- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

To contribute content to the website:

1. Fork or copy the project
2. Edit `data.json` following the templates above
3. Test your changes locally
4. Share your updated `data.json` with the community

---

## 📄 License

This website template is free to use and modify for your community.

---

## 🎮 About BAMACO

**Bataan MaiMai Community (BAMACO)** is a gaming community dedicated to bringing together players from Bataan and beyond. We focus on teamwork, skill development, and creating a positive gaming environment for all members.

---

## 📞 Support

For questions or issues:

- Check the troubleshooting section above
- Review the data.json file for examples
- Ensure all JSON syntax is correct
- Test in a local development server

---

**Happy Gaming! 🎮**

_Last Updated: January 6, 2026_
