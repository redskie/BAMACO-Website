/**
 * ============================================================================
 * BAMACO DESIGN SYSTEM - CENTRALIZED TAILWIND CONFIGURATION
 * ============================================================================
 * 
 * This is the SINGLE SOURCE OF TRUTH for all design tokens in BAMACO.
 * Edit this file to update colors, spacing, typography, animations across
 * the ENTIRE website instantly.
 * 
 * Used by: All HTML files via Tailwind CDN
 * ============================================================================
 */

window.BAMACO_TAILWIND_CONFIG = {
  theme: {
    extend: {
      /**
       * ========================================================================
       * COLORS - Maimai JP Pastel Pink Theme
       * ========================================================================
       * Soft pastel pink color scheme inspired by maimai.sega.jp
       */
      colors: {
        // Background Colors - Clean, mobile-optimized
        'bg-primary': '#ffffff',     // Pure white for clarity
        'bg-secondary': '#fafafa',   // Very light gray
        'bg-tertiary': '#f5f5f5',    // Light gray
        'bg-card': 'rgba(255, 255, 255, 0.95)',        // Clean white cards
        'bg-card-hover': 'rgba(248, 250, 252, 1)',     // Subtle hover
        
        // Text Colors - Improved mobile readability
        'text-primary': '#1f2937',   // Dark gray for excellent readability
        'text-secondary': '#4b5563', // Medium gray
        'text-muted': '#9ca3af',     // Light gray for less important text
        
        // Accent Colors - Refined and mobile-friendly
        'accent-pink': '#ec4899',     // Toned down pink
        'accent-purple': '#8b5cf6',   // Softer purple
        'accent-blue': '#3b82f6',     // Clear blue
        'accent-cyan': '#06b6d4',     // Professional cyan
        'accent-yellow': '#f59e0b',   // Warm yellow
        'accent-green': '#10b981',    // Clean green
        'accent-primary': '#10b981',  // Compatibility - Green
        'accent-secondary': '#f59e0b',// Compatibility - Yellow
        
        // Border Colors - Subtle and clean
        'border-primary': '#e5e7eb',  // Light gray border
        'border-glow': '#ec4899',     // Pink accent
        
        // Admin Badge Colors
        'admin-owner': '#ffd700',     // Gold for Owner
        'admin-admin': '#ff6b9d',     // Pink for Admin
        'admin-mod': '#60a5fa',       // Blue for Moderator
      },
      
      /**
       * ========================================================================
       * TYPOGRAPHY - Mobile-first readability
       * ========================================================================
       */
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', '1rem'],     // 12px, tight for mobile
        'sm': ['0.875rem', '1.25rem'],  // 14px, compact
        'base': ['1rem', '1.5rem'],     // 16px, standard mobile
        'lg': ['1.125rem', '1.75rem'],  // 18px, larger mobile headers
        'xl': ['1.25rem', '1.875rem'],  // 20px, section headers
        '2xl': ['1.5rem', '2rem'],      // 24px, main headers
        '3xl': ['1.875rem', '2.25rem'], // 30px, max mobile size
      },
      
      /**
       * ========================================================================
       * SPACING - Mobile-optimized with compact design
       * ========================================================================
       */
      spacing: {
        'xs': '0.25rem',  // 4px - very tight
        'sm': '0.5rem',   // 8px - compact
        'md': '0.75rem',  // 12px - standard mobile
        'lg': '1rem',     // 16px - comfortable
        'xl': '1.25rem',  // 20px - spacious
        '2xl': '1.5rem',  // 24px - section spacing
        '3xl': '2rem',    // 32px - large spacing
      },
      
      /**
       * ========================================================================
       * ANIMATIONS - Subtle, mobile-friendly
       * ========================================================================
       */
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'bounce-gentle': 'bounceGentle 1s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.25rem)' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rotateMedium: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rotateFast: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        popupRandom: {
          '0%': { 
            opacity: '0', 
            transform: 'translate(var(--random-x), var(--random-y)) scale(0)' 
          },
          '10%': { 
            opacity: '0.7', 
            transform: 'translate(var(--random-x), var(--random-y)) scale(1)' 
          },
          '90%': { 
            opacity: '0.7', 
            transform: 'translate(var(--random-x), var(--random-y)) scale(1)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translate(var(--random-x), var(--random-y)) scale(0)' 
          },
        },
      },
    },
  },
};

/**
 * ============================================================================
 * UNIFIED HOVER EFFECT CLASSES
 * ============================================================================
 * Use these classes for consistent hover effects across the entire site
 * 
 * CARD HOVER: hover-card
 * - Lifts card up slightly (-translate-y-2)
 * - Changes border to accent color
 * - Adds pink shadow
 * 
 * BUTTON HOVER PRIMARY: hover-btn-primary  
 * - Lifts button up (-translate-y-1)
 * - Adds pink glow shadow
 * 
 * BUTTON HOVER SECONDARY: hover-btn-secondary
 * - Changes border to accent color
 * - Lifts up slightly
 * 
 * Usage: Add these classes alongside your base classes
 * Example: class="bg-bg-card border border-border-primary hover-card"
 * ============================================================================
 */

