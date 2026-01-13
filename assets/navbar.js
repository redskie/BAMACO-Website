/**
 * Centralized Navbar Management
 * Generates and injects navbar into pages, handles mobile navigation
 */

// Centralized navbar configuration
const NAVBAR_CONFIG = {
  brand: {
    title: 'BAMACO',
    subtitle: 'Bataan MaiMai Community'
  },
  links: [
    { href: 'index.html', text: 'Home', id: 'home' },
    { href: 'players.html', text: 'Players', id: 'players' },
    { href: 'guilds.html', text: 'Guilds', id: 'guilds' },
    { href: 'articles.html', text: 'Tips & Guides', id: 'articles' },
    { href: 'calculator.html', text: 'Calculator', id: 'calculator' },
    { href: 'queue.html', text: 'Queue', id: 'queue' }
  ]
};

// Generate navbar HTML with Tailwind classes
function generateNavbar() {
  const currentPath = getCurrentPagePath();

  // Check if user is admin
  const session = JSON.parse(localStorage.getItem('bamaco_session') || 'null');
  const isAdmin = session && session.user && session.user.isAdmin;

  // Create links array with conditional admin link
  const linksToShow = [...NAVBAR_CONFIG.links];
  if (isAdmin) {
    linksToShow.push({ href: 'admin-content-manager.html', text: '👑 Admin', id: 'admin' });
  }

  const navLinks = linksToShow.map(link => {
    const isActive = isActiveLink(link.href, currentPath);
    const activeClasses = isActive
      ? 'text-white bg-accent-pink shadow-sm'
      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary';
    const href = getAbsolutePath(link.href);
    return `<li><a href="${href}" class="${activeClasses} block px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium">${link.text}</a></li>`;
  }).join('');

  // Generate mobile menu links separately for better control
  const mobileNavLinks = linksToShow.map(link => {
    const isActive = isActiveLink(link.href, currentPath);
    const activeClasses = isActive
      ? 'text-white bg-accent-pink font-medium'
      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary';
    const href = getAbsolutePath(link.href);
    return `<a href="${href}" class="${activeClasses} block px-4 py-3 rounded-lg transition-all duration-200 text-center touch-target font-medium">${link.text}</a>`;
  }).join('');

  return `
    <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border-primary shadow-sm">
      <div class="max-w-7xl mx-auto px-3 sm:px-6">
        <div class="flex justify-between items-center py-3">
          <div class="nav-brand z-50">
            <h1 class="text-lg sm:text-xl font-bold bg-gradient-to-r from-accent-pink to-accent-purple bg-clip-text text-transparent">${NAVBAR_CONFIG.brand.title}</h1>
            <span class="hidden sm:block text-xs text-text-muted mt-[-2px]">${NAVBAR_CONFIG.brand.subtitle}</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="nav-actions flex items-center gap-2"></div>
            <button class="nav-toggle md:hidden touch-target p-2 z-50 rounded-lg hover:bg-bg-secondary transition-colors" aria-label="Toggle navigation">
              <div class="w-5 h-4 relative">
                <span class="absolute w-5 h-0.5 bg-text-primary rounded transition-all duration-200 top-0"></span>
                <span class="absolute w-5 h-0.5 bg-text-primary rounded transition-all duration-200 top-1.5"></span>
                <span class="absolute w-5 h-0.5 bg-text-primary rounded transition-all duration-200 top-3"></span>
              </div>
            </button>
            <ul class="nav-links hidden md:flex gap-1 list-none">
              ${navLinks}
            </ul>
          </div>
          <!-- Mobile navigation menu -->
          <div class="mobile-nav-links hidden absolute top-full left-0 right-0 bg-white border-b border-border-primary shadow-lg mx-3 rounded-b-lg py-2 z-40 md:hidden">
            ${mobileNavLinks}
          </div>
        </div>
      </div>
    </nav>
  `;
}

// Get current page path for active state detection
function getCurrentPagePath() {
  const pathname = window.location.pathname;
  const filename = pathname.split('/').pop() || 'index.html';

  // Handle special cases for active state
  if (filename === '' || pathname === '/' || filename === 'index.html') return 'index.html';
  if (pathname.includes('/players/')) return 'players.html';
  if (pathname.includes('/guilds/')) return 'guilds.html';
  if (pathname.includes('/articles/')) return 'articles.html';
  if (pathname.includes('calculator')) return 'calculator.html';
  if (pathname.includes('queue')) return 'queue.html';
  if (pathname.includes('admin-content-manager')) return 'admin-content-manager.html';

  return filename;
}

// Check if link should be active
function isActiveLink(linkHref, currentPath) {
  const linkFile = linkHref.split('/').pop();
  const currentFile = currentPath.split('/').pop();
  const pathname = window.location.pathname;

  // Handle special cases
  if (linkFile === 'index.html' && (currentFile === 'index.html' || pathname === '/' || pathname === '')) return true;
  if (linkFile === 'players.html' && pathname.includes('/players/')) return true;
  if (linkFile === 'guilds.html' && pathname.includes('/guilds/')) return true;
  if (linkFile === 'articles.html' && pathname.includes('/articles/')) return true;
  if (linkFile === 'calculator.html' && (pathname.includes('calculator') || currentFile.includes('calculator'))) return true;
  if (linkFile === 'queue.html' && (pathname.includes('queue') || currentFile.includes('queue'))) return true;
  if (linkFile === 'admin-content-manager.html' && pathname.includes('admin-content-manager')) return true;

  return linkFile === currentFile;
}

