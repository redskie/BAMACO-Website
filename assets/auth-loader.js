/**
 * ============================================================================
 * BAMACO AUTH LOADER - Include on every page
 * ============================================================================
 * 
 * This script handles the authentication state for the entire site.
 * It shows the auth modal on first visit if not logged in.
 * 
 * Include order:
 * 1. assets/auth.js
 * 2. assets/auth-modal.js
 * 3. assets/user-menu.js
 * 4. assets/auth-loader.js (this file)
 */

(function() {
  'use strict';

  // Check if user is logged in or has chosen guest mode
  const session = localStorage.getItem('bamaco_session');
  const guestMode = sessionStorage.getItem('bamaco_guest_mode');
  
  let isLoggedIn = false;
  let user = null;

  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed.expiresAt > Date.now()) {
        isLoggedIn = true;
        user = parsed.user;
      } else {
        // Session expired, clear it
        localStorage.removeItem('bamaco_session');
      }
    } catch (e) {
      localStorage.removeItem('bamaco_session');
    }
  }

  // If not logged in and not in guest mode, show auth modal
  if (!isLoggedIn && !guestMode) {
    // Wait for auth modal to be available
    const checkAndShowModal = () => {
      if (typeof window.authModal !== 'undefined' && window.authModal.show) {
        window.authModal.show();
      } else if (typeof AuthModal !== 'undefined') {
        // Try to create auth modal
        window.authModal = new AuthModal();
        window.authModal.show();
      } else {
        // Auth modal not loaded yet, try again
        setTimeout(checkAndShowModal, 100);
      }
    };

    // Don't show modal on auth-exempt pages
    const exemptPages = ['queue-admin.html', 'create-profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!exemptPages.includes(currentPage)) {
      document.addEventListener('DOMContentLoaded', checkAndShowModal);
    }
  }

  // Expose auth state globally
  window.BAMACO_AUTH = {
    isLoggedIn,
    user,
    
    // Check if user is admin
    isAdmin() {
      return user?.isAdmin || false;
    },
    
    // Get current user
    getUser() {
      return user;
    },
    
    // Require login (shows modal if not logged in)
    requireLogin(callback) {
      if (isLoggedIn) {
        if (callback) callback(user);
        return true;
      }
      
      if (typeof window.authModal !== 'undefined') {
        window.authModal.show('login');
      }
      return false;
    },
    
    // Logout
    logout() {
      localStorage.removeItem('bamaco_session');
      localStorage.removeItem('bamaco_remember_me');
      sessionStorage.removeItem('bamaco_guest_mode');
      window.location.reload();
    }
  };

  // Console log for debugging
  if (isLoggedIn) {
    console.log('🔐 BAMACO Auth: Logged in as', user?.ign || 'Unknown');
  } else if (guestMode) {
    console.log('🔐 BAMACO Auth: Guest mode');
  } else {
    console.log('🔐 BAMACO Auth: Not authenticated');
  }

})();