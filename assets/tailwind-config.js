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
        // Background Colors - Soft pastel pink theme
        'bg-primary': '#ffe6f0',     // Light pastel pink
        'bg-secondary': '#ffcfe3',   // Soft pink
        'bg-tertiary': '#ffb8d6',    // Medium pastel pink
        'bg-card': 'rgba(255, 217, 235, 0.85)',        // Card pastel pink - translucent
        'bg-card-hover': 'rgba(255, 194, 223, 0.9)',  // Hover pink - translucent
        
        // Text Colors - Dark for contrast on light background
        'text-primary': '#2d1b2e',   // Dark purple for readability
        'text-secondary': '#5a3d5c', // Medium purple
        'text-muted': '#8b6f8d',     // Muted purple
        
        // Accent Colors - Vibrant!
        'accent-pink': '#ff6b9d',     // Bright pink (maimai signature)
        'accent-purple': '#a855f7',   // Vibrant purple
        'accent-blue': '#60a5fa',     // Bright blue
        'accent-cyan': '#22d3ee',     // Cyan
        'accent-yellow': '#fef08a',   // Pastel Yellow (for buttons)
        'accent-green': '#bbf7d0',    // Pastel Green (for buttons)
        'accent-primary': '#bbf7d0',  // Compatibility - Pastel Green
        'accent-secondary': '#fef08a',// Compatibility - Pastel Yellow
        
        // Border Colors
        'border-primary': '#ffadd2',  // Pastel pink border
        'border-glow': '#ff6b9d',     // Pink glow
      },
      
      /**
       * ========================================================================
       * TYPOGRAPHY
       * ========================================================================
       */
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      
      /**
       * ========================================================================
       * SPACING
       * ========================================================================
       */
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
      },
      
      /**
       * ========================================================================
       * ANIMATIONS
       * ========================================================================
       */
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'grid-move': 'gridMove 20s linear infinite',
        'shimmer': 'shimmer 3s infinite',
        'rotate-slow': 'rotateSlow 30s linear infinite',
        'rotate-medium': 'rotateMedium 20s linear infinite',
        'rotate-fast': 'rotateFast 15s linear infinite',
        'popup-random': 'popupRandom 8s ease-in-out infinite',
      },
      
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
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
      /* Unified Card Hover Effect */
      .hover-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-card:hover {
        transform: translateY(-0.5rem);
        border-color: #fef08a;
        box-shadow: 0 20px 40px rgba(252, 211, 77, 0.3);
      }
      
      /* Unified Primary Button Hover */
      .hover-btn-primary {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-btn-primary:hover {
        transform: translateY(-0.25rem);
        box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
      }
      
      /* Unified Secondary Button Hover */
      .hover-btn-secondary {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-btn-secondary:hover {
        border-color: #bbf7d0;
        transform: translateY(-0.25rem);
      }
      
      /* Unified Subtle Hover (for stats, info boxes) */
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

