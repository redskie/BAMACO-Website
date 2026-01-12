/**
 * ============================================================================
 * BAMACO PLAYERS DATABASE MODULE
 * ============================================================================
 * 
 * Firebase Realtime Database operations for player profiles
 * Replaces the old static HTML file system
 * 
 * Database Structure:
 * /players/{friendCode}
 *   - friendCode: string (primary key)
 *   - ign: string
 *   - name: string
 *   - nickname: string
 *   - title: string
 *   - avatarImage: string (URL)
 *   - rating: string
 *   - rank: string
 *   - age: string
 *   - motto: string
 *   - joined: string (year)
 *   - bio: string
 *   - guildId: string
 *   - achievements: array
 *   - articles: array
 *   - passwordHash: string
 *   - editKey: string
 *   - fingerprint: string
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 *   - isPublic: boolean
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  push,
  remove,
  update,
  onValue,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  limitToLast,
  startAt,
  endAt
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ5eunqdZcHJx1Leaw7IYZdH3PkPjbctg",
  authDomain: "bamaco-queue.firebaseapp.com",
  databaseURL: "https://bamaco-queue-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bamaco-queue",
  storageBucket: "bamaco-queue.firebasestorage.app",
  messagingSenderId: "683913605188",
  appId: "1:683913605188:web:2842c6031ea68dc5da8c11"
};

// Initialize Firebase (may already be initialized)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // Already initialized
  app = initializeApp(firebaseConfig, 'players-db');
}

const database = getDatabase(app);
const playersRef = ref(database, 'players');

/**
 * PlayersDB - Complete CRUD operations for player profiles
 */
class PlayersDB {
  constructor() {
    this.cache = new Map();
    this.listeners = new Map();
  }

  // ========================================================================
  // CREATE
  // ========================================================================

  /**
   * Create a new player profile
   * @param {Object} playerData - Player data object
   * @returns {Promise<Object>} - Created player data with friendCode
   */
  async createPlayer(playerData) {
    const friendCode = this.sanitizeFriendCode(playerData.friendCode);
    
    if (!friendCode) {
      throw new Error('Friend code is required');
    }

    // Check if player already exists
    const existing = await this.getPlayer(friendCode);
    if (existing) {
      throw new Error('Player with this friend code already exists');
    }

    const now = Date.now();
    const player = {
      friendCode,
      ign: playerData.ign || 'Unknown',
      name: playerData.name || playerData.fullName || '',
      nickname: playerData.nickname || '',
      title: playerData.title || playerData.motto || '',
      avatarImage: playerData.avatarImage || playerData.iconUrl || '',
      rating: playerData.rating || '0',
      rank: playerData.rank || 'Unranked',
      trophy: playerData.trophy || '',
      age: playerData.age || '',
      motto: playerData.motto || '',
      joined: playerData.joined || playerData.yearStarted || new Date().getFullYear().toString(),
      bio: playerData.bio || '',
      guildId: playerData.guildId || '',
      achievements: playerData.achievements || [],
      articles: playerData.articles || [],
      // Security fields
      passwordHash: playerData.passwordHash || '',
      editKey: playerData.editKey || this.generateEditKey(),
      fingerprint: playerData.fingerprint || '',
      // Metadata
      createdAt: now,
      updatedAt: now,
      isPublic: playerData.isPublic !== false // Default to true
    };

    const playerRef = ref(database, `players/${friendCode}`);
    await set(playerRef, player);
    
    // Clear cache
    this.cache.delete(friendCode);
    
    console.log(`✅ Player created: ${player.ign} (${friendCode})`);
    return player;
  }

  // ========================================================================
  // READ
  // ========================================================================

  /**
   * Get a single player by friend code
   * @param {string} friendCode 
   * @returns {Promise<Object|null>}
   */
  async getPlayer(friendCode) {
    const sanitized = this.sanitizeFriendCode(friendCode);
    if (!sanitized) return null;

    // Check cache first
    if (this.cache.has(sanitized)) {
      return this.cache.get(sanitized);
    }

    const playerRef = ref(database, `players/${sanitized}`);
    const snapshot = await get(playerRef);
    
    if (snapshot.exists()) {
      const player = snapshot.val();
      this.cache.set(sanitized, player);
      return player;
    }
    
    return null;
  }

