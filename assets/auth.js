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

  getSubtleCrypto() {
    // Prefer secure-context Web Crypto; fall back to prefixed implementations if present
    if (typeof crypto !== 'undefined') {
      return crypto.subtle || crypto.webkitSubtle || (crypto.msCrypto && crypto.msCrypto.subtle);
    }
    if (typeof window !== 'undefined' && window.crypto) {
      return window.crypto.subtle || window.crypto.webkitSubtle || (window.crypto.msCrypto && window.crypto.msCrypto.subtle);
    }
    return null;
  }

  async sha256Fallback(message) {
    // Lightweight SHA-256 implementation for non-secure contexts lacking crypto.subtle
    const utf8 = new TextEncoder().encode(message);

    // Helper functions
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));

    // Initial hash values
    const h = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    // Round constants
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    // Pre-processing
    const withOne = new Uint8Array(((utf8.length + 9 + 63) >> 6) << 6);
    withOne.set(utf8);
    withOne[utf8.length] = 0x80;
    const bitLen = utf8.length * 8;
    const view = new DataView(withOne.buffer);
    view.setUint32(withOne.length - 4, bitLen);

    const w = new Uint32Array(64);

    for (let i = 0; i < withOne.length; i += 64) {
      for (let j = 0; j < 16; j++) {
        w[j] = view.getUint32(i + j * 4);
      }
      for (let j = 16; j < 64; j++) {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
      }

      let [a, b, c, d, e, f, g, h0] = h;

      for (let j = 0; j < 64; j++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h0 + S1 + ch + k[j] + w[j]) >>> 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;

        h0 = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
      }

      h[0] = (h[0] + a) >>> 0;
      h[1] = (h[1] + b) >>> 0;
      h[2] = (h[2] + c) >>> 0;
      h[3] = (h[3] + d) >>> 0;
      h[4] = (h[4] + e) >>> 0;
      h[5] = (h[5] + f) >>> 0;
      h[6] = (h[6] + g) >>> 0;
      h[7] = (h[7] + h0) >>> 0;
    }

    // Convert to hex string
    return h.map(x => x.toString(16).padStart(8, '0')).join('');
  }

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
    const saltPassword = password + 'bamaco_salt_2026';
    const subtle = this.getSubtleCrypto();

    if (subtle && typeof subtle.digest === 'function') {
      const encoder = new TextEncoder();
      const data = encoder.encode(saltPassword);
      const hashBuffer = await subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Fallback for insecure contexts (e.g., file://) where subtle is unavailable
    return await this.sha256Fallback(saltPassword);
  }

  // ========================================================================
  // AUTHENTICATION METHODS
  // ========================================================================

  async login(friendCode, password, rememberMe = false) {
    try {
      const cleanCode = friendCode.replace(/\D/g, '');

      // Authenticate against Firestore players (canonical)
      const player = await playersDB.getPlayer(cleanCode);

      if (player && player.passwordHash) {
        const isValid = await playersDB.verifyPassword(cleanCode, password);
        if (!isValid) {
          return { success: false, error: 'Incorrect password' };
        }

        this.currentUser = {
          friendCode: cleanCode,
          ign: player.ign,
          isAdmin: player.isAdmin || false,
          hasProfile: true
        };
        this.isGuest = false;
        this.isAdmin = player.isAdmin || false;

        this.saveSession(this.currentUser, rememberMe);

        if (player.editKey) {
          localStorage.setItem('profileEditKey', player.editKey);
        }

        return { success: true, user: this.currentUser };
      }

      return { success: false, error: 'Profile not found. Please create a profile first.' };

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

      // Ensure friend code is unique in Firestore (canonical)
      const existing = await playersDB.getPlayer(cleanCode);
      if (existing) {
        return { success: false, error: 'Account already exists. Please login instead.' };
      }

      // Hash password using players DB format (salt:hash)
      const passwordHash = await playersDB.hashPassword(password);

      // Create player profile in Firestore (same as create-profile flow)
      const playerData = {
        friendCode: cleanCode,
        ign: apiData?.ign || 'Unknown',
        name: apiData?.ign || '',
        nickname: apiData?.ign || '',
        title: apiData?.title || apiData?.trophy || '',
        avatarImage: apiData?.avatar_url || apiData?.icon_url || apiData?.iconUrl || apiData?.avatarImage || apiData?.icon || '',
        rating: apiData?.rating || '0',
        trophy: apiData?.trophy || '',
        passwordHash,
        isAdmin: false,
        adminRole: null,
        isPublic: true
      };

      const player = await playersDB.createPlayer(playerData);

      // Set profile cookie
      this.setProfileCookie(cleanCode, player.ign);

      // Auto login after registration
      this.currentUser = {
        friendCode: cleanCode,
        ign: player.ign,
        isAdmin: false,
        hasProfile: true
      };
      this.isGuest = false;
      this.isAdmin = false;

      this.saveSession(this.currentUser, true);
      if (player.editKey) {
        localStorage.setItem('profileEditKey', player.editKey);
      }

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

      const player = await playersDB.getPlayer(cleanCode);
      if (!player) {
        return { success: false, error: 'Profile not found. Please create a profile first.' };
      }

      const editKey = localStorage.getItem('profileEditKey');
      if (!editKey && this.currentUser?.friendCode !== cleanCode) {
        return { success: false, error: 'Not authorized to change this password.' };
      }

      const hashedPassword = await playersDB.hashPassword(password);
      await playersDB.updatePlayer(cleanCode, { passwordHash: hashedPassword }, editKey || null);

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
      const editKey = localStorage.getItem('profileEditKey');

      const player = await playersDB.getPlayer(this.currentUser.friendCode);

      if (!player) {
        return { success: false, error: 'Profile not found. Please create a profile first.' };
      }

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

      return { success: false, error: 'Failed to update profile' };

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
