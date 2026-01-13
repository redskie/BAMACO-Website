/**
 * ============================================================================
 * BAMACO AUTHENTICATION SYSTEM
 * ============================================================================
 * 
 * Complete login/registration system with Firebase integration
 * Supports: Login, Guest mode, Account creation, Password management
 * 
 * Now integrated with players-db.js for unified profile management
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  signInWithCustomToken,
  signOut,
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  push,
  onValue,
  update,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Import PlayersDB for profile integration
import { playersDB } from './players-db.js';

// Firebase configuration (using existing config)
const firebaseConfig = {
  apiKey: "AIzaSyCQ5eunqdZcHJx1Leaw7IYZdH3PkPjbctg",
  authDomain: "bamaco-queue.firebaseapp.com",
  databaseURL: "https://bamaco-queue-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bamaco-queue",
  storageBucket: "bamaco-queue.firebasestorage.app",
  messagingSenderId: "683913605188",
  appId: "1:683913605188:web:2842c6031ea68dc5da8c11"
};

// Initialize Firebase (handle already initialized case)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // Already initialized, use named app
  app = initializeApp(firebaseConfig, 'bamaco-auth');
}
const auth = getAuth(app);
const database = getDatabase(app);

// Database references
const usersRef = ref(database, 'users');
const playersRef = ref(database, 'players');
const queueRequestsRef = ref(database, 'queueRequests');
const adminNotificationsRef = ref(database, 'adminNotifications');
const reportsRef = ref(database, 'reports');

class BAMACOAuth {
  constructor() {
    this.currentUser = null;
    this.isAdmin = false;
    this.isGuest = true;
    
    this.init();
  }

  async init() {
    // Check for existing session
    this.checkExistingSession();
    
    // Listen for auth state changes
    this.setupAuthListener();
  }

  // ========================================================================
  // SESSION MANAGEMENT
  // ========================================================================

  checkExistingSession() {
    const savedSession = localStorage.getItem('bamaco_session');
    const rememberMe = localStorage.getItem('bamaco_remember_me');
    
    if (savedSession && rememberMe === 'true') {
      try {
        const session = JSON.parse(savedSession);
        if (session.expiresAt > Date.now()) {
          this.currentUser = session.user;
          this.isGuest = false;
          return true;
        }
      } catch (e) {
        this.clearSession();
      }
    }
    
    // Check if device has profile cookie
    const profileCookie = this.getProfileCookie();
    if (profileCookie) {
      this.showSetPasswordPrompt(profileCookie);
    }
    
    return false;
  }

  saveSession(user, rememberMe = false) {
    const session = {
      user: {
        friendCode: user.friendCode,
        ign: user.ign,
        isAdmin: user.isAdmin || false
      },
      expiresAt: rememberMe 
        ? Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        : Date.now() + (24 * 60 * 60 * 1000) // 1 day
    };
    
    localStorage.setItem('bamaco_session', JSON.stringify(session));
    localStorage.setItem('bamaco_remember_me', rememberMe.toString());
  }

  clearSession() {
    localStorage.removeItem('bamaco_session');
    localStorage.removeItem('bamaco_remember_me');
    this.currentUser = null;
    this.isGuest = true;
    this.isAdmin = false;
  }

  setProfileCookie(friendCode, ign) {
    const profileData = { friendCode, ign, createdAt: Date.now() };
    localStorage.setItem('bamaco_profile_owner', JSON.stringify(profileData));
  }

  getProfileCookie() {
    const data = localStorage.getItem('bamaco_profile_owner');
    return data ? JSON.parse(data) : null;
  }

  setupAuthListener() {
    // Custom auth state management
    window.addEventListener('storage', (e) => {
      if (e.key === 'bamaco_session') {
        this.checkExistingSession();
        this.updateUI();
      }
    });
  }

  // ========================================================================
  // PASSWORD UTILITIES
  // ========================================================================

  validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'bamaco_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ========================================================================
  // AUTHENTICATION METHODS
  // ========================================================================

  async login(friendCode, password, rememberMe = false) {
    try {
      const cleanCode = friendCode.replace(/\D/g, '');
      
      if (cleanCode.length !== 15) {
        return { success: false, error: 'Invalid friend code format' };
      }

      // First, try to authenticate against the players table (new system)
      const player = await playersDB.getPlayer(cleanCode);
      
      if (player && player.passwordHash) {
        // Verify password using players-db method
        const isValid = await playersDB.verifyPassword(password, player.passwordHash);
        
        if (isValid) {
          // Login successful via players table
          this.currentUser = {
            friendCode: cleanCode,
            ign: player.ign,
            isAdmin: player.isAdmin || false,
            hasProfile: true
          };
          this.isGuest = false;
          this.isAdmin = player.isAdmin || false;
          
          this.saveSession(this.currentUser, rememberMe);
          
          // Store edit key for profile editing
          if (player.editKey) {
            localStorage.setItem('profileEditKey', player.editKey);
          }
          
          return { success: true, user: this.currentUser };
        }
      }

      // Fall back to legacy users table
      const userRef = ref(database, `users/${cleanCode}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        return { success: false, error: 'Account not found. Please create an account first.' };
      }

      const userData = snapshot.val();
      const hashedPassword = await this.hashPassword(password);
      
      if (userData.passwordHash !== hashedPassword) {
        return { success: false, error: 'Incorrect password' };
      }

      // Login successful via users table
      this.currentUser = {
        friendCode: cleanCode,
        ign: userData.ign,
        isAdmin: userData.isAdmin || false,
        hasProfile: !!player // Check if they also have a player profile
      };
      this.isGuest = false;
      this.isAdmin = userData.isAdmin || false;
      
      this.saveSession(this.currentUser, rememberMe);
      
      // Update last login
      await update(userRef, { lastLogin: serverTimestamp() });
      
      return { success: true, user: this.currentUser };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  async register(friendCode, password, apiData) {
    try {
      const cleanCode = friendCode.replace(/\D/g, '');
      
      // Validate password
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, errors: passwordValidation.errors };
      }

      // Check if user already exists
      const userRef = ref(database, `users/${cleanCode}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return { success: false, error: 'Account already exists. Please login instead.' };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user account
      const userData = {
        friendCode: cleanCode,
        ign: apiData.ign,
        rating: apiData.rating,
        title: apiData.title || null,
        trophy: apiData.trophy || null,
        iconUrl: apiData.icon_url || null,
        passwordHash: hashedPassword,
        isAdmin: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };

      await set(userRef, userData);

      // Set profile cookie
      this.setProfileCookie(cleanCode, apiData.ign);

      // Auto login after registration
      this.currentUser = {
        friendCode: cleanCode,
        ign: apiData.ign,
        isAdmin: false
      };
      this.isGuest = false;
      
      this.saveSession(this.currentUser, true);

      return { success: true, user: this.currentUser };
      
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  async setPassword(friendCode, password) {
    try {
      const cleanCode = friendCode.replace(/\D/g, '');
      
      // Validate password
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, errors: passwordValidation.errors };
      }

      const hashedPassword = await this.hashPassword(password);
      
      const userRef = ref(database, `users/${cleanCode}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        // Update existing user
        await update(userRef, { passwordHash: hashedPassword });
      } else {
        // Need to get user data from API first
        return { success: false, error: 'Please validate your friend code first' };
      }

      return { success: true };
      
    } catch (error) {
      console.error('Set password error:', error);
      return { success: false, error: 'Failed to set password. Please try again.' };
    }
  }

  logout() {
    this.clearSession();
    this.updateUI();
    window.location.reload();
  }

  continueAsGuest() {
    this.isGuest = true;
    this.currentUser = null;
    sessionStorage.setItem('bamaco_guest_mode', 'true');
    this.hideAuthModal();
  }

  // ========================================================================
  // QUEUE REQUEST SYSTEM
  // ========================================================================

  async requestQueue() {
    if (this.isGuest || !this.currentUser) {
      return { success: false, error: 'Please login to request queue' };
    }

    try {
      const requestRef = push(queueRequestsRef);
      const request = {
        id: requestRef.key,
        friendCode: this.currentUser.friendCode,
        ign: this.currentUser.ign,
        status: 'pending',
        requestedAt: serverTimestamp()
      };

      await set(requestRef, request);

      // Send notification to all admins
      await this.notifyAdmins({
        type: 'queue_request',
        requestId: requestRef.key,
        playerIgn: this.currentUser.ign,
        message: `${this.currentUser.ign} is requesting to join the queue`
      });

      return { success: true, requestId: requestRef.key };
      
    } catch (error) {
      console.error('Queue request error:', error);
      return { success: false, error: 'Failed to submit queue request' };
    }
  }

  async notifyAdmins(notification) {
    const notifRef = push(adminNotificationsRef);
    await set(notifRef, {
      ...notification,
      id: notifRef.key,
      read: false,
      createdAt: serverTimestamp()
    });
  }

  // Admin: Handle queue request
  async handleQueueRequest(requestId, approved) {
    if (!this.isAdmin) {
      return { success: false, error: 'Admin access required' };
    }

    try {
      const requestRef = ref(database, `queueRequests/${requestId}`);
      const snapshot = await get(requestRef);
      
      if (!snapshot.exists()) {
        return { success: false, error: 'Request not found' };
      }

      const request = snapshot.val();

      if (approved) {
        // Add to queue
        const queueRef = ref(database, 'queue');
        const newEntry = push(queueRef);
        await set(newEntry, {
          name: request.ign,
          friendCode: request.friendCode,
          joinedAt: serverTimestamp(),
          paid: false
        });
      }

      // Update request status
      await update(requestRef, { 
        status: approved ? 'approved' : 'denied',
        handledAt: serverTimestamp()
      });

      return { success: true };
      
    } catch (error) {
      console.error('Handle request error:', error);
      return { success: false, error: 'Failed to process request' };
    }
  }

  // ========================================================================
  // PROFILE EDITING (Using players-db.js)
  // ========================================================================

  async updateProfile(updates) {
    if (this.isGuest || !this.currentUser) {
      return { success: false, error: 'Please login to edit profile' };
    }

    try {
      // Get the edit key from localStorage
      const editKey = localStorage.getItem('profileEditKey');
      
      // Try to update via playersDB (new system)
      const player = await playersDB.getPlayer(this.currentUser.friendCode);
      
      if (player) {
        // Use playersDB to update
        const allowedFields = ['motto', 'bio', 'joined', 'name', 'nickname', 'age', 'guildId'];
        const filteredUpdates = {};
        
        for (const field of allowedFields) {
          if (updates[field] !== undefined) {
            filteredUpdates[field] = updates[field];
          }
        }
        
        const result = await playersDB.updatePlayer(
          this.currentUser.friendCode,
          filteredUpdates,
          editKey
        );
        
        if (result) {
          return { success: true };
        }
      }

      // Fall back to legacy users table
      const allowedFields = ['motto', 'bio', 'yearStarted', 'fullName'];
      const filteredUpdates = {};
      
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      }

      const userRef = ref(database, `users/${this.currentUser.friendCode}`);
      await update(userRef, {
        ...filteredUpdates,
        updatedAt: serverTimestamp()
      });

      return { success: true };
      
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  /**
   * Get current user's player profile
   */
  async getMyProfile() {
    if (this.isGuest || !this.currentUser) {
      return null;
    }
    
    return await playersDB.getPlayer(this.currentUser.friendCode);
  }

  /**
   * Check if current user can edit a specific profile
   */
  canEditProfile(friendCode) {
    if (this.isGuest || !this.currentUser) {
      return false;
    }
    
    // Admin can edit any profile
    if (this.isAdmin) {
      return true;
    }
    
    // User can only edit their own profile
    return this.currentUser.friendCode === friendCode;
  }

  // ========================================================================
  // REPORTS & REQUESTS (GitHub Issues)
  // ========================================================================

  async submitReport(type, title, description) {
    if (this.isGuest || !this.currentUser) {
      return { success: false, error: 'Please login to submit reports' };
    }

    try {
      // Store in Firebase first
      const reportRef = push(reportsRef);
      const report = {
        id: reportRef.key,
        type, // 'bug', 'feature', 'recommendation', 'other'
        title,
        description,
        submittedBy: this.currentUser.ign,
        friendCode: this.currentUser.friendCode,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await set(reportRef, report);

      // Create GitHub issue (this would need a backend service or GitHub App)
      // For now, we'll store in Firebase and let admins create issues manually
      
      return { success: true, reportId: reportRef.key };
      
    } catch (error) {
      console.error('Submit report error:', error);
      return { success: false, error: 'Failed to submit report' };
    }
  }

  // ========================================================================
  // ADMIN NOTIFICATIONS LISTENER
  // ========================================================================

  setupAdminNotifications(callback) {
    if (!this.isAdmin) return;

    onValue(adminNotificationsRef, (snapshot) => {
      const notifications = [];
      snapshot.forEach((child) => {
        const notif = child.val();
        if (!notif.read) {
          notifications.push(notif);
        }
      });
      callback(notifications);
    });
  }

  async markNotificationRead(notificationId) {
    if (!this.isAdmin) return;
    
    const notifRef = ref(database, `adminNotifications/${notificationId}`);
    await update(notifRef, { read: true });
  }

  // ========================================================================
  // UI HELPERS
  // ========================================================================

  updateUI() {
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('bamaco-auth-change', {
      detail: {
        isLoggedIn: !this.isGuest,
        user: this.currentUser,
        isAdmin: this.isAdmin
      }
    }));
  }

  hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showSetPasswordPrompt(profileData) {
    // Will be handled by UI component
    window.dispatchEvent(new CustomEvent('bamaco-show-set-password', {
      detail: profileData
    }));
  }

  // Check if user is logged in
  isLoggedIn() {
    return !this.isGuest && this.currentUser !== null;
  }

  // Get current user
  getUser() {
    return this.currentUser;
  }
}

// Export singleton instance
const bamacoAuth = new BAMACOAuth();
export default bamacoAuth;
export { BAMACOAuth };