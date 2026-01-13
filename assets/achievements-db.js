/**
 * ============================================================================
 * BAMACO ACHIEVEMENTS DATABASE MODULE
 * ============================================================================
 * 
 * Central registry for all achievements with unique IDs
 * Each achievementId can only be assigned to one player
 * 
 * Database Structure:
 * /achievements/{achievementId}
 *   - achievementId: string (primary key)
 *   - title: string
 *   - description: string
 *   - icon: string (emoji/icon)
 *   - category: string (e.g., "Skill", "Community", "Event")
 *   - rarity: string ("Common", "Rare", "Epic", "Legendary")
 *   - points: number (achievement points value)
 *   - assignedTo: string (friendCode of player who owns this ID)
 *   - assignedAt: timestamp
 *   - createdAt: timestamp
 */

import { achievementsCollection } from '../config/firebase-config.js';
import { doc, getDoc, getDocs, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firestore collection for achievements
const achievementsRef = achievementsCollection;

/**
 * AchievementsDB - Central achievement registry with unique IDs
 */
class AchievementsDB {
  
  /**
   * Create a new achievement template (not assigned to any player)
   * @param {Object} achievement - Achievement data
   * @returns {Promise<string>} - Generated achievement ID
   */
  async createAchievementTemplate(achievement) {
    const achievementId = this.generateAchievementId(achievement.title);
    const now = Date.now();
    
    const achievementData = {
      achievementId,
      title: achievement.title || 'Untitled Achievement',
      description: achievement.description || '',
      icon: achievement.icon || '🏆',
      category: achievement.category || 'General',
      rarity: achievement.rarity || 'Common',
      points: achievement.points || 10,
      assignedTo: null, // Not assigned to anyone yet
      assignedAt: null,
      createdAt: now
    };
    
    await setDoc(doc(achievementsRef, achievementId), achievementData);
    console.log(`✅ Created achievement template: ${achievementId}`);
    return achievementId;
  }
  
  /**
   * Generate multiple instances of an achievement
   * @param {string} templateId - Base achievement template
   * @param {number} count - Number of instances to create
   * @returns {Promise<Array<string>>} - Array of generated achievement IDs
   */
  async generateAchievementInstances(templateId, count = 1) {
    const template = await this.getAchievementTemplate(templateId);
    if (!template) throw new Error('Template not found');
    
    const instanceIds = [];
    for (let i = 0; i < count; i++) {
      const instanceId = `${templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const instanceData = {
        ...template,
        achievementId: instanceId,
        parentTemplate: templateId,
        assignedTo: null,
        assignedAt: null,
        createdAt: Date.now()
      };
      
      await setDoc(doc(achievementsRef, instanceId), instanceData);
      instanceIds.push(instanceId);
    }
    
    console.log(`✅ Generated ${count} instances of ${templateId}`);
    return instanceIds;
  }
  
  /**
   * Assign an achievement to a player
   * @param {string} achievementId - Unique achievement ID
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<boolean>} - Success status
   */
  async assignAchievement(achievementId, friendCode) {
    const achievementDoc = doc(achievementsRef, achievementId);
    const achievementSnapshot = await getDoc(achievementDoc);
    if (!achievementSnapshot.exists()) {
      throw new Error('Achievement not found');
    }

    const achievement = achievementSnapshot.data();
    if (achievement.assignedTo) {
      throw new Error('Achievement already assigned to another player');
    }
    
    // Assign the achievement
    await updateDoc(achievementDoc, {
      assignedTo: friendCode,
      assignedAt: Date.now()
    });
    
    console.log(`✅ Assigned achievement ${achievementId} to ${friendCode}`);
    return true;
  }
  
  /**
   * Get achievements assigned to a specific player
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<Array>} - Array of achievements
   */
  async getPlayerAchievements(friendCode) {
    const snapshot = await getDocs(achievementsRef);
    if (snapshot.empty) return [];

    return snapshot.docs
      .map((docSnap) => docSnap.data())
      .filter((achievement) => achievement.assignedTo === friendCode);
  }
  
  /**
   * Get all available (unassigned) achievements
   * @returns {Promise<Array>} - Array of available achievements
   */
  async getAvailableAchievements() {
    const snapshot = await getDocs(achievementsRef);
    if (snapshot.empty) return [];

    return snapshot.docs
      .map((docSnap) => docSnap.data())
      .filter((achievement) => achievement.assignedTo === null || typeof achievement.assignedTo === 'undefined');
  }
  
  /**
   * Get achievement by ID
   * @param {string} achievementId - Achievement ID
   * @returns {Promise<Object|null>} - Achievement data or null
   */
  async getAchievement(achievementId) {
    const achievementDoc = doc(achievementsRef, achievementId);
    const snapshot = await getDoc(achievementDoc);
    return snapshot.exists() ? snapshot.data() : null;
  }
  
  /**
   * Get achievement template (for creating instances)
   * @param {string} templateId - Template ID
   * @returns {Promise<Object|null>} - Template data or null
   */
  async getAchievementTemplate(templateId) {
    return this.getAchievement(templateId);
  }
  
  /**
   * Generate a unique achievement ID based on title
   * @param {string} title - Achievement title
   * @returns {string} - Generated ID
   */
  generateAchievementId(title) {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    return `ach_${slug}_${timestamp}_${random}`;
  }
  
  /**
   * Release an achievement (unassign from player)
   * @param {string} achievementId - Achievement ID to release
   * @returns {Promise<boolean>} - Success status
   */
  async releaseAchievement(achievementId) {
    await updateDoc(doc(achievementsRef, achievementId), {
      assignedTo: null,
      assignedAt: null
    });
    
    console.log(`✅ Released achievement ${achievementId}`);
    return true;
  }
  
  /**
   * Get achievement statistics
   * @returns {Promise<Object>} - Stats object
   */
  async getStats() {
    const snapshot = await getDocs(achievementsRef);
    const achievements = snapshot.empty ? [] : snapshot.docs.map((docSnap) => docSnap.data());
    
    const assigned = achievements.filter(a => a.assignedTo).length;
    const available = achievements.filter(a => !a.assignedTo).length;
    const byCategory = achievements.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: achievements.length,
      assigned,
      available,
      byCategory
    };
  }
}

// Export singleton instance
const achievementsDB = new AchievementsDB();
export { achievementsDB, AchievementsDB };