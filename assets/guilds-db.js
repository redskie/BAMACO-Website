/**
 * BAMACO Guilds Database Module
 * Handles CRUD operations for guilds in Firebase Firestore
 */

import { guildsCollection } from '../config/firebase-config.js';
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class GuildsDB {
  constructor() {
    this.cache = null;
    this.listeners = [];
  }

  /**
   * Get all guilds from Firebase
   * @returns {Promise<Array>} Array of guild objects
   */
  async getAllGuilds() {
    try {
      const snapshot = await getDocs(guildsCollection);
      const guildsArray = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      this.cache = guildsArray;
      return guildsArray;
    } catch (error) {
      console.error('Error fetching guilds:', error);
      return [];
    }
  }

  /**
   * Get a specific guild by ID
   * @param {string} guildId - Guild identifier
   * @returns {Promise<Object|null>} Guild object or null
   */
  async getGuild(guildId) {
    try {
      const guildDoc = doc(guildsCollection, guildId);
      const snapshot = await getDoc(guildDoc);
      return snapshot.exists() ? { id: guildId, ...snapshot.data() } : null;
    } catch (error) {
      console.error(`Error fetching guild ${guildId}:`, error);
      return null;
    }
  }

  /**
   * Create a new guild
   * @param {Object} guildData - Guild data object
   * @returns {Promise<boolean>} Success status
   */
  async createGuild(guildData) {
    try {
      const { id, ...data } = guildData;
      if (!id) {
        throw new Error('Guild ID is required');
      }

      const guildDoc = doc(guildsCollection, id);
      await setDoc(guildDoc, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ Guild ${id} created successfully`);
      return true;
    } catch (error) {
      console.error('Error creating guild:', error);
      return false;
    }
  }

  /**
   * Update an existing guild
   * @param {string} guildId - Guild identifier
   * @param {Object} updates - Fields to update
   * @returns {Promise<boolean>} Success status
   */
  async updateGuild(guildId, updates) {
    try {
      const guildDoc = doc(guildsCollection, guildId);
      await updateDoc(guildDoc, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ Guild ${guildId} updated successfully`);
      return true;
    } catch (error) {
      console.error(`Error updating guild ${guildId}:`, error);
      return false;
    }
  }

  /**
   * Delete a guild
   * @param {string} guildId - Guild identifier
   * @returns {Promise<boolean>} Success status
   */
  async deleteGuild(guildId) {
    try {
      const guildDoc = doc(guildsCollection, guildId);
      await deleteDoc(guildDoc);

      console.log(`✅ Guild ${guildId} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Error deleting guild ${guildId}:`, error);
      return false;
    }
  }

  /**
   * Subscribe to real-time guild updates
   * @param {Function} callback - Function to call when data changes
   * @returns {Function} Unsubscribe function
   */
  subscribeToGuilds(callback) {
    const unsubscribe = onSnapshot(guildsCollection, (snapshot) => {
      const guildsArray = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      this.cache = guildsArray;
      callback(guildsArray);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Subscribe to a specific guild's updates
   * @param {string} guildId - Guild identifier
   * @param {Function} callback - Function to call when data changes
   * @returns {Function} Unsubscribe function
   */
  subscribeToGuild(guildId, callback) {
    const guildDoc = doc(guildsCollection, guildId);
    const unsubscribe = onSnapshot(guildDoc, (snapshot) => {
      callback(snapshot.exists() ? { id: guildId, ...snapshot.data() } : null);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Search guilds by name or motto
   * @param {string} searchTerm - Search query
   * @returns {Promise<Array>} Filtered guild array
   */
  async searchGuilds(searchTerm) {
    const guilds = await this.getAllGuilds();
    const term = searchTerm.toLowerCase();
    
    return guilds.filter(guild => 
      guild.name?.toLowerCase().includes(term) ||
      guild.motto?.toLowerCase().includes(term)
    );
  }

  /**
   * Clear cached data
   */
  clearCache() {
    this.cache = null;
  }

  /**
   * Unsubscribe from all listeners
   */
  unsubscribeAll() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}

// Export singleton instance
export const guildsDB = new GuildsDB();
