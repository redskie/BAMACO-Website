/**
 * ============================================================================
 * BAMACO PLAYERS DATABASE MODULE
 * ============================================================================
 *
 * Firebase Firestore operations for player profiles
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
 *   - achievementIds: array<string> (unique achievement IDs assigned to this player)
 *   - articleIds: array<string> (unique article IDs assigned to this player)
 *   - passwordHash: string
 *   - editKey: string
 *   - fingerprint: string
 *   - isAdmin: boolean (admin privileges)
 *   - adminRole: string (admin, moderator, owner)
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 *   - isPublic: boolean
 */

import { playersCollection } from '../config/firebase-config.js';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  limit
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Import ID-based systems
import { achievementsDB } from './achievements-db.js';
import { articlesIdDB } from './articles-id-db.js';

// Firestore players collection acts as canonical store
const playersRef = playersCollection;

/**
 * PlayersDB - Complete CRUD operations for player profiles
 */
class PlayersDB {
  constructor() {
    this.cache = new Map();
    this.listeners = new Map();
  }

  // ------------------------------------------------------------------------
  // CRYPTO HELPERS (with fallback for non-secure contexts)
  // ------------------------------------------------------------------------

  getSubtleCrypto() {
    if (typeof crypto !== 'undefined') {
      return crypto.subtle || crypto.webkitSubtle || (crypto.msCrypto && crypto.msCrypto.subtle);
    }
    if (typeof window !== 'undefined' && window.crypto) {
      return window.crypto.subtle || window.crypto.webkitSubtle || (window.crypto.msCrypto && window.crypto.msCrypto.subtle);
    }
    return null;
  }

