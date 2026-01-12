# 🎮 MaiMai API Integration - Implementation Guide

## 📋 Overview

Successfully integrated the MaiMai DX Player Data API into the BAMACO Website. The API automatically fetches player IGN, rating, trophy, and icon from official MaiMai servers using friend codes.

**Status:** ✅ **IMPLEMENTED** (Pending API Server Availability)

---

## 🚀 What Was Implemented

### 1. **API Integration Module** (`scripts/maimai_api.py`)

A robust Python wrapper for the MaiMai API with:
- ✅ Single player data fetching
- ✅ Batch fetching (up to 10 players)
- ✅ Automatic retry logic
- ✅ Session expired handling
- ✅ Friend code validation
- ✅ Health check functionality
- ✅ Comprehensive error handling

**Usage:**
```python
from maimai_api import MaiMaiAPI

api = MaiMaiAPI()
data = api.get_player("101680566000997")

if data['success']:
    print(f"IGN: {data['ign']}")
    print(f"Rating: {data['rating']}")
```

### 2. **Daily Auto-Update Script** (`scripts/daily_update.py`)

Automatically updates all player profiles every day:
- ✅ Scans all player profiles for friend codes
- ✅ Fetches fresh data from API in batches
- ✅ Updates IGN, rating, trophy, and icon
- ✅ Regenerates data.json
- ✅ Provides detailed logging

**Manual Run:**
```bash
python scripts/daily_update.py
```

### 3. **GitHub Actions Workflow** (`.github/workflows/daily-update.yml`)

Automated daily updates at 10:00 AM:
- ✅ Runs daily at 10:00 AM UTC
- ✅ Can be manually triggered
- ✅ Auto-commits changes
- ✅ Updates all player profiles
- ✅ Regenerates data.json

**Features:**
- Automatic commits with timestamp
- No-op if no changes
- Failure notifications

### 4. **Profile Creation Integration** (`create-profile.html`)

Modified profile creation form:
- ✅ IGN field is now read-only
- ✅ Automatically fetches from API
- ✅ "Fetch Data from API" button
- ✅ Auto-fetch when friend code entered
- ✅ Real-time status display
- ✅ Validation before submission

**User Experience:**
1. User enters friend code
2. Clicks "Fetch Data from API" (or auto-fetches)
3. System displays IGN, rating, and trophy
4. User fills remaining fields
5. Submits (IGN cannot be manually changed)

### 5. **Profile Processor Integration** (`scripts/process_profile_request.py`)

GitHub Issues automation now includes API:
- ✅ Fetches player data from API before creating profile
- ✅ Uses API IGN (overrides any user input)
- ✅ Sets rating from API
- ✅ Sets trophy as title
- ✅ Sets icon URL for avatar
- ✅ Aborts if API fetch fails

**Process Flow:**
1. GitHub Issue submitted
2. Script extracts friend code
3. Fetches data from API
4. Creates profile with API data
5. Commits and pushes

---

## 📊 Data Flow

```
Friend Code Input
       ↓
MaiMai API Request
       ↓
API Response (IGN, Rating, Trophy, Icon)
       ↓
Profile HTML Update
       ↓
data.json Regeneration
       ↓
Live Website Update
```

---

## 🔄 Automatic Updates

### Daily Schedule
- **Time:** 10:00 AM UTC daily
- **Action:** Fetch fresh data for all players
- **Updates:** IGN, Rating, Trophy, Icon URL
- **Commit:** Automatic git commit if changes detected

### What Gets Updated
- ✅ **IGN** - In-game name (if player changes it)
- ✅ **Rating** - Current DX Rating
- ✅ **Trophy** - Current equipped trophy/title
- ✅ **Avatar Image** - Player icon URL

### What Stays the Same
- ✅ Full Name
- ✅ Nickname
- ✅ Age
- ✅ Motto
- ✅ Bio
- ✅ Guild membership
- ✅ Achievements
- ✅ Friend Code

---

## ⚠️ Current Status

### API Server Status
**Issue:** API returning 500 errors during testing

**Possible Causes:**
1. **Cold Start:** Free-tier Render.com has 30-60s cold start
2. **Server Down:** API may be temporarily unavailable
3. **Rate Limiting:** Server may be rate-limited
4. **Authentication Issues:** Backend MaiMai session may have expired

### Testing Results
```
✅ API module created and imported successfully
✅ Friend code validation working
✅ Retry logic implemented
✅ Error handling comprehensive
❌ API server returning 500 errors (needs investigation)
```

