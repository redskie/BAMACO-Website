/**
 * ============================================================================
 * BAMACO DESIGN SYSTEM DOCUMENTATION
 * ============================================================================
 * 
 * This file documents all reusable UI components and design patterns.
 * Use this as a reference when building new pages or features.
 * 
 * All components use Tailwind CSS classes defined in tailwind.config.js
 * ============================================================================
 */

const BAMACO_DESIGN_SYSTEM = {
  
  /**
   * ========================================================================
   * BUTTONS
   * ========================================================================
   * Standard button styles used throughout the site
   */
  buttons: {
    // Primary button - Main call-to-action
    primary: `
      px-6 py-3 
      bg-gradient-to-br from-accent-primary to-accent-secondary 
      text-bg-primary 
      font-semibold 
      rounded-md 
      transition-all duration-normal ease-smooth
      hover:transform hover:-translate-y-1 
      hover:shadow-elevated
      active:transform active:translate-y-0
    `,
    
    // Secondary button - Alternative actions
    secondary: `
      px-6 py-3 
      bg-bg-tertiary 
      text-text-primary 
      border border-border-primary 
      font-semibold 
      rounded-md 
      transition-all duration-normal ease-smooth
      hover:bg-bg-card-hover 
      hover:border-text-secondary
      hover:transform hover:-translate-y-1
    `,
    
    // Small button - Compact version
    small: `
      px-4 py-2 
      text-sm 
      bg-gradient-to-br from-accent-primary to-accent-secondary 
      text-bg-primary 
      font-medium 
      rounded-sm 
      transition-all duration-fast
      hover:transform hover:-translate-y-0.5
    `,
    
    // Icon button - For icon-only buttons
    icon: `
      p-2 
      bg-bg-tertiary 
      text-text-primary 
      rounded-md 
      transition-all duration-normal
      hover:bg-bg-card-hover 
      hover:text-accent-primary
    `,
  },
  
  /**
   * ========================================================================
   * CARDS
   * ========================================================================
   * Card components for content containers
   */
  cards: {
    // Standard card
    base: `
      bg-bg-card 
      border border-border-primary 
      rounded-lg 
      p-md 
      transition-all duration-normal ease-smooth
      hover:border-text-secondary 
      hover:transform hover:-translate-y-1 
      hover:shadow-card-hover
    `,
    
    // Enhanced card with gradient border on hover
    enhanced: `
      bg-bg-card 
      border border-border-primary 
      rounded-md 
      p-md 
      cursor-pointer 
      relative 
      overflow-hidden 
      transition-all duration-normal ease-smooth
      hover:border-text-secondary 
      hover:transform hover:-translate-y-1 
      hover:shadow-elevated
      before:absolute before:top-0 before:left-0 before:right-0 before:h-1 
      before:bg-gradient-to-r before:from-text-primary before:to-text-secondary
      before:scale-x-0 before:origin-left before:transition-transform before:duration-normal
      hover:before:scale-x-100
    `,
    
    // Stat card - For displaying numbers/statistics
    stat: `
      bg-bg-card 
      border border-border-primary 
      rounded-lg 
      p-lg 
      text-center 
      transition-all duration-normal ease-smooth
      hover:transform hover:-translate-y-1 
      hover:border-text-secondary 
      hover:shadow-card-hover
    `,
    
    // Glass card - Glassmorphism effect
    glass: `
      glass-card 
      rounded-lg 
      p-md 
      transition-all duration-normal
    `,
  },
  
  /**
   * ========================================================================
   * INPUTS & FORMS
   * ========================================================================
   * Form input styling
   */
  inputs: {
    // Text input / Number input
    text: `
      w-full 
      px-4 py-3 
      bg-bg-secondary 
      border-2 border-border-primary 
      rounded-sm 
      text-text-primary 
      text-base 
      transition-all duration-normal
      focus:outline-none 
      focus:border-text-secondary 
      focus:shadow-glow
      placeholder:text-text-muted
    `,
    
    // Select dropdown
    select: `
      w-full 
      px-4 py-3 
      bg-bg-secondary 
      border-2 border-border-primary 
      rounded-sm 
      text-text-primary 
      text-base 
      transition-all duration-normal
      focus:outline-none 
      focus:border-text-secondary 
      focus:shadow-glow
      cursor-pointer
    `,
    
    // Label
    label: `
      block 
      mb-2 
      text-text-secondary 
      text-sm 
      font-medium
    `,
    
    // Input group container
    group: `
      mb-md
    `,
  },
  
  /**
   * ========================================================================
   * NAVIGATION
   * ========================================================================
   * Navigation bar styling
   */
  navigation: {
    // Navbar container
    navbar: `
      bg-bg-secondary 
      border-b border-border-primary 
      py-sm 
      sticky top-0 
      z-sticky 
      backdrop-blur-md
    `,
    
    // Nav link
    link: `
      text-text-secondary 
      px-sm py-xs 
      rounded-sm 
      text-base 
      whitespace-nowrap 
      transition-all duration-normal
      hover:text-text-primary 
      hover:bg-bg-tertiary
    `,
    
    // Active nav link
    linkActive: `
      text-text-primary 
      bg-bg-tertiary 
      px-sm py-xs 
      rounded-sm 
      text-base 
      whitespace-nowrap
    `,
    
    // Mobile menu toggle
    toggle: `
      flex flex-col 
      gap-1 
      p-1 
      transition-all duration-normal
      hover:opacity-80
    `,
    
    // Toggle bar
    toggleBar: `
      w-6 h-0.5 
      bg-text-primary 
      rounded-full 
      transition-all duration-normal
    `,
  },
  
  /**
   * ========================================================================
   * TYPOGRAPHY
   * ========================================================================
   * Text styling patterns
   */
  typography: {
    // Page title
    h1: `
      text-6xl 
      font-black 
      mb-4 
      text-gradient 
      leading-tight
    `,
    
    // Section title
    h2: `
      text-2xl 
      font-bold 
      mb-md 
      text-text-primary 
      relative 
      pb-sm
      after:absolute after:bottom-0 after:left-0 
      after:w-16 after:h-1 
      after:bg-gradient-to-r after:from-accent-primary after:to-accent-secondary 
      after:rounded-sm
    `,
    
    // Subsection title
    h3: `
      text-xl 
      font-bold 
      mb-sm 
      text-text-primary
    `,
    
    // Card title
    h4: `
      text-lg 
      font-semibold 
      mb-2 
      text-text-primary
    `,
    
    // Body text
    body: `
      text-base 
      text-text-primary 
      leading-relaxed
    `,
    
    // Secondary text
    secondary: `
      text-sm 
      text-text-secondary
    `,
    
    // Muted text
    muted: `
      text-xs 
      text-text-muted 
      uppercase 
      tracking-wide
    `,
  },
  
  /**
   * ========================================================================
   * LAYOUT
   * ========================================================================
   * Layout containers and grids
   */
  layout: {
    // Main container
    container: `
      max-w-screen-xl 
      mx-auto 
      px-md
    `,
    
    // Section spacing
    section: `
      my-xl
    `,
    
    // Grid - Auto-fit cards
    grid: `
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      gap-md
    `,
    
    // Bento Grid - Asymmetric layout
    bentoGrid: `
      grid 
      grid-cols-12 
      gap-md
    `,
    
    // Flex row with gap
    flexRow: `
      flex 
      items-center 
      gap-sm 
      flex-wrap
    `,
    
    // Flex column
    flexCol: `
      flex 
      flex-col 
      gap-md
    `,
  },
  
  /**
   * ========================================================================
   * SPECIAL EFFECTS
   * ========================================================================
   * Animated and interactive effects
   */
  effects: {
    // Shimmer animation
    shimmer: `
      relative 
      overflow-hidden
      before:absolute before:top-0 before:left-[-100%] 
      before:w-full before:h-full 
      before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
      before:animate-shimmer
    `,
    
    // Pulse indicator (for live status)
    pulse: `
      w-3 h-3 
      rounded-full 
      bg-success 
      animate-pulse-slow
    `,
    
    // Floating action button
    fab: `
      fixed 
      bottom-8 right-8 
      w-14 h-14 
      bg-gradient-to-br from-accent-primary to-accent-secondary 
      text-bg-primary 
      rounded-full 
      flex items-center justify-center 
      shadow-card-hover 
      transition-all duration-normal
      hover:transform hover:scale-110 
      hover:shadow-elevated
      z-fixed
    `,
    
    // Badge
    badge: `
      inline-block 
      px-3 py-1 
      bg-bg-tertiary 
      text-text-primary 
      text-xs 
      font-semibold 
      rounded-full 
      border border-border-primary
    `,
    
    // Rank badge with gradient
    rankBadge: `
      px-4 py-2 
      rounded-sm 
      font-bold 
      text-lg 
      text-bg-primary
    `,
  },
  
  /**
   * ========================================================================
   * STATES
   * ========================================================================
   * State-based styling (success, error, loading, etc.)
   */
  states: {
    // Success message
    success: `
      p-sm 
      bg-success/10 
      border-l-4 border-success 
      rounded-sm 
      text-success
    `,
    
    // Error message
    error: `
      p-sm 
      bg-error/10 
      border-l-4 border-error 
      rounded-sm 
      text-error
    `,
    
    // Warning message
    warning: `
      p-sm 
      bg-warning/10 
      border-l-4 border-warning 
      rounded-sm 
      text-warning
    `,
    
    // Info message
    info: `
      p-sm 
      bg-info/10 
      border-l-4 border-info 
      rounded-sm 
      text-info
    `,
    
    // Loading spinner
    spinner: `
      inline-block 
      w-5 h-5 
      border-2 border-text-primary/30 
      border-t-text-primary 
      rounded-full 
      animate-spin
    `,
    
    // Disabled state
    disabled: `
      opacity-50 
      cursor-not-allowed 
      pointer-events-none
    `,
  },
  
  /**
   * ========================================================================
   * RANK GRADIENTS
   * ========================================================================
   * maimai rank badge backgrounds
   */
  ranks: {
    'SSS+': 'bg-gradient-to-br from-[#ffd700] to-[#ffa500]',
    'SSS': 'bg-gradient-to-br from-[#ffd700] to-[#ff8c00]',
    'SS+': 'bg-gradient-to-br from-[#c0c0c0] to-[#a0a0a0]',
    'SS': 'bg-gradient-to-br from-[#c0c0c0] to-[#909090]',
    'S+': 'bg-gradient-to-br from-[#cd7f32] to-[#b8860b]',
    'S': 'bg-gradient-to-br from-[#cd7f32] to-[#a0522d]',
    'AAA': 'bg-gradient-to-br from-[#4caf50] to-[#45a049]',
    'AA': 'bg-gradient-to-br from-[#2196f3] to-[#1976d2]',
    'A': 'bg-gradient-to-br from-[#00bcd4] to-[#0097a7]',
    'BBB': 'bg-gradient-to-br from-[#9c27b0] to-[#7b1fa2]',
    'BB': 'bg-gradient-to-br from-[#673ab7] to-[#512da8]',
    'B': 'bg-gradient-to-br from-[#ff5722] to-[#e64a19]',
    'C': 'bg-gradient-to-br from-[#795548] to-[#5d4037]',
    'D': 'bg-gradient-to-br from-[#9e9e9e] to-[#757575]',
  },
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BAMACO_DESIGN_SYSTEM;
}
