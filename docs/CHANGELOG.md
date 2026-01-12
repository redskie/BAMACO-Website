# Changelog

All notable changes to the BAMACO Website project.

## [2.1.0] - 2026-01-10

### 🚀 Major Feature - MaiMai API Integration ✅ COMPLETE

**Status**: Fully implemented and tested  
**Daily Updates**: 10:00 AM Philippine Time  
**Success Rate**: 6/9 players (67%)

#### Added
- **scripts/maimai_api.py** - API wrapper module for MaiMai DX Player Data API
  - Single player data fetching with retry logic
  - Batch fetching (up to 10 players per request)
  - Session validation and error handling
  - Friend code validation
  - Comprehensive error messages

- **scripts/daily_update.py** - Automated daily profile updater
  - Scans all player profiles for friend codes
  - Fetches fresh data from MaiMai API in batches
  - Updates IGN, rating, trophy, and avatar icon
  - Regenerates data.json automatically
  - Detailed logging and error reporting

- **.github/workflows/daily-update.yml** - GitHub Actions workflow
  - Scheduled daily at 10:00 AM Philippine Time (2:00 AM UTC)
  - Manual trigger capability
  - Auto-commits changes if updates detected
  - Runs daily_update.py automatically

- **test_api_integration.py** - API integration test script
- **test_api_health.py** - API health check and diagnostics
- **API_INTEGRATION_GUIDE.md** - Comprehensive API integration documentation
- **API_STATUS.md** - Current API status and troubleshooting guide

#### Changed
- **create-profile.html** - Enhanced with API integration
  - IGN field now read-only (fetched from API)
  - Added "Fetch Data from API" button
  - Auto-fetch on 15-digit friend code entry
  - Real-time status display during API calls
  - Form validation requires API fetch before submission

- **scripts/process_profile_request.py** - Integrated API fetching
  - Automatically fetches player data from API before profile creation
  - Uses API IGN (overrides any user-provided IGN)
  - Sets rating, trophy, and icon from API data
  - Aborts profile creation if API fetch fails

#### Features
- ✅ **Auto-fetch IGN** - Player's in-game name pulled from official servers
- ✅ **Current Rating** - DX Rating automatically fetched and updated
- ✅ **Daily Auto-Updates** - All profiles updated daily at 10:00 AM
- ✅ **Profile Data Sync** - Trophy, title, and avatar icon from game servers
- ✅ **Batch Processing** - Efficient updates for multiple players
- ✅ **Error Recovery** - Retry logic for API failures
- ✅ **Manual Testing** - Test scripts for validation

#### Technical Details
- API Base URL: https://maimai-data-get.onrender.com
- Retry attempts: 3 with exponential backoff
- Timeout: 60 seconds (handles cold start)
- Batch size: 10 players per request
- Schedule: 10:00 AM Philippine Time (2:00 AM UTC) daily

#### Test Results
- ✅ Successfully updated 6/9 player profiles
- ✅ API integration working correctly
- ⚠️ TriD profile excluded (API account owner)
- ⚠️ 2 players not found on API
- ✅ Daily automation configured and tested

#### Documentation
- Updated README.md with API integration section
- Created comprehensive API_INTEGRATION_GUIDE.md
- Created API_STATUS.md for troubleshooting
- Updated QUICK_REFERENCE.md with API commands

---

## [2.0.0] - 2026-01-10

### 🎉 Major Release - Full Development & Cleanup

#### Added
- **README.md** - Comprehensive project documentation covering all aspects
- **CONTRIBUTING.md** - Detailed contribution guidelines for developers
- **DEPLOYMENT.md** - Complete deployment guide for multiple platforms
- **PROJECT_SUMMARY.md** - Summary of all changes and improvements
- **QUICK_REFERENCE.md** - Quick command reference for common tasks
- **.gitignore** - Proper git ignore rules for Python, IDEs, and temp files

#### Fixed
- **Bug #1**: Escaped quotes in data.json causing motto truncation
  - Updated `generate_data.py` regex pattern to handle escaped quotes
  - Player mottos now display correctly with apostrophes and special characters
  - Example: "Don't hate the player" now renders properly

#### Removed
- **ENHANCEMENT_COMPLETE.md** - Redundant documentation (merged into README)
- **TEST_RESULTS.md** - Outdated test logs (no longer needed)
- **UI_REDESIGN_NOTES.md** - Design notes (merged into README)
- **DATA_MANAGEMENT.md** - Data docs (merged into README)
- **GUILD_MEMBER_AUTOMATION.md** - Automation notes (merged into README)
- **PROFILE_SYSTEM_GUIDE.md** - Profile guide (merged into README)
- **test_profile_system.py** - Development test file (incomplete)
- **test_queue_firebase.js** - Firebase tests (incomplete)
- **test_queue_firebase.py** - Firebase tests (incomplete)
- **test_queue_system.html** - Browser tests (incomplete)
- **What to Put.txt** - Temporary notes file
- **scripts/__pycache__/** - Python cache directory

#### Changed
- **README.md** - Complete rewrite with comprehensive documentation
- **generate_data.py** - Fixed regex pattern for escaped quotes handling

#### Improved
- Project structure now clean and professional
- Documentation consolidated and organized
- Clear guidelines for contributors
- Production-ready deployment instructions
- Better security documentation

#### Validated
- ✅ All Python scripts tested and working
- ✅ Firebase integration verified
- ✅ HTML/CSS validated
- ✅ Data synchronization confirmed
- ✅ Local server tested successfully

---

## [1.0.0] - 2026-01-06

### Initial Release

#### Features
- Player profile system with automated GitHub Issues integration
- Guild management system
- Community articles and guides
- Real-time queue system with Firebase
- Admin panel for queue management
- Queue history tracking
- Profile creation and editing forms
- Responsive, mobile-first design
- Dark modern theme with purple accents
- Search and filter functionality

#### Components
- Static website (HTML/CSS/JS)
- Python automation scripts
- GitHub Actions workflows
- Firebase Realtime Database integration
- Data generation system

---

## Version History

- **2.0.0** (2026-01-10) - Full development & cleanup
- **1.0.0** (2026-01-06) - Initial release

---

## Upgrade Notes

### From 1.0.0 to 2.0.0

**Breaking Changes:** None

**Action Required:**
1. Read new documentation in README.md
2. Follow security guidelines in DEPLOYMENT.md before production
3. Update admin password in queue-admin.html
4. Review Firebase security rules

**Optional:**
- Review CONTRIBUTING.md if planning to contribute
- Use QUICK_REFERENCE.md for common tasks

---

## Future Plans

### Planned Features
- Proper testing framework
- Firebase Authentication integration
- Enhanced admin dashboard
- Player statistics tracking
- Achievement system expansion
- PWA (Progressive Web App) support
- Multi-language support

### Under Consideration
- Mobile app (React Native or Flutter)
- Discord bot integration
- Live tournament brackets
- Player matchmaking system
- Leaderboards with filters

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to this project.

## Support

- **Issues:** [GitHub Issues](https://github.com/redskie/BAMACO-Website/issues)
- **Pull Requests:** [GitHub PRs](https://github.com/redskie/BAMACO-Website/pulls)
- **Community:** BAMACO Discord/Telegram

---

**Project maintained by:** BAMACO Community  
**Primary Developer:** TriD (Red)  
**License:** MIT
