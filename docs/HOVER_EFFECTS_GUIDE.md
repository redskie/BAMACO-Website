# BAMACO Unified Hover Effects Guide

## Overview
All hover effects across the BAMACO website are now centralized in `tailwind-config.js`. This ensures consistent user experience and makes future updates easier.

## Unified Hover Classes

### 1. **hover-card**
Used for: Content cards (player cards, guild cards, article cards, stats boxes)
```html
<div class="bg-bg-card border border-border-primary rounded-xl p-6 hover-card">
```
Effect:
- Lifts card up by 0.5rem
- Border changes to light lavender (#e0d4f7)
- Pink shadow appears (rgba(255, 107, 157, 0.2))

---

### 2. **hover-btn-primary**
Used for: Primary action buttons (Create Profile, Join Queue, Login, Add, etc.)
```html
<button class="bg-text-primary text-bg-primary font-bold rounded-lg hover-btn-primary">
```
Effect:
- Lifts button up by 0.25rem
- Pink glow shadow appears (rgba(255, 107, 157, 0.4))

---

### 3. **hover-btn-secondary**
Used for: Secondary buttons (bordered buttons, cancel actions, navigation)
```html
<button class="bg-bg-secondary border border-border-primary rounded-lg hover-btn-secondary">
```
Effect:
- Border changes to light lavender
- Lifts up by 0.25rem

---

### 4. **hover-subtle**
Used for: Stat boxes, info cards (elements that should have minimal interaction)
```html
<div class="bg-bg-tertiary border border-border-primary p-4 hover-subtle">
```
Effect:
- Border changes to light lavender
- Scales up slightly (scale 1.02)

---

### 5. **hover-gradient-line**
Used for: Cards with gradient top line accent (combine with hover-card)
```html
<div class="bg-bg-card border border-border-primary rounded-xl p-6 hover-card hover-gradient-line">
```
Effect:
- Pink to purple gradient line appears at top of card on hover

---

## Usage Examples

### Player Card
```html
<a href="players/player.html" 
   class="block bg-bg-card border border-border-primary rounded-xl p-6 hover-card hover-gradient-line group">
  <!-- card content -->
</a>
```

### Primary Button
```html
<button class="px-6 py-3 bg-text-primary text-bg-primary font-bold rounded-lg hover-btn-primary">
  Click Me
</button>
```

### Secondary Button
```html
<button class="px-6 py-3 bg-bg-secondary border border-border-primary font-semibold rounded-lg hover-btn-secondary">
  Cancel
</button>
```

### Stats Box
```html
<div class="bg-bg-tertiary border border-border-primary p-5 rounded-lg text-center hover-subtle">
  <div class="text-4xl font-black">42</div>
  <div class="text-text-muted text-xs">Players</div>
</div>
```

---

## Customization

To change hover effects across the entire site:

1. Open `tailwind-config.js`
2. Find the hover effect classes section (after line 110)
3. Modify the CSS properties:
   - Change `transform: translateY(...)` for lift amount
   - Change `box-shadow` for glow effects
   - Change `border-color` for border accents
4. Save the file - changes apply to ALL pages instantly!

---

## Benefits

✅ **Consistency**: All hover effects look and feel the same
✅ **Maintainability**: Change once, update everywhere
✅ **Performance**: Optimized CSS with reusable classes
✅ **Clarity**: Easy to understand what each class does

---

## DO NOT

❌ Use inline hover styles like `hover:-translate-y-2`
❌ Create custom hover effects per page
❌ Mix different hover patterns

Always use the unified classes above!
