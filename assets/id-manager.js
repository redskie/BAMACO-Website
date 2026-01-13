/**
 * ============================================================================
 * BAMACO ID MANAGEMENT UTILITY
 * ============================================================================
 * 
 * Centralized utility for managing achievement and article IDs
 * Provides easy-to-use functions for assigning, removing, and querying IDs
 */

import { playersDB } from './players-db.js';
import { achievementsDB } from './achievements-db.js';
import { articlesIdDB } from './articles-id-db.js';

class IdManager {
  
  // ============================================================================
  // ACHIEVEMENT MANAGEMENT
  // ============================================================================
  
  /**
   * Create a new achievement template and generate instances
   * @param {Object} achievementTemplate - Achievement template data
   * @param {number} instanceCount - Number of instances to generate
   * @returns {Promise<Array<string>>} - Array of achievement IDs
   */
  async createAchievement(achievementTemplate, instanceCount = 1) {
    try {
      // Create the template
      const templateId = await achievementsDB.createAchievementTemplate(achievementTemplate);
      
      // Generate instances if more than one requested
      if (instanceCount > 1) {
        return await achievementsDB.generateAchievementInstances(templateId, instanceCount - 1);
      }
      
      return [templateId];
    } catch (error) {
      console.error('❌ Failed to create achievement:', error);
      throw error;
    }
  }
  
  /**
   * Assign an achievement to a player
   * @param {string} friendCode - Player's friend code
   * @param {string} achievementId - Achievement ID
   * @returns {Promise<boolean>} - Success status
   */
  async assignAchievement(friendCode, achievementId) {
    return await playersDB.assignAchievement(friendCode, achievementId);
  }
  
  /**
   * Remove an achievement from a player
   * @param {string} friendCode - Player's friend code
   * @param {string} achievementId - Achievement ID
   * @returns {Promise<boolean>} - Success status
   */
  async removeAchievement(friendCode, achievementId) {
    return await playersDB.removeAchievement(friendCode, achievementId);
  }
  
  /**
   * Get all achievements for a player
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<Array>} - Array of achievement objects
   */
  async getPlayerAchievements(friendCode) {
    return await playersDB.getPlayerAchievements(friendCode);
  }
  
  /**
   * Get available (unassigned) achievements
   * @returns {Promise<Array>} - Array of available achievements
   */
  async getAvailableAchievements() {
    return await achievementsDB.getAvailableAchievements();
  }
  
  /**
   * Get achievement statistics
   * @returns {Promise<Object>} - Achievement stats
   */
  async getAchievementStats() {
    return await achievementsDB.getStats();
  }
  
  // ============================================================================
  // ARTICLE MANAGEMENT
  // ============================================================================
  
  /**
   * Create a new article template and generate instances
   * @param {Object} articleTemplate - Article template data
   * @param {number} instanceCount - Number of instances to generate
   * @returns {Promise<Array<string>>} - Array of article IDs
   */
  async createArticle(articleTemplate, instanceCount = 1) {
    try {
      // Create the template
      const templateId = await articlesIdDB.createArticleTemplate(articleTemplate);
      
      // Generate instances if more than one requested
      if (instanceCount > 1) {
        return await articlesIdDB.generateArticleInstances(templateId, instanceCount - 1);
      }
      
      return [templateId];
    } catch (error) {
      console.error('❌ Failed to create article:', error);
      throw error;
    }
  }
  
  /**
   * Assign an article to a player
   * @param {string} friendCode - Player's friend code
   * @param {string} articleId - Article ID
   * @returns {Promise<boolean>} - Success status
   */
  async assignArticle(friendCode, articleId) {
    return await playersDB.assignArticle(friendCode, articleId);
  }
  
  /**
   * Remove an article from a player
   * @param {string} friendCode - Player's friend code
   * @param {string} articleId - Article ID
   * @returns {Promise<boolean>} - Success status
   */
  async removeArticle(friendCode, articleId) {
    return await playersDB.removeArticle(friendCode, articleId);
  }
  