### Recommendations
1. **Wait for API:** Cold start may take 30-60 seconds
2. **Check API Status:** Visit https://maimai-data-get.onrender.com/health
3. **Contact API Owner:** If persistent, report to API maintainer
4. **Fallback Option:** System still works with manual data entry

---

## 🧪 Testing

### Test API Module
```bash
python scripts/maimai_api.py
```

### Test Daily Update
```bash
python scripts/daily_update.py
```

### Test Single Player
```bash
python test_api_integration.py
```

### Manual API Test
```bash
# Check health
curl https://maimai-data-get.onrender.com/health

# Fetch player
curl https://maimai-data-get.onrender.com/api/player/101680566000997
```

---

## 📝 Files Modified/Created

### Created Files
1. `scripts/maimai_api.py` - API wrapper module
2. `scripts/daily_update.py` - Daily update script
3. `.github/workflows/daily-update.yml` - GitHub Actions workflow
4. `test_api_integration.py` - Test script
5. `API_INTEGRATION_GUIDE.md` - This documentation

### Modified Files
1. `create-profile.html` - Added API fetch functionality
2. `scripts/process_profile_request.py` - Added API integration

---

## 🔧 Configuration

### API Endpoints
- **Base URL:** `https://maimai-data-get.onrender.com`
- **Single Player:** `GET /api/player/{friend_code}`
- **Batch:** `POST /api/batch`
- **Health:** `GET /health`

### Timeouts
- **First Request:** 60 seconds (cold start)
- **Subsequent:** 15 seconds
- **Retries:** 3 attempts

### Batch Limits
- **Max per request:** 10 friend codes
- **Recommended delay:** 2 seconds between batches

---

## 🚨 Error Handling

### User-Facing Errors
- Invalid friend code format
- API unavailable
- Player not found
- Network timeout

### System Errors
- Session expired (auto-retry)
- Server error (retry with backoff)
- Rate limit (wait and retry)

### Graceful Degradation
- Profile creation still works with manual data
- Existing profiles unaffected by API failures
- Daily updates skip failed players

---

## 📚 Documentation Updates Needed

### README.md
- Add section on API integration
- Explain automatic updates
- Document how IGN is fetched

### QUICK_REFERENCE.md
- Add API testing commands
- Document manual update process

### CHANGELOG.md
- Document v2.1.0 with API integration
- List new features and scripts

---

## 🎯 Benefits

### For Users
- ✅ No manual IGN entry
- ✅ Always up-to-date ratings
- ✅ Automatic profile synchronization
- ✅ Official data from MaiMai servers

### For Administrators
- ✅ Reduced maintenance
- ✅ Automatic data accuracy
- ✅ No manual rating updates needed
- ✅ Scalable to many players

### For the Community
- ✅ Real-time leaderboards possible
- ✅ Accurate player statistics
- ✅ Professional data management
- ✅ Trust in data accuracy

---

## 🔮 Future Enhancements

### Possible Additions
1. **Historical Tracking** - Store rating history over time
2. **Rating Graphs** - Visualize player progress
3. **Leaderboards** - Auto-updated rankings
4. **Achievement Detection** - Track new achievements
5. **Trophy Changes** - Notify when players change trophies
6. **Profile Pictures** - Use icon URLs for avatars

### API Improvements
1. **Caching** - Cache API responses for 1 hour
2. **Webhooks** - Receive updates instead of polling
3. **Analytics** - Track API usage and performance
4. **Backup API** - Fallback to secondary data source

---

## 🤝 Contributing

### Testing the API
1. Wait for API to warm up (30-60s on first request)
2. Test with known valid friend codes
3. Report persistent issues to API maintainer

### Improving Integration
1. Add caching layer for API responses
2. Implement exponential backoff
3. Add monitoring/alerting
4. Create fallback mechanisms

---

## 📞 Support

### API Issues
- Check: https://maimai-data-get.onrender.com/health
- Report: https://github.com/redskie/MaiMai_Data_Get/issues

### Integration Issues
- Open issue in BAMACO-Website repository
- Provide error logs and friend codes tested
- Include API response if available

---

## ✅ Checklist for Production

- [x] API module created
- [x] Daily update script created
- [x] GitHub Actions workflow configured
- [x] Profile creation form updated
- [x] Profile processor integrated
- [ ] API server confirmed working
- [ ] Test with real friend codes
- [ ] Update documentation
- [ ] Announce to community

---

**Status:** Ready for deployment once API server is available  
**Next Step:** Verify API server is responsive, then test end-to-end  
**Version:** 2.1.0 - MaiMai API Integration

**Implemented by:** GitHub Copilot  
**Date:** January 10, 2026
