# BAMACO Website

## Bataan MaiMai Community Gaming Website

A modern, dark-themed minimalist website for the Bataan MaiMai Community (BAMACO) gaming community. This website features player profiles, guild information, and community-written tips and guides.

---

## 🚀 Features

- **Dark Modern Theme** - Easy on the eyes with a sleek purple accent color scheme
- **Player Profiles** - Showcase community members with their stats, achievements, and published guides
- **Guild Pages** - Display guild information, members, and collective achievements
- **Tips & Guides** - Community-written articles linked to author profiles
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Card-Based UI** - Clean, organized content with rounded edges
- **Search Functionality** - Quickly find players, guilds, or articles

---

## 📁 File Structure

```
BMC-Website-3/
├── index.html              # Homepage with stats and featured content
├── players.html            # All players listing page
├── player-profile.html     # Individual player profile template
├── guilds.html             # All guilds listing page
├── guild-profile.html      # Individual guild profile template
├── articles.html           # All articles/guides listing page
├── article.html            # Individual article template
├── styles.css              # Main stylesheet with dark theme
├── script.js               # JavaScript for dynamic content
├── data.json               # Data storage for all content
└── README.md               # This file
```

---

## 🎮 How to Use

1. **Open the Website**

   - Simply open `index.html` in a web browser
   - No server setup required (though a local server is recommended for development)

2. **Navigate**
   - Use the navigation bar to browse players, guilds, and articles
   - Click on cards to view detailed profiles or articles
   - Use search bars to filter content

---

## ➕ Adding New Content

All content is stored in `data.json`. Follow these templates to add new players, guilds, or articles.

### Adding a New Player

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

### Adding a New Guild

Add a new object to the `"guilds"` array in `data.json`:

```json
{
  "id": "unique-guild-id",
  "name": "Guild Name",
  "motto": "Guild Motto or Tagline",
  "memberCount": 25,
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
- `memberCount`: Number of guild members
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
