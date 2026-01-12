# BAMACO Tailwind CSS Setup Guide

## 📋 What Changed

Your website now uses **Tailwind CSS** for all styling, with a centralized design system that makes it easy to customize colors, spacing, animations, and more from a single location.

## 🎨 Centralized Design Files

### 1. **tailwind.config.js** (Main Configuration)
**Location**: Root directory  
**Purpose**: Contains ALL design tokens and customizations

Edit this file to change:
- **Colors**: All background, text, accent, and functional colors
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)
- **Typography**: Font sizes, weights, and families
- **Animations**: Keyframes, durations, and timing functions
- **Border Radius**: Rounded corners for all elements
- **Shadows**: Box shadows and elevation
- **Breakpoints**: Responsive design breakpoints

### 2. **design-system.js** (Component Library)
**Location**: Root directory  
**Purpose**: Documentation and reusable component classes

Contains pre-built component patterns for:
- Buttons (primary, secondary, small, icon)
- Cards (base, enhanced, stat, glass)
- Inputs & Forms
- Navigation elements
- Typography styles
- Layout patterns
- Special effects
- State indicators
- Rank badges

### 3. **styles-tailwind.css** (Custom Extensions)
**Location**: Root directory  
**Purpose**: Extends Tailwind with custom CSS

Contains:
- Base styles (body, html defaults)
- Component classes (`.btn`, `.card`, `.nav-link`)
- Utility classes (`.text-gradient`, `.glass`, `.no-scrollbar`)
- Responsive adjustments
- Rank badge gradients

## 🚀 Quick Start

### Option 1: Use Tailwind CDN (Easiest - Already Set Up)

The HTML files now include Tailwind via CDN:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="tailwind.config.js"></script>
<link rel="stylesheet" href="styles-tailwind.css">
```

✅ **No installation needed!** Just open the HTML files in a browser.

### Option 2: Use Tailwind CLI (Recommended for Production)

If you want to compile Tailwind for production (smaller file size):

1. **Install Node.js** (if not installed): https://nodejs.org/

2. **Install Tailwind CSS**:
```bash
npm install -D tailwindcss
```

3. **Build Tailwind**:
```bash
npx tailwindcss -i ./styles-tailwind.css -o ./output.css --watch
```

4. **Update HTML files** to use `output.css` instead of CDN

## 📝 How to Customize

### Change Colors

**File**: `tailwind.config.js`  
**Section**: `theme.extend.colors`

```javascript
colors: {
  'bg-primary': '#0a0a0a',    // Change main background
  'text-primary': '#f5f5f5',  // Change main text color
  'accent-primary': '#ffffff', // Change accent color
  // ... more colors
}
```

### Change Spacing

**File**: `tailwind.config.js`  
**Section**: `theme.extend.spacing`

```javascript
spacing: {
  'sm': '1rem',  // Change small spacing
  'md': '1.5rem', // Change medium spacing
  // ... more spacing
}
```

### Change Animations

**File**: `tailwind.config.js`  
**Section**: `theme.extend.animation` and `theme.extend.keyframes`

```javascript
animation: {
  'fadeIn': 'fadeIn 0.6s ease-out', // Adjust timing
}
```

### Add New Components

**File**: `design-system.js`

Add new component patterns:

```javascript
myNewComponent: {
  base: `
    px-4 py-2
    bg-bg-card
    rounded-md
    // ... your Tailwind classes
  `,
}
```

### Add Custom CSS

**File**: `styles-tailwind.css`  
**Section**: `@layer components` or `@layer utilities`

```css
@layer components {
  .my-custom-class {
    @apply bg-bg-card p-md rounded-lg;
    /* custom CSS */
  }
}
```

## 🎯 Using the Design System

### Method 1: Direct Tailwind Classes (Recommended)

```html
<button class="px-6 py-3 bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary font-semibold rounded-md transition-all duration-normal hover:-translate-y-1">
  Click Me
</button>
```

### Method 2: Component Classes

```html
<button class="btn btn-primary">
  Click Me
</button>
```

### Method 3: Design System Reference

```javascript
// Import design system
import { BAMACO_DESIGN_SYSTEM } from './design-system.js';

// Use component classes
const buttonClasses = BAMACO_DESIGN_SYSTEM.buttons.primary;
```

## 📱 Responsive Design

Tailwind uses mobile-first responsive prefixes:

```html
<!-- Mobile: full width, Desktop: half width -->
<div class="w-full md:w-1/2">

<!-- Small text on mobile, larger on desktop -->
<h1 class="text-2xl md:text-4xl lg:text-6xl">

<!-- Hidden on mobile, visible on desktop -->
<div class="hidden md:block">
```

**Breakpoints**:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

## 🎨 Quick Reference

### Colors
- `bg-bg-primary` - Main background
- `bg-bg-card` - Card background
- `text-text-primary` - Main text
- `text-text-secondary` - Secondary text
- `border-border-primary` - Border color

### Spacing
- `p-sm` / `m-sm` - Small padding/margin
- `p-md` / `m-md` - Medium padding/margin
- `p-lg` / `m-lg` - Large padding/margin

### Common Utilities
- `rounded-sm/md/lg` - Border radius
- `shadow-card` - Card shadow
- `hover:-translate-y-1` - Lift on hover
- `transition-all duration-normal` - Smooth transition
- `text-gradient` - Gradient text effect

## 📚 Learn More

- **Tailwind Documentation**: https://tailwindcss.com/docs
- **Tailwind Cheat Sheet**: https://nerdcave.com/tailwind-cheat-sheet

## 🔄 Migrated Files

The following files have been converted to use Tailwind:

- ✅ `navbar.js` - Navigation component
- ✅ `index.html` - Homepage (in progress)

## 💡 Tips

1. **Use the design system variables** from `tailwind.config.js` instead of hardcoding values
2. **Reference `design-system.js`** for pre-built component patterns
3. **Test responsive design** by resizing your browser
4. **Use browser DevTools** to inspect and modify Tailwind classes
5. **Keep `tailwind.config.js` as your single source of truth** for all design decisions

## 🆘 Troubleshooting

**Problem**: Styles not applying  
**Solution**: Make sure Tailwind CDN script is loaded before any custom scripts

**Problem**: Custom colors not working  
**Solution**: Check that color names in `tailwind.config.js` match usage in HTML

**Problem**: Responsive breakpoints not working  
**Solution**: Clear browser cache and check mobile viewport meta tag

---

**Need help?** Check `design-system.js` for component examples and patterns!