  /**
   * Get all articles for a player
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<Array>} - Array of article objects
   */
  async getPlayerArticles(friendCode) {
    return await playersDB.getPlayerArticles(friendCode);
  }
  
  /**
   * Get available (unassigned) articles
   * @returns {Promise<Array>} - Array of available articles
   */
  async getAvailableArticles() {
    return await articlesIdDB.getAvailableArticles();
  }
  
  /**
   * Get article statistics
   * @returns {Promise<Object>} - Article stats
   */
  async getArticleStats() {
    return await articlesIdDB.getStats();
  }
  
  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================
  
  /**
   * Assign multiple achievements to a player
   * @param {string} friendCode - Player's friend code
   * @param {Array<string>} achievementIds - Array of achievement IDs
   * @returns {Promise<Object>} - Results summary
   */
  async assignMultipleAchievements(friendCode, achievementIds) {
    const results = { success: [], failed: [] };
    
    for (const achievementId of achievementIds) {
      try {
        await this.assignAchievement(friendCode, achievementId);
        results.success.push(achievementId);
      } catch (error) {
        results.failed.push({ achievementId, error: error.message });
      }
    }
    
    return results;
  }
  
  /**
   * Assign multiple articles to a player
   * @param {string} friendCode - Player's friend code
   * @param {Array<string>} articleIds - Array of article IDs
   * @returns {Promise<Object>} - Results summary
   */
  async assignMultipleArticles(friendCode, articleIds) {
    const results = { success: [], failed: [] };
    
    for (const articleId of articleIds) {
      try {
        await this.assignArticle(friendCode, articleId);
        results.success.push(articleId);
      } catch (error) {
        results.failed.push({ articleId, error: error.message });
      }
    }
    
    return results;
  }
  
  // ============================================================================
  // MIGRATION AND UTILITIES
  // ============================================================================
  
  /**
   * Migrate a player from old system to ID-based system
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<boolean>} - Success status
   */
  async migratePlayer(friendCode) {
    return await playersDB.migrateToIdSystem(friendCode);
  }
  
  /**
   * Migrate all players to ID-based system
   * @returns {Promise<Object>} - Migration results
   */
  async migrateAllPlayers() {
    const results = { migrated: 0, skipped: 0, failed: [] };
    const players = await playersDB.getAllPlayers();
    
    for (const player of players) {
      try {
        const wasMigrated = await this.migratePlayer(player.friendCode);
        if (wasMigrated) {
          results.migrated++;
        } else {
          results.skipped++;
        }
      } catch (error) {
        results.failed.push({
          friendCode: player.friendCode,
          error: error.message
        });
      }
    }
    
    console.log(`✅ Migration complete: ${results.migrated} migrated, ${results.skipped} skipped, ${results.failed.length} failed`);
    return results;
  }
  
  /**
   * Get comprehensive system statistics
   * @returns {Promise<Object>} - Complete system stats
   */
  async getSystemStats() {
    const [achievementStats, articleStats, playerCount] = await Promise.all([
      this.getAchievementStats(),
      this.getArticleStats(),
      playersDB.getAllPlayers().then(players => players.length)
    ]);
    
    return {
      players: playerCount,
      achievements: achievementStats,
      articles: articleStats,
      timestamp: Date.now()
    };
  }
  
  /**
   * Search for available IDs by content
   * @param {string} searchTerm - Search term
   * @param {string} type - 'achievements' or 'articles'
   * @returns {Promise<Array>} - Array of matching items
   */
  async searchAvailableIds(searchTerm, type = 'both') {
    const results = { achievements: [], articles: [] };
    
    if (type === 'achievements' || type === 'both') {
      const achievements = await this.getAvailableAchievements();
      results.achievements = achievements.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (type === 'articles' || type === 'both') {
      const articles = await this.getAvailableArticles();
      results.articles = articles.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return type === 'both' ? results : (type === 'achievements' ? results.achievements : results.articles);
  }
}

// Export singleton instance
const idManager = new IdManager();

// Global access for admin use
window.BAMACO_ID_MANAGER = idManager;

export { idManager, IdManager };