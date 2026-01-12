# maimai Rating Calculator - Integration

## Overview

This folder contains the maimai rating calculator API documentation and demo. The calculator has been fully integrated into the BAMACO website.

## Integration Status ✅

### What's Integrated:

1. **Calculator Page**: `calculator.html` in the root directory
   - Fully styled to match BAMACO's dark minimalist theme
   - Mobile-responsive design
   - Connected to the API: `https://bamaco-calc-api.onrender.com`

2. **Navigation**: Calculator link added to the main navbar
   - Accessible from all pages
   - Active state detection implemented

3. **Homepage Link**: Featured calculator card on the homepage
   - Prominent placement in the bento grid layout
   - Direct link to the calculator page

## Files in This Folder

### Documentation (For Reference)
- `API_DOCUMENTATION.md` - Complete API integration guide
- `API_QUICK_REFERENCE.md` - Quick endpoint reference
- `API_INTEGRATION_ARCHITECTURE.md` - System architecture diagrams
- `CHEAT_SHEET.md` - Quick start guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `FILE_DISTRIBUTION.md` - File organization guide

### Demo & Tools
- `api_demo.html` - Original demo (kept for reference)
- `create-client-package.ps1` - PowerShell script for packaging

### Analysis
- `analysis.md` - Project analysis notes

## Calculator Features

The integrated calculator provides:

1. **Rating Calculator**: Calculate rating based on chart level and achievement %
2. **Rating Range Lookup**: Get min/max rating for a specific rank on a chart
3. **Chart Recommendations**: Get recommended charts to reach a target rating

## API Connection

- **Production URL**: `https://bamaco-calc-api.onrender.com`
- **Status**: Connected via CORS-enabled endpoints
- **Response Format**: JSON

## Theme Integration

The calculator has been styled to match BAMACO's theme:
- Dark monochromatic color scheme (blacks, greys, whites)
- Consistent spacing and typography
- Smooth transitions and hover effects
- Mobile-first responsive design
- Rank badges with maimai-style color gradients

## Usage

Users can access the calculator by:
1. Clicking "Calculator" in the main navigation
2. Clicking the calculator card on the homepage
3. Directly navigating to `calculator.html`

## Notes

- The API may take a moment to wake up on first request (Render free tier)
- All API calls include proper error handling
- The calculator is fully functional without requiring any additional setup
