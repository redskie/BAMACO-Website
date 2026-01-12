/**
 * ============================================================================
 * BAMACO PAGE TRANSITIONS
 * ============================================================================
 * 
 * Smooth, minimalist page transitions for navigation between pages.
 * Automatically handles all internal links with fade animations.
 * 
 * CUSTOMIZATION:
 * - Edit animation timing in tailwind.config.js (pageIn/pageOut animations)
 * - Adjust transition duration below (TRANSITION_DURATION)
 * - Change animation style by modifying CSS classes
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================================================

const TRANSITION_CONFIG = {
  // Duration in milliseconds (should match CSS animation duration)
  duration: 400,
  
  // Animation type - Options:
  // 'fade' - Simple fade in/out
  // 'slide' - Slide up/down
  // 'fade-slide' - Combination (default)
  type: 'fade-slide',
  
  // Enable/disable transitions
  enabled: true,
  
  // Exclude these paths from transitions (exact matches)
  excludePaths: [],
  
  // Exclude external links
  excludeExternal: true,
};

// ============================================================================
// PAGE TRANSITION HANDLER
// ============================================================================

class PageTransitions {
  constructor(config) {
    this.config = config;
    this.isTransitioning = false;
    this.init();
  }

  init() {
    if (!this.config.enabled) return;

    // Add page transition wrapper
    this.wrapPage();
    
    // Intercept all link clicks
    this.interceptLinks();
    
    // Handle browser back/forward buttons
    this.handlePopState();
    
    // Initial page load animation
    this.animateIn();
  }

  wrapPage() {
    // Wrap page content for transitions
    const body = document.body;
    const wrapper = document.createElement('div');
    wrapper.id = 'page-transition-wrapper';
    wrapper.className = 'min-h-screen';
    
    // Move all body children into wrapper
    while (body.firstChild) {
      wrapper.appendChild(body.firstChild);
    }
    
    body.appendChild(wrapper);
  }

  getWrapper() {
    return document.getElementById('page-transition-wrapper');
  }

  animateIn() {
    const wrapper = this.getWrapper();
    if (!wrapper) return;

    // Add entrance animation
    wrapper.style.animation = `pageIn ${this.config.duration}ms ease-out`;
    
    // Clean up animation
    setTimeout(() => {
      wrapper.style.animation = '';
    }, this.config.duration);
  }

  animateOut(callback) {
    const wrapper = this.getWrapper();
    if (!wrapper) {
      callback();
      return;
    }

    // Add exit animation
    wrapper.style.animation = `pageOut ${this.config.duration}ms ease-in`;
    
    // Navigate after animation
    setTimeout(callback, this.config.duration);
  }

  shouldTransition(link) {
    // Check if transitions are enabled
    if (!this.config.enabled) return false;

    // Skip if already transitioning
    if (this.isTransitioning) return false;

    // Skip external links if configured
    if (this.config.excludeExternal) {
      const isExternal = link.hostname !== window.location.hostname;
      if (isExternal) return false;
    }

    // Skip excluded paths
    const path = link.pathname;
    if (this.config.excludePaths.includes(path)) return false;

    // Skip anchors on same page
    if (link.pathname === window.location.pathname && link.hash) return false;

    // Skip if link has data-no-transition attribute
    if (link.hasAttribute('data-no-transition')) return false;

    return true;
  }

  interceptLinks() {
    document.addEventListener('click', (e) => {
      // Find closest anchor tag
      const link = e.target.closest('a');
      
      if (!link) return;
      if (!this.shouldTransition(link)) return;

      // Prevent default navigation
      e.preventDefault();
      
      // Perform animated transition
      this.navigateWithTransition(link.href);
    });
  }

  navigateWithTransition(url) {
    this.isTransitioning = true;

    // Animate out, then navigate
    this.animateOut(() => {
      window.location.href = url;
    });
  }

  handlePopState() {
    window.addEventListener('popstate', () => {
      // Browser back/forward button - just reload with animation
      this.animateIn();
    });
  }
}

// ============================================================================
// AUTO-INITIALIZE
// ============================================================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitions(TRANSITION_CONFIG);
  });
} else {
  window.pageTransitions = new PageTransitions(TRANSITION_CONFIG);
}

// ============================================================================
// UTILITY FUNCTIONS (Optional)
// ============================================================================

/**
 * Disable transitions temporarily
 * Usage: disableTransitions()
 */
function disableTransitions() {
  if (window.pageTransitions) {
    window.pageTransitions.config.enabled = false;
  }
}

/**
 * Enable transitions
 * Usage: enableTransitions()
 */
function enableTransitions() {
  if (window.pageTransitions) {
    window.pageTransitions.config.enabled = true;
  }
}

/**
 * Navigate with transition programmatically
 * Usage: navigateWithTransition('/players.html')
 */
function navigateWithTransition(url) {
  if (window.pageTransitions) {
    window.pageTransitions.navigateWithTransition(url);
  } else {
    window.location.href = url;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    PageTransitions, 
    disableTransitions, 
    enableTransitions,
    navigateWithTransition,
  };
}