// Get absolute path for GitHub Pages or relative path for local development
function getAbsolutePath(targetHref) {
  // Check if we're on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');

  if (isGitHubPages) {
    // For GitHub Pages, use the repository base path
    const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
    const repoName = pathSegments[0]; // First segment is the repository name
    return `/${repoName}/${targetHref}`;
  } else {
    // For local development, use relative paths
    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    // Remove filename to get directory depth
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && lastSegment.includes('.html')) {
      pathSegments.pop();
    }

    const directoryDepth = pathSegments.length;
    return directoryDepth > 0 ? '../'.repeat(directoryDepth) + targetHref : targetHref;
  }
}

// Calculate relative path based on current location
function getRelativePath(targetHref, currentPath) {
  // Get the actual current pathname
  const pathname = window.location.pathname;

  // Handle GitHub Pages - detect if we're on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');

  if (isGitHubPages) {
    // For GitHub Pages, use absolute paths within the repository
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    // Find repository name (first segment after github.io)
    const repoName = pathSegments[0];

    // Check if we're in a subdirectory (more than just repo/file.html)
    const hasSubdirectories = pathSegments.length > 2 ||
                             (pathSegments.length === 2 && !pathSegments[1].includes('.html'));

    if (hasSubdirectories) {
      // From subdirectory: navigate up to repo root, then to target
      const currentDir = pathSegments.slice(1, -1); // Remove repo and filename
      return '../'.repeat(currentDir.length) + targetHref;
    } else {
      // From repo root: direct relative path
      return targetHref;
    }
  } else {
    // For local development, use simple relative paths
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    // Remove filename to get directory depth
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && lastSegment.includes('.html')) {
      pathSegments.pop();
    }

    const directoryDepth = pathSegments.length;
    return directoryDepth > 0 ? '../'.repeat(directoryDepth) + targetHref : targetHref;
  }
}

// Initialize navbar when DOM is loaded
function initializeNavbar() {
  // Debug logging for navbar links
  console.log('🔧 Initializing BAMACO Navbar...');
  console.log('📋 Configured links:', NAVBAR_CONFIG.links.map(link => link.text));

  // Debug logging for hosted environments
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.log('🌐 Navbar Debug Info:');
    console.log('Current hostname:', window.location.hostname);
    console.log('Current pathname:', window.location.pathname);
    console.log('Detected path:', getCurrentPagePath());

    // Show generated paths for each link
    NAVBAR_CONFIG.links.forEach(link => {
      const generatedPath = getRelativePath(link.href, getCurrentPagePath());
      console.log(`${link.text} → ${generatedPath}`);
    });
  }

  // Find where to inject navbar - look for existing navbar or body start
  let navbarTarget = document.querySelector('nav.navbar');

  if (navbarTarget) {
    // Replace existing navbar
    navbarTarget.outerHTML = generateNavbar();
  } else {
    // Insert at beginning of body
    const body = document.body;
    if (body) {
      body.insertAdjacentHTML('afterbegin', generateNavbar());
    }
  }

  // Initialize mobile navigation after navbar is injected
  initializeMobileNavigation();
}

// Mobile navigation functionality with Tailwind classes
function initializeMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNavLinks = document.querySelector('.mobile-nav-links');

  if (navToggle && mobileNavLinks) {
    // Remove any existing event listeners
    navToggle.replaceWith(navToggle.cloneNode(true));
    const newNavToggle = document.querySelector('.nav-toggle');

    // Toggle menu on hamburger click
    newNavToggle.addEventListener('click', () => {
      const isActive = newNavToggle.classList.toggle('active');
      mobileNavLinks.classList.toggle('active');

      // Animate hamburger icon
      const spans = newNavToggle.querySelectorAll('span');
      if (isActive) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';

        // Show mobile menu
        mobileNavLinks.classList.remove('hidden');
        mobileNavLinks.classList.add('flex', 'flex-col');
        console.log('📱 Mobile menu opened - links available:', mobileNavLinks.querySelectorAll('a').length);
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';

        // Hide mobile menu
        mobileNavLinks.classList.add('hidden');
        mobileNavLinks.classList.remove('flex', 'flex-col');
        console.log('📱 Mobile menu closed');
      }
    });

    // Close menu when clicking a mobile link
    mobileNavLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        newNavToggle.classList.remove('active');
        mobileNavLinks.classList.remove('active', 'flex', 'flex-col');
        mobileNavLinks.classList.add('hidden');

        // Reset hamburger icon
        const spans = newNavToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!newNavToggle.contains(e.target) && !mobileNavLinks.contains(e.target)) {
        newNavToggle.classList.remove('active');
        mobileNavLinks.classList.remove('active', 'flex', 'flex-col');
        mobileNavLinks.classList.add('hidden');

        // Reset hamburger icon
        const spans = newNavToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeNavbar);

// Export functions for manual use if needed
window.BAMACO_Navbar = {
  init: initializeNavbar,
  regenerate: () => {
    initializeNavbar();
  },
  config: NAVBAR_CONFIG
};
