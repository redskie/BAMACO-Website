# BAMACO Website - Data Management

## 🎯 Smart Data System

The website now uses an **automated data generation system** that reads content directly from your HTML files instead of requiring manual JSON editing.

## 🚀 How It Works

### Automatic Features:

- ✅ **Scans all HTML files** in `players/`, `guilds/`, and `articles/` folders
- ✅ **Extracts data** from PLAYER_INFO objects and HTML content
- ✅ **Auto-sorts players** by rating (highest first)
- ✅ **Auto-sorts articles** by date (newest first)
- ✅ **Featured Players**: Automatically shows top 3 highest-rated players
- ✅ **Latest Articles**: Automatically shows 3 most recent articles

## 📝 Usage

### When to Run the Script:

Run the generator **whenever you**:

- Add a new player profile
- Add a new article
- Add a new guild
- Update any existing content

### Running the Generator:

```bash
python generate_data.py
```

The script will:

1. 🔍 Scan all player HTML files
2. 🔍 Scan all guild HTML files
3. 🔍 Scan all article HTML files
4. 📊 Sort by rating (players) and date (articles)
5. ✨ Generate updated `data.json`

### Output Example:

```
🔍 Scanning for player profiles...
  📄 Processing trid.html
✅ Found 1 players

🔍 Scanning for guild profiles...
  📄 Processing dragon-warriors.html
  📄 Processing mystic-legends.html
  📄 Processing phoenix-rising.html
✅ Found 3 guilds

🔍 Scanning for articles...
  📄 Processing articletemplate.html
✅ Found 1 articles

✨ Successfully generated data.json
📊 Stats:
   - 1 players
   - Top 3 rated players (for featured): TriD
   - 3 guilds
   - 1 articles
```

## 📁 File Structure

```
BMC-Website-3/
├── generate_data.py          ← Run this to update data.json
├── data.json                 ← Auto-generated (don't edit manually!)
├── players/
│   ├── playerprofiletemplate.html  ← Template (not scanned)
│   ├── trid.html             ← Actual profiles (scanned)
│   └── ...
├── guilds/
│   ├── dragon-warriors.html  ← All guild files (scanned)
│   └── ...
└── articles/
    ├── articletemplate.html  ← Template for new articles
    └── ...                   ← All articles (scanned)
```

## 🎮 Creating New Content

### Adding a New Player:

1. Copy `players/playerprofiletemplate.html`
2. Rename to `players/your-player-name.html`
3. Edit the `PLAYER_INFO` object at the top
4. Run `python generate_data.py`
5. ✨ Done! Featured players auto-update if rating is in top 3

### Adding a New Article:

1. Copy `articles/articletemplate.html`
2. Rename to `articles/your-article-title.html`
3. Edit the article content
4. Update the date to today
5. Run `python generate_data.py`
6. ✨ Done! Latest articles auto-update to show 3 newest

### Adding a New Guild:

1. Copy an existing guild HTML
2. Rename and edit content
3. Run `python generate_data.py`
4. ✨ Done!

## 🔧 How the System Works

### Player Data Extraction:

The script reads the `PLAYER_INFO` JavaScript object:

```javascript
const PLAYER_INFO = {
  name: 'Redgelson Sablang',
  ign: 'TriD',
  rating: 13575,
  // ... etc
};
```

### Featured Selection:

- **Top Players**: Automatically picks 3 highest-rated players
- **Latest Articles**: Automatically picks 3 most recent articles (by date)

### Website Integration:

`script.js` uses `.slice(0, 3)` to show:

- First 3 players (which are now sorted by rating)
- First 3 articles (which are now sorted by date)

## 💡 Benefits

### Before (Manual):

- ❌ Edit data.json manually
- ❌ Keep track of featured players manually
- ❌ Update article dates manually
- ❌ Prone to typos and errors

### Now (Automated):

- ✅ Run one command: `python generate_data.py`
- ✅ Featured players auto-sorted by rating
- ✅ Articles auto-sorted by date
- ✅ Data extracted directly from HTML files
- ✅ No manual JSON editing needed

## 🛠️ Automation Tips

### Optional: Auto-run on file save

You can set up a file watcher to automatically run the script when HTML files change. Add this to your workflow for even more automation!

### Content Editor Integration

The `content_editor.py` tool still works! After saving a profile through the editor:

1. The HTML file is created/updated
2. Run `python generate_data.py`
3. Your changes appear on the website

## 📊 Sorting Logic

**Players**: Sorted by `rating` field (descending)

- Highest rating = Featured first
- Example: Rating 15200 > 14800 > 13575

**Articles**: Sorted by `date` field (newest first)

- Most recent date = Latest first
- Example: "Dec 20, 2024" > "Dec 15, 2024" > "Dec 10, 2024"

---

**Remember**: After adding or updating any content, always run:

```bash
python generate_data.py
```

This ensures your website displays the latest data with correct featured/latest items! 🚀
