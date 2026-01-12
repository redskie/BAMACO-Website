/**
 * ============================================================================
 * BAMACO LOADING OPTIMIZER
 * ============================================================================
 * 
 * Performance optimization and smooth loading states for instant feel
 */

// Cache manager for faster subsequent loads
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
}

const cache = new CacheManager();

// Loading skeleton generators
const LoadingSkeletons = {
  // Player card skeleton
  playerCard() {
    return `
      <div class="bg-bg-card border border-border-primary rounded-xl p-4 sm:p-6 hover-card animate-pulse">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-bg-tertiary rounded-full"></div>
          <div class="flex-1">
            <div class="h-6 bg-bg-tertiary rounded mb-2 w-3/4"></div>
            <div class="h-4 bg-bg-tertiary rounded w-1/2"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-bg-tertiary rounded w-full"></div>
          <div class="h-3 bg-bg-tertiary rounded w-5/6"></div>
        </div>
      </div>
    `;
  },

  // Stats card skeleton
  statsCard() {
    return `
      <div class="bg-bg-card border border-border-primary rounded-xl p-6 text-center animate-pulse">
        <div class="w-16 h-16 bg-bg-tertiary rounded mx-auto mb-2"></div>
        <div class="h-4 bg-bg-tertiary rounded w-20 mx-auto"></div>
      </div>
    `;
  },

  // Queue item skeleton
  queueItem() {
    return `
      <div class="flex flex-col justify-between items-start p-3 sm:p-4 border border-border-primary rounded gap-2 animate-pulse">
        <div class="flex items-center gap-2 w-full">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-bg-tertiary rounded-full"></div>
          <div class="h-4 bg-bg-tertiary rounded flex-1"></div>
        </div>
      </div>
    `;
  },

  // Article card skeleton
  articleCard() {
    return `
      <div class="bg-bg-card border border-border-primary rounded-xl overflow-hidden hover-card animate-pulse">
        <div class="h-48 bg-bg-tertiary"></div>
        <div class="p-6">
          <div class="h-6 bg-bg-tertiary rounded mb-2"></div>
          <div class="h-4 bg-bg-tertiary rounded mb-4 w-3/4"></div>
          <div class="space-y-2">
            <div class="h-3 bg-bg-tertiary rounded"></div>
            <div class="h-3 bg-bg-tertiary rounded w-5/6"></div>
          </div>
        </div>
      </div>
    `;
  }
};

// Smooth transition manager
class TransitionManager {
  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  static replaceWithFade(oldElement, newContent, duration = 300) {
    // Fade out old content
    oldElement.style.transition = `opacity ${duration/2}ms ease`;
    oldElement.style.opacity = '0';
    
    setTimeout(() => {
      oldElement.innerHTML = newContent;
      oldElement.style.opacity = '1';
      oldElement.style.transition = `opacity ${duration/2}ms ease`;
    }, duration/2);
  }
}

// Resource preloader
class ResourcePreloader {
  constructor() {
    this.preloaded = new Set();
  }

  preloadImage(src) {
    if (this.preloaded.has(src)) return;
    
    const img = new Image();
    img.src = src;
    this.preloaded.add(src);
  }

  preloadScript(src) {
    if (this.preloaded.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = src;
    document.head.appendChild(link);
    this.preloaded.add(src);
  }
}

const preloader = new ResourcePreloader();

// Enhanced data fetcher with caching and loading states
class DataFetcher {
  static async fetchWithCache(url, cacheKey) {
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.warn(`Failed to fetch ${url}:`, error);
      return null;
    }
  }

  static async loadWithSkeleton(containerSelector, skeletonGenerator, dataLoader) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Show skeleton immediately
    container.innerHTML = skeletonGenerator();
    
    try {
      // Load real data
      const data = await dataLoader();
      
      // Replace skeleton with real content after small delay for smoothness
      setTimeout(() => {
        TransitionManager.replaceWithFade(container, data);
      }, 100);
      
    } catch (error) {
      console.error('Failed to load data:', error);
      container.innerHTML = '<div class="text-center text-text-muted p-8">Failed to load content</div>';
    }
  }
}

// Initialize performance optimizations
function initializePerformanceOptimizations() {
  // Preload critical resources
  preloader.preloadImage('https://maimai.sega.jp/storage/root/logo.png');
  
  // Add loading states to critical elements
  document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for smooth loading animations
    const style = document.createElement('style');
    style.textContent = `
      .loading-fade-in {
        animation: fadeInUp 0.5s ease forwards;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .smooth-skeleton {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);
  });

  // Service Worker for caching (if supported)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently fail if no service worker
      });
    });
  }
}

// Export utilities
window.BAMACO_LOADING = {
  cache,
  LoadingSkeletons,
  TransitionManager,
  DataFetcher,
  preloader,
  initializePerformanceOptimizations
};

// Auto-initialize
initializePerformanceOptimizations();