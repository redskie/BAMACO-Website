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

// Generate navbar HTML
function generateNavbar() {
  const currentPath = getCurrentPagePath();
  
  const navLinks = NAVBAR_CONFIG.links.map(link => {
    const isActive = isActiveLink(link.href, currentPath) ? ' class="active"' : '';
    const href = getAbsolutePath(link.href);
    return `<li><a href="${href}"${isActive}>${link.text}</a></li>`;
  }).join('');

  return `
    <nav class="navbar">
      <div class="container">
        <div class="nav-brand">
          <h1>${NAVBAR_CONFIG.brand.title}</h1>
          <span class="brand-subtitle">${NAVBAR_CONFIG.brand.subtitle}</span>
        </div>
        <button class="nav-toggle" aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-links">
          ${navLinks}
        </ul>
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

// Mobile navigation functionality
function initializeMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    // Remove any existing event listeners
    navToggle.replaceWith(navToggle.cloneNode(true));
    const newNavToggle = document.querySelector('.nav-toggle');
    
    // Toggle menu on hamburger click
    newNavToggle.addEventListener('click', () => {
      newNavToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        newNavToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!newNavToggle.contains(e.target) && !navLinks.contains(e.target)) {
        newNavToggle.classList.remove('active');
        navLinks.classList.remove('active');
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