// Apply styles after Tailwind loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile-First Card Hover Effect */
      .hover-card {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-card:hover {
        transform: translateY(-0.125rem);
        border-color: #e5e7eb;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      /* Clean Primary Button Hover */
      .hover-btn-primary {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-btn-primary:hover {
        transform: translateY(-0.0625rem);
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
      }
      
      /* Clean Secondary Button Hover */
      .hover-btn-secondary {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-btn-secondary:hover {
        border-color: #d1d5db;
        background-color: #f9fafb;
      }
      
      /* Subtle Hover for Small Elements */
      .hover-subtle {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-subtle:hover {
        border-color: #bbf7d0;
        transform: scale(1.02);
      }
      
      /* Gradient Top Line Effect (for cards with group) */
      .hover-gradient-line {
        position: relative;
        overflow: hidden;
      }
      .hover-gradient-line::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #bbf7d0, #fef08a);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-gradient-line:hover::before {
        transform: scaleX(1);
      }
      
      /* ========================================================================
         MODERN MARQUEE EFFECT - Smooth scrolling text for long titles
         ======================================================================== */
      .marquee-container {
        position: relative;
        overflow: hidden;
        max-width: 280px;
        background: linear-gradient(90deg, 
          rgba(255, 173, 210, 0.1) 0%, 
          rgba(255, 217, 235, 0.2) 10%, 
          rgba(255, 217, 235, 0.2) 90%, 
          rgba(255, 173, 210, 0.1) 100%);
        border: 1px solid rgba(255, 173, 210, 0.3);
        border-radius: 0.5rem;
        padding: 0.4rem 0.75rem;
        margin: 0.5rem auto;
        box-shadow: 0 2px 8px rgba(255, 107, 157, 0.1);
      }
      
      /* Mobile responsive */
      @media (max-width: 640px) {
        .marquee-container {
          max-width: 200px;
          padding: 0.3rem 0.6rem;
          font-size: 0.875rem;
        }
      }
      
      .marquee-content {
        display: inline-block;
        white-space: nowrap;
        animation: marqueeScroll 12s linear infinite;
        font-weight: 500;
        letter-spacing: 0.025em;
        color: #2d1b2e;
        text-shadow: none;
      }
      
      .marquee-container:hover .marquee-content {
        animation-play-state: paused;
      }
      
      @keyframes marqueeScroll {
        0% { 
          transform: translateX(100%);
        }
        100% { 
          transform: translateX(-100%);
        }
      }
      
      /* Subtle gradient edges for fade effect */
      .marquee-container::before,
      .marquee-container::after {
        content: '';
        position: absolute;
        top: 0;
        width: 1.5rem;
        height: 100%;
        pointer-events: none;
        z-index: 2;
      }
      
      .marquee-container::before {
        left: 0;
        background: linear-gradient(90deg, 
          rgba(255, 217, 235, 0.9) 0%, 
          transparent 100%);
      }
      
      .marquee-container::after {
        right: 0;
        background: linear-gradient(270deg, 
          rgba(255, 217, 235, 0.9) 0%, 
          transparent 100%);
      }
      
      .marquee-container:hover {
        background: linear-gradient(90deg, 
          rgba(255, 173, 210, 0.15) 0%, 
          rgba(255, 217, 235, 0.25) 50%,
          rgba(255, 173, 210, 0.15) 100%);
        border-color: rgba(255, 107, 157, 0.4);
        box-shadow: 0 4px 12px rgba(255, 107, 157, 0.15);
      }
      
      /* ========================================================================
         MOBILE MENU ENHANCEMENTS
         ======================================================================== */
      /* Smooth mobile menu animations */
      .nav-links {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Touch-friendly mobile menu items */
      @media (max-width: 768px) {
        .nav-links a {
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.025em;
          border-radius: 0.5rem;
          margin: 0.125rem 0.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .nav-links a::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent);
          transition: left 0.5s;
        }
        
        .nav-links a:active::before {
          left: 100%;
        }
        
        /* Add subtle dividers */
        .nav-links li:not(:last-child)::after {
          content: '';
          display: block;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139, 111, 141, 0.2), transparent);
          margin: 0.25rem 1rem;
        }
      }
      
      /* Hamburger menu animation improvements */
      .nav-toggle span {
        transform-origin: center;
      }
      
      /* Backdrop blur for mobile menu */
      @media (max-width: 768px) {
        .nav-links.active {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      }
      
      /* MaiMai Rotating Background Circles */
      .maimai-bg-circles {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -10;
        pointer-events: none;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .maimai-circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.7;
      }
      
      .maimai-circle-white {
        width: min(120vw, 900px);
        height: min(120vw, 900px);
        background-image: url('https://maimai.sega.jp/assets/maiDecorationBg/circle_white.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        animation: rotateSlow 30s linear infinite;
      }
      
      .maimai-circle-yellow {
        width: min(100vw, 750px);
        height: min(100vw, 750px);
        background-image: url('https://maimai.sega.jp/assets/maiDecorationBg/circle_yellow.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        animation: rotateMedium 20s linear infinite;
      }
      
      .maimai-circle-colorful {
        width: min(80vw, 600px);
        height: min(80vw, 600px);
        background-image: url('https://maimai.sega.jp/assets/maiDecorationBg/circle_colorful.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        animation: rotateFast 15s linear infinite;
      }
      
      @keyframes rotateSlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes rotateMedium {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes rotateFast {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes popupRandom {
        0% { 
          opacity: 0; 
          transform: scale(0) rotate(0deg);
        }
        15% { 
          opacity: 0.7; 
          transform: scale(1) rotate(5deg);
        }
        85% { 
          opacity: 0.7; 
          transform: scale(1) rotate(-5deg);
        }
        100% { 
          opacity: 0; 
          transform: scale(0) rotate(0deg);
        }
      }
      
      /* MaiMai Popup Character */
      .maimai-popup-character {
        position: fixed;
        width: min(20vw, 150px);
        height: min(20vw, 150px);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        z-index: -5;
        pointer-events: none;
        opacity: 0;
        animation: popupRandom 8s ease-in-out infinite;
        left: var(--random-x, 50vw);
        top: var(--random-y, 50vh);
        transform-origin: center;
      }
      
      .maimai-popup-character.char1 {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmY2YjlkIiByeD0iMTAiLz4KPHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgeD0iMTAiIHk9IjEwIiB2aWV3Qm94PSIwIDAgMTgwIDE4MCI+CjxnIGZpbGw9IiNmZmZmZmYiPgo8Y2lyY2xlIGN4PSI2MCIgY3k9IjcwIiByPSI4Ii8+CjxjaXJjbGUgY3g9IjEyMCIgY3k9IjcwIiByPSI4Ii8+CjxwYXRoIGQ9Im02MCA5MHEzMCAyMCA2MCAwaS0zMCAxMC02MCAweiIvPgo8L2c+Cjwvc3ZnPgo8L3N2Zz4=');
      }
      
      .maimai-popup-character.char2 {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjYTg1NWY3IiByeD0iMTAiLz4KPHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgeD0iMTAiIHk9IjEwIiB2aWV3Qm94PSIwIDAgMTgwIDE4MCI+CjxnIGZpbGw9IiNmZmZmZmYiPgo8Y2lyY2xlIGN4PSI1NSIgY3k9IjY1IiByPSI2Ii8+CjxjaXJjbGUgY3g9IjEyNSIgY3k9IjY1IiByPSI2Ii8+CjxwYXRoIGQ9Im01NSA5NXEzNSAyNSA3MCAwaS0zNSAxNS03MCAweiIvPgo8L2c+Cjwvc3ZnPgo8L3N2Zz4=');
      }
      
      /* Admin Badge Styles */
      .admin-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: bold;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 10;
      }
      
      .admin-badge-owner {
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        border: 1px solid #ffc107;
      }
      
      .admin-badge-admin {
        background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
        border: 1px solid #ff6b9d;
      }
      
      .admin-badge-mod {
        background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%);
        border: 1px solid #60a5fa;
      }
      
      .admin-badge-icon {
        font-size: 12px;
        line-height: 1;
      }
      
      .admin-badge-label {
        font-size: 9px;
        letter-spacing: 0.5px;
      }
    `;
    document.head.appendChild(style);
    
    // Add MaiMai rotating background circles to all pages
    if (!document.querySelector('.maimai-bg-circles')) {
      const bgCircles = document.createElement('div');
      bgCircles.className = 'maimai-bg-circles';
      bgCircles.innerHTML = `
        <div class="maimai-circle maimai-circle-white"></div>
        <div class="maimai-circle maimai-circle-yellow"></div>
        <div class="maimai-circle maimai-circle-colorful"></div>
      `;
      document.body.appendChild(bgCircles);
      
      // Add popup characters with random positioning
      let currentCharIndex = 0;
      const characters = ['char1', 'char2'];
      
      function createPopupCharacter() {
        const popupChar = document.createElement('div');
        popupChar.className = `maimai-popup-character ${characters[currentCharIndex]}`;
        
        // Random position
        const maxX = Math.max(50, window.innerWidth - 150);
        const maxY = Math.max(50, window.innerHeight - 150);
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        popupChar.style.left = `${randomX}px`;
        popupChar.style.top = `${randomY}px`;
        
        // Add to body
        document.body.appendChild(popupChar);
        
        // Remove after animation completes
        setTimeout(() => {
          if (popupChar.parentNode) {
            popupChar.parentNode.removeChild(popupChar);
          }
        }, 8000);
        
        // Cycle through characters
        currentCharIndex = (currentCharIndex + 1) % characters.length;
      }
      
      // Create initial character
      createPopupCharacter();
      
      // Create new popup character every 6-10 seconds randomly
      function scheduleNextPopup() {
        const delay = 6000 + Math.random() * 4000; // 6-10 seconds
        setTimeout(() => {
          createPopupCharacter();
          scheduleNextPopup();
        }, delay);
      }
      
      scheduleNextPopup();
    }
  });
}