  async sha256Hex(message) {
    // Lightweight SHA-256 fallback (returns hex string)
    const utf8 = new TextEncoder().encode(message);
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));

    const h = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

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

    return h.map(x => x.toString(16).padStart(8, '0')).join('');
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
      title: playerData.title || playerData.trophy || playerData.motto || '',
      avatarImage: playerData.avatarImage || playerData.avatar_url || playerData.icon_url || playerData.iconUrl || '',
      rating: playerData.rating || '0',
      rank: playerData.rank || 'Unranked',
      trophy: playerData.trophy || '',
      age: playerData.age || '',
      motto: playerData.motto || '',
      joined: playerData.joined || playerData.yearStarted || new Date().getFullYear().toString(),
      bio: playerData.bio || '',
      guildId: playerData.guildId || '',
      // ID-based arrays (replaces old achievements/articles arrays)
      achievementIds: playerData.achievementIds || [],
      articleIds: playerData.articleIds || [],
      // Legacy support (will be migrated to IDs)
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

    const playerDoc = doc(playersRef, friendCode);
    await setDoc(playerDoc, player);

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

    const playerDoc = doc(playersRef, sanitized);
    const snapshot = await getDoc(playerDoc);
    if (!snapshot.exists()) return null;

    const player = snapshot.data();
    this.cache.set(sanitized, player);
    return player;
  }

  /**
   * Get all players (with optional limit)
   * @param {number} limit - Maximum number of players to return
   * @returns {Promise<Array>}
   */
  async getAllPlayers(limitCount = 100) {
    const playersQuery = query(playersRef, limit(limitCount));
    const snapshot = await getDocs(playersQuery);
    const players = snapshot.docs
      .map((docSnap) => docSnap.data())
      .filter((player) => player.isPublic !== false);

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
    const unsubscribe = onSnapshot(playersRef, (snapshot) => {
      const players = snapshot.docs
        .map((docSnap) => docSnap.data())
        .filter((player) => player.isPublic !== false);
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
    const playerDoc = doc(playersRef, sanitized);
    const unsubscribe = onSnapshot(playerDoc, (snapshot) => {
      callback(snapshot.exists() ? snapshot.data() : null);
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

    const playerDoc = doc(playersRef, sanitized);
    await updateDoc(playerDoc, updates);

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
      title: apiData.title || apiData.trophy,
      avatarImage: apiData.avatar_url || apiData.icon_url || apiData.iconUrl || apiData.avatarImage || apiData.icon,
      updatedAt: Date.now()
    };

    // Drop undefined/null to avoid overwriting existing data with empties
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined || updates[key] === null) {
        delete updates[key];
      }
    });

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

    const playerDoc = doc(playersRef, sanitized);
    await deleteDoc(playerDoc);

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

    const subtle = this.getSubtleCrypto();
    const message = salt + password;

    if (subtle && typeof subtle.digest === 'function') {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `${salt}:${hash}`;
    }

    // Fallback (non-secure contexts)
    const hash = await this.sha256Hex(message);

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

  // ============================================================================
  // ID-BASED ACHIEVEMENT AND ARTICLE MANAGEMENT
  // ============================================================================

  /**
   * Assign an achievement to a player
   * @param {string} friendCode - Player's friend code
   * @param {string} achievementId - Unique achievement ID
   * @returns {Promise<boolean>} - Success status
   */
  async assignAchievement(friendCode, achievementId) {
    try {
      // Check if player exists
      const player = await this.getPlayer(friendCode);
      if (!player) {
        throw new Error('Player not found');
      }

      // Assign the achievement in achievements DB
      await achievementsDB.assignAchievement(achievementId, friendCode);

      // Add to player's achievement IDs
      const currentIds = player.achievementIds || [];
      if (!currentIds.includes(achievementId)) {
        currentIds.push(achievementId);
        await this.updatePlayer(friendCode, { achievementIds: currentIds });
        console.log(`✅ Assigned achievement ${achievementId} to player ${friendCode}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to assign achievement:', error);
      throw error;
    }
  }

  /**
   * Remove an achievement from a player
   * @param {string} friendCode - Player's friend code
   * @param {string} achievementId - Achievement ID to remove
   * @returns {Promise<boolean>} - Success status
   */
  async removeAchievement(friendCode, achievementId) {
    try {
      const player = await this.getPlayer(friendCode);
      if (!player) {
        throw new Error('Player not found');
      }

      // Release the achievement in achievements DB
      await achievementsDB.releaseAchievement(achievementId);

      // Remove from player's achievement IDs
      const currentIds = player.achievementIds || [];
      const updatedIds = currentIds.filter(id => id !== achievementId);
      await this.updatePlayer(friendCode, { achievementIds: updatedIds });

      console.log(`✅ Removed achievement ${achievementId} from player ${friendCode}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to remove achievement:', error);
      throw error;
    }
  }

  /**
   * Assign an article to a player
   * @param {string} friendCode - Player's friend code
   * @param {string} articleId - Unique article ID
   * @returns {Promise<boolean>} - Success status
   */
  async assignArticle(friendCode, articleId) {
    try {
      // Check if player exists
      const player = await this.getPlayer(friendCode);
      if (!player) {
        throw new Error('Player not found');
      }

      // Assign the article in articles DB
      await articlesIdDB.assignArticle(articleId, friendCode);

      // Add to player's article IDs
      const currentIds = player.articleIds || [];
      if (!currentIds.includes(articleId)) {
        currentIds.push(articleId);
        await this.updatePlayer(friendCode, { articleIds: currentIds });
        console.log(`✅ Assigned article ${articleId} to player ${friendCode}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to assign article:', error);
      throw error;
    }
  }

  /**
   * Remove an article from a player
   * @param {string} friendCode - Player's friend code
   * @param {string} articleId - Article ID to remove
   * @returns {Promise<boolean>} - Success status
   */
  async removeArticle(friendCode, articleId) {
    try {
      const player = await this.getPlayer(friendCode);
      if (!player) {
        throw new Error('Player not found');
      }

      // Release the article in articles DB
      await articlesIdDB.releaseArticle(articleId);

      // Remove from player's article IDs
      const currentIds = player.articleIds || [];
      const updatedIds = currentIds.filter(id => id !== articleId);
      await this.updatePlayer(friendCode, { articleIds: updatedIds });

      console.log(`✅ Removed article ${articleId} from player ${friendCode}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to remove article:', error);
      throw error;
    }
  }

  /**
   * Get full achievement objects for a player
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<Array>} - Array of achievement objects
   */
  async getPlayerAchievements(friendCode) {
    try {
      const player = await this.getPlayer(friendCode);
      if (!player || !player.achievementIds) {
        return [];
      }

      const achievements = [];
      for (const achievementId of player.achievementIds) {
        const achievement = await achievementsDB.getAchievement(achievementId);
        if (achievement) {
          achievements.push(achievement);
        }
      }

      return achievements;
    } catch (error) {
      console.error('❌ Failed to get player achievements:', error);
      return [];
    }
  }

  /**
   * Get full article objects for a player
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<Array>} - Array of article objects
   */
  async getPlayerArticles(friendCode) {
    try {
      const player = await this.getPlayer(friendCode);
      if (!player || !player.articleIds) {
        return [];
      }

      const articles = [];
      for (const articleId of player.articleIds) {
        const article = await articlesIdDB.getArticle(articleId);
        if (article) {
          articles.push(article);
        }
      }

      return articles;
    } catch (error) {
      console.error('❌ Failed to get player articles:', error);
      return [];
    }
  }

  /**
   * Get available achievements that can be assigned
   * @returns {Promise<Array>} - Array of available achievements
   */
  async getAvailableAchievements() {
    return await achievementsDB.getAvailableAchievements();
  }

  /**
   * Get available articles that can be assigned
   * @returns {Promise<Array>} - Array of available articles
   */
  async getAvailableArticles() {
    return await articlesIdDB.getAvailableArticles();
  }

  /**
   * Migrate old achievement/article arrays to ID-based system
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<boolean>} - Success status
   */
  async migrateToIdSystem(friendCode) {
    try {
      const player = await this.getPlayer(friendCode);
      if (!player) {
        throw new Error('Player not found');
      }

      // Skip if already migrated
      if (player.achievementIds || player.articleIds) {
        console.log(`Player ${friendCode} already migrated to ID system`);
        return true;
      }

      const achievementIds = [];
      const articleIds = [];

      // Migrate achievements
      if (player.achievements && Array.isArray(player.achievements)) {
        for (const achievement of player.achievements) {
          try {
            const achievementId = await achievementsDB.createAchievementTemplate(achievement);
            await achievementsDB.assignAchievement(achievementId, friendCode);
            achievementIds.push(achievementId);
          } catch (error) {
            console.warn(`Failed to migrate achievement for ${friendCode}:`, error);
          }
        }
      }

      // Migrate articles
      if (player.articles && Array.isArray(player.articles)) {
        for (const article of player.articles) {
          try {
            const articleId = await articlesIdDB.createArticleTemplate(article);
            await articlesIdDB.assignArticle(articleId, friendCode);
            articleIds.push(articleId);
          } catch (error) {
            console.warn(`Failed to migrate article for ${friendCode}:`, error);
          }
        }
      }

      // Update player with new ID arrays
      await this.updatePlayer(friendCode, {
        achievementIds,
        articleIds
      });

      console.log(`✅ Migrated player ${friendCode} to ID system: ${achievementIds.length} achievements, ${articleIds.length} articles`);
      return true;
    } catch (error) {
      console.error('❌ Failed to migrate player to ID system:', error);
      throw error;
    }
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