  /**
   * Get all players (with optional limit)
   * @param {number} limit - Maximum number of players to return
   * @returns {Promise<Array>}
   */
  async getAllPlayers(limit = 100) {
    const playersQuery = query(playersRef, limitToFirst(limit));
    const snapshot = await get(playersQuery);
    
    const players = [];
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const player = child.val();
        if (player.isPublic !== false) {
          players.push(player);
        }
      });
    }
    
    return players;
  }

  /**
   * Search players by IGN or name
   * @param {string} searchTerm 
   * @returns {Promise<Array>}
   */
  async searchPlayers(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return this.getAllPlayers();

    const allPlayers = await this.getAllPlayers(500);
    
    return allPlayers.filter(player => {
      const ign = (player.ign || '').toLowerCase();
      const name = (player.name || '').toLowerCase();
      const nickname = (player.nickname || '').toLowerCase();
      
      return ign.includes(term) || name.includes(term) || nickname.includes(term);
    });
  }

  /**
   * Get players by guild
   * @param {string} guildId 
   * @returns {Promise<Array>}
   */
  async getPlayersByGuild(guildId) {
    const allPlayers = await this.getAllPlayers(500);
    return allPlayers.filter(player => player.guildId === guildId);
  }

  /**
   * Subscribe to real-time player list updates
   * @param {Function} callback - Called with players array on each update
   * @returns {Function} - Unsubscribe function
   */
  subscribeToPlayers(callback) {
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const players = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          const player = child.val();
          if (player.isPublic !== false) {
            players.push(player);
          }
        });
      }
      callback(players);
    });

    return unsubscribe;
  }

  /**
   * Subscribe to a single player's updates
   * @param {string} friendCode 
   * @param {Function} callback 
   * @returns {Function} - Unsubscribe function
   */
  subscribeToPlayer(friendCode, callback) {
    const sanitized = this.sanitizeFriendCode(friendCode);
    const playerRef = ref(database, `players/${sanitized}`);
    
    const unsubscribe = onValue(playerRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    });

    this.listeners.set(sanitized, unsubscribe);
    return unsubscribe;
  }

  // ========================================================================
  // UPDATE
  // ========================================================================

  /**
   * Update a player's profile
   * @param {string} friendCode 
   * @param {Object} updates - Fields to update
   * @param {string} editKey - Required for verification (unless admin)
   * @returns {Promise<Object>}
   */
  async updatePlayer(friendCode, updates, editKey = null) {
    const sanitized = this.sanitizeFriendCode(friendCode);
    const player = await this.getPlayer(sanitized);
    
    if (!player) {
      throw new Error('Player not found');
    }

    // Verify edit key (unless bypassed by admin)
    if (editKey && player.editKey !== editKey) {
      throw new Error('Invalid edit key');
    }

    // Prevent updating protected fields
    const protectedFields = ['friendCode', 'createdAt', 'editKey'];
    protectedFields.forEach(field => delete updates[field]);

    // Add update timestamp
    updates.updatedAt = Date.now();

    const playerRef = ref(database, `players/${sanitized}`);
    await update(playerRef, updates);
    
    // Clear cache
    this.cache.delete(sanitized);
    
    console.log(`✅ Player updated: ${player.ign} (${sanitized})`);
    return { ...player, ...updates };
  }

  /**
   * Update player rating from MaiMai API
   * @param {string} friendCode 
   * @param {Object} apiData - Data from MaiMai API
   */
  async updateFromAPI(friendCode, apiData) {
    const updates = {
      ign: apiData.ign || apiData.name,
      rating: apiData.rating,
      trophy: apiData.trophy,
      avatarImage: apiData.icon_url || apiData.iconUrl,
      updatedAt: Date.now()
    };

    return this.updatePlayer(friendCode, updates, null);
  }

  // ========================================================================
  // DELETE
  // ========================================================================

  /**
   * Delete a player profile
   * @param {string} friendCode 
   * @param {string} editKey - Required for verification
   */
  async deletePlayer(friendCode, editKey) {
    const sanitized = this.sanitizeFriendCode(friendCode);
    const player = await this.getPlayer(sanitized);
    
    if (!player) {
      throw new Error('Player not found');
    }

    // Verify edit key
    if (player.editKey !== editKey) {
      throw new Error('Invalid edit key');
    }

    const playerRef = ref(database, `players/${sanitized}`);
    await remove(playerRef);
    
    // Clear cache and listeners
    this.cache.delete(sanitized);
    if (this.listeners.has(sanitized)) {
      this.listeners.get(sanitized)();
      this.listeners.delete(sanitized);
    }
    
    console.log(`🗑️ Player deleted: ${player.ign} (${sanitized})`);
  }

  // ========================================================================
  // AUTHENTICATION HELPERS
  // ========================================================================

  /**
   * Verify password for a player
   * @param {string} friendCode 
   * @param {string} password 
   * @returns {Promise<boolean>}
   */
  async verifyPassword(friendCode, password) {
    const player = await this.getPlayer(friendCode);
    if (!player || !player.passwordHash) return false;

    const [salt, hash] = player.passwordHash.split(':');
    const inputHash = await this.hashPassword(password, salt);
    
    return inputHash === player.passwordHash;
  }

  /**
   * Hash a password with salt
   * @param {string} password 
   * @param {string} salt - Optional, generates new if not provided
   * @returns {Promise<string>} - Format: salt:hash
   */
  async hashPassword(password, salt = null) {
    if (!salt) {
      salt = this.generateSalt();
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(salt + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${salt}:${hash}`;
  }

  /**
   * Check if a friend code has a profile
   * @param {string} friendCode 
   * @returns {Promise<boolean>}
   */
  async hasProfile(friendCode) {
    const player = await this.getPlayer(friendCode);
    return player !== null;
  }

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  sanitizeFriendCode(code) {
    if (!code) return null;
    return String(code).replace(/\D/g, '').trim();
  }

  generateEditKey() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
    return key;
  }

  generateSalt() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get player stats summary
   * @returns {Promise<Object>}
   */
  async getStats() {
    const players = await this.getAllPlayers(1000);
    
    const totalRating = players.reduce((sum, p) => sum + (parseInt(p.rating) || 0), 0);
    const avgRating = players.length > 0 ? Math.round(totalRating / players.length) : 0;
    
    return {
      totalPlayers: players.length,
      averageRating: avgRating,
      topRating: Math.max(...players.map(p => parseInt(p.rating) || 0)),
      activeGuilds: [...new Set(players.map(p => p.guildId).filter(Boolean))].length
    };
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
  }
}

// Create singleton instance
const playersDB = new PlayersDB();

// Export for use in other modules
export { playersDB, PlayersDB };

// Also attach to window for non-module scripts
if (typeof window !== 'undefined') {
  window.playersDB = playersDB;
}
