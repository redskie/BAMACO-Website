# BAMACO Website - Deployment Guide

Complete guide for deploying the BAMACO Website to production environments.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Other Hosting Options](#other-hosting-options)
- [Production Checklist](#production-checklist)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Git installed
- GitHub account
- Firebase project (for queue system)
- Text editor

### Recommended Deployment: GitHub Pages
Free, fast, and integrated with your repository.

---

## 🌐 GitHub Pages Deployment

### Step 1: Prepare Repository

1. **Ensure all files are committed**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify data.json is up-to-date**
   ```bash
   python generate_data.py
   git add data.json
   git commit -m "Update data.json"
   git push origin main
   ```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**

### Step 3: Wait for Deployment

- GitHub will build and deploy automatically (2-5 minutes)
- Check **Actions** tab to see deployment progress
- Site will be available at: `https://YOUR_USERNAME.github.io/BAMACO-Website/`

### Step 4: Verify Deployment

Visit your site and check:
- [ ] Homepage loads correctly
- [ ] Player profiles display
- [ ] Guild pages work
- [ ] Articles load
- [ ] Queue system connects to Firebase
- [ ] Search functions work
- [ ] Mobile responsive

---

## 🔧 Other Hosting Options

### Option 1: Netlify

**Pros:** Easy setup, automatic deployments, custom domains, SSL

1. **Sign up at** [netlify.com](https://www.netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
5. Click **Deploy site**

**Custom Domain:**
- Go to **Domain settings**
- Click **Add custom domain**
- Follow DNS configuration instructions

### Option 2: Vercel

**Pros:** Excellent performance, automatic deployments, free SSL

1. **Sign up at** [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. Click **Deploy**

### Option 3: Firebase Hosting

**Pros:** Integrated with Firebase backend, fast CDN

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting in project directory
cd BAMACO-Website
firebase init hosting

# Configure:
# - Public directory: .
# - Single-page app: No
# - Overwrites: No

# Deploy
firebase deploy --only hosting
```

### Option 4: Custom Server

**Requirements:** Server with web server software (Apache, Nginx)

1. **Upload files via FTP/SFTP**
2. **Configure web server** to serve static files
3. **Ensure proper MIME types** for .html, .css, .js, .json
4. **Set up SSL certificate** (Let's Encrypt recommended)

---

## ✅ Production Checklist

### Before Deployment

- [ ] All HTML files validated
- [ ] CSS works across browsers
- [ ] JavaScript has no console errors
- [ ] data.json regenerated with latest content
- [ ] Firebase credentials configured
- [ ] All images optimized
- [ ] No broken links
- [ ] Mobile responsive design tested
- [ ] SEO meta tags added (if needed)
- [ ] favicon.ico added (if needed)

### Security Checklist

- [ ] **Change admin password** in `queue-admin.html`
- [ ] **Update Firebase security rules**
- [ ] Remove any test/debug code
- [ ] Validate all user inputs
- [ ] Check for XSS vulnerabilities
- [ ] Review API key exposure

### Firebase Security Rules (Production)

Replace open rules with:

```json
{
  "rules": {
    "queue": {
      ".read": true,
      ".write": "auth != null || 
                (root.child('publicWrite').val() === true && 
                 newData.child('timestamp').val() > now - 60000)"
    },
    "currentlyPlaying": {
      ".read": true,
      ".write": "auth != null"
    },
    "gameHistory": {
      ".read": true,
      ".write": "auth != null"
    },
    "playerCredits": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### Performance Optimization

- [ ] Minify CSS/JS (optional)
- [ ] Compress images
- [ ] Enable gzip compression
- [ ] Set proper cache headers
- [ ] Use CDN for Firebase libraries

---

## 📦 Deployment Process

### Manual Deployment

```bash
# 1. Update all content
python generate_data.py

# 2. Stage all changes
git add .

# 3. Commit with descriptive message
git commit -m "Deploy: Update player profiles and articles"

# 4. Push to production branch
git push origin main

# 5. Wait for automatic deployment (GitHub Pages/Netlify/Vercel)
```

### Automated Deployment

Already configured via GitHub Actions:
- Profile requests auto-deploy
- Push to `main` triggers deployment

---

## 🔄 Post-Deployment

### Verify Everything Works

1. **Homepage**
   - Stats display correctly
   - Featured players show
   - Latest articles load

2. **Player Pages**
   - All profiles accessible
   - Search works
   - IGNs display correctly

3. **Guild Pages**
   - Guild info loads
   - Members list correct

4. **Articles**
   - All articles readable
   - Author links work

5. **Queue System**
   - Can add to queue
   - Admin panel accessible (with password)
   - Real-time updates work
   - History displays

### Monitor Performance

Use browser DevTools:
- Check Console for errors
- Monitor Network tab for load times
- Test on different devices
- Verify mobile responsiveness

### Analytics (Optional)

Add Google Analytics or similar:

```html
<!-- Add to <head> in all HTML files -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_TRACKING_ID');
</script>
```

---

## 🐛 Troubleshooting

### Issue: Site not loading

**Check:**
- GitHub Pages enabled in settings
- Correct branch selected
- Build succeeded in Actions tab
- Wait 5-10 minutes after enabling

**Solution:**
```bash
git push --force origin main
```

### Issue: Data not updating

**Check:**
- data.json committed and pushed
- Browser cache (hard refresh: Ctrl+Shift+R)
- CDN cache (may take time to update)

**Solution:**
```bash
python generate_data.py
git add data.json
git commit -m "Update data"
git push origin main
```

### Issue: Queue not working

**Check:**
- Firebase credentials correct
- Database rules allow read/write
- Network tab shows Firebase connection
- No console errors

**Solution:**
- Verify `firebase-config.js`
- Check Firebase console for errors
- Test with Firebase emulator locally

### Issue: Images not loading

**Check:**
- Image paths are relative
- Images committed to repository
- File names match references (case-sensitive)

**Solution:**
```bash
git add images/
git commit -m "Add missing images"
git push origin main
```

### Issue: CSS not applying

**Check:**
- CSS files in correct location
- Links in HTML are correct
- No CSS syntax errors

**Solution:**
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for 404 errors
- Validate CSS syntax

### Issue: Mobile not responsive

**Check:**
- Viewport meta tag present
- CSS media queries correct
- Touch targets 44px minimum

**Solution:**
- Test with browser DevTools mobile emulation
- Add/fix media queries in CSS

---

## 🔐 Security Best Practices

### 1. Change Default Passwords

```javascript
// In queue-admin.html, change:
const ADMIN_PASSWORD = 'Nachi';  // ❌ Default

// To something secure:
const ADMIN_PASSWORD = 'YourSecurePassword123!@#';  // ✅ Unique
```

### 2. Implement Firebase Authentication

Replace password check with Firebase Auth:

```javascript
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // User signed in
  })
  .catch((error) => {
    console.error(error);
  });
```

### 3. Rate Limiting

Add rate limiting to prevent spam:

```javascript
// Track requests
const requestLog = [];

function checkRateLimit(action) {
  const now = Date.now();
  const recentRequests = requestLog.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    alert('Too many requests. Please wait.');
    return false;
  }
  
  requestLog.push(now);
  return true;
}
```

### 4. Input Validation

Always validate user input:

```javascript
function validateInput(text, maxLength = 100) {
  if (!text || text.trim().length === 0) return false;
  if (text.length > maxLength) return false;
  // Check for suspicious patterns
  if (/<script|javascript:/i.test(text)) return false;
  return true;
}
```

---

## 📊 Maintenance

### Regular Tasks

**Weekly:**
- Review GitHub Issues for profile requests
- Update player ratings if changed
- Check for broken links
- Monitor Firebase usage

**Monthly:**
- Review and update articles
- Archive old queue history
- Check performance metrics
- Update dependencies (if any)

**As Needed:**
- Add new players/guilds
- Publish new articles
- Update Firebase security rules
- Respond to bug reports

### Content Updates

```bash
# Add new player profile
1. Create HTML in players/ directory
2. Run: python generate_data.py
3. Commit and push

# Add new article
1. Create HTML in articles/ directory
2. Run: python generate_data.py
3. Commit and push

# Update existing content
1. Edit HTML file
2. Run: python generate_data.py
3. Commit and push
```

---

## 🎉 Success!

Your BAMACO Website is now live! 

**Share your site:**
- Announce in BAMACO community
- Share on social media
- Add to MaiMai community lists

**Need help?**
- Open GitHub Issue
- Check documentation
- Contact maintainers

---

**Happy Deploying! 🚀**
