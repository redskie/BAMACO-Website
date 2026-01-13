/**
 * ============================================================================
 * BAMACO ARTICLES ID DATABASE MODULE  
 * ============================================================================
 * 
 * Central registry for all articles with unique IDs
 * Each articleId can only be assigned to one player
 * 
 * Database Structure:
 * /articles/{articleId}
 *   - articleId: string (primary key)
 *   - title: string
 *   - excerpt: string (short description)
 *   - content: string (full article content)
 *   - category: string (e.g., "Tips & Tricks", "Chart Analysis")
 *   - difficulty: string ("Beginner", "Intermediate", "Advanced")
 *   - tags: array (searchable tags)
 *   - slug: string (URL-friendly filename)
 *   - assignedTo: string (friendCode of author)
 *   - assignedAt: timestamp
 *   - publishedAt: timestamp
 *   - lastModified: timestamp
 *   - createdAt: timestamp
 *   - isPublished: boolean
 */

import { articlesCollection } from '../config/firebase-config.js';
import { doc, getDoc, getDocs, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firestore collection for articles
const articlesRef = articlesCollection;

/**
 * ArticlesIdDB - Central article registry with unique IDs
 */
class ArticlesIdDB {
  
  /**
   * Create a new article template (not assigned to any player)
   * @param {Object} article - Article data
   * @returns {Promise<string>} - Generated article ID
   */
  async createArticleTemplate(article) {
    const articleId = this.generateArticleId(article.title);
    const now = Date.now();
    
    const articleData = {
      articleId,
      title: article.title || 'Untitled Article',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'General',
      difficulty: article.difficulty || 'Beginner',
      tags: article.tags || [],
      slug: this.generateSlug(article.title),
      assignedTo: null, // Not assigned to anyone yet
      assignedAt: null,
      publishedAt: null,
      lastModified: now,
      createdAt: now,
      isPublished: false
    };
    
    await setDoc(doc(articlesRef, articleId), articleData);
    console.log(`✅ Created article template: ${articleId}`);
    return articleId;
  }
  
  /**
   * Generate multiple instances of an article
   * @param {string} templateId - Base article template
   * @param {number} count - Number of instances to create
   * @returns {Promise<Array<string>>} - Array of generated article IDs
   */
  async generateArticleInstances(templateId, count = 1) {
    const template = await this.getArticleTemplate(templateId);
    if (!template) throw new Error('Template not found');
    
    const instanceIds = [];
    for (let i = 0; i < count; i++) {
      const instanceId = `${templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const instanceData = {
        ...template,
        articleId: instanceId,
        parentTemplate: templateId,
        slug: `${template.slug}_${i + 1}`,
        assignedTo: null,
        assignedAt: null,
        createdAt: Date.now()
      };
      
      await setDoc(doc(articlesRef, instanceId), instanceData);
      instanceIds.push(instanceId);
    }
    
    console.log(`✅ Generated ${count} instances of ${templateId}`);
    return instanceIds;
  }
  
  /**
   * Assign an article to a player (author)
   * @param {string} articleId - Unique article ID
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<boolean>} - Success status
   */
  async assignArticle(articleId, friendCode) {
    const articleDoc = doc(articlesRef, articleId);
    const articleSnapshot = await getDoc(articleDoc);
    if (!articleSnapshot.exists()) {
      throw new Error('Article not found');
    }

    const article = articleSnapshot.data();
    if (article.assignedTo) {
      throw new Error('Article already assigned to another player');
    }
    
    // Assign the article
    await updateDoc(articleDoc, {
      assignedTo: friendCode,
      assignedAt: Date.now()
    });
    
    console.log(`✅ Assigned article ${articleId} to ${friendCode}`);
    return true;
  }
  
  /**
   * Get articles authored by a specific player
   * @param {string} friendCode - Player's friend code
   * @returns {Promise<Array>} - Array of articles
   */
  async getPlayerArticles(friendCode) {
    const snapshot = await getDocs(articlesRef);
    if (snapshot.empty) return [];

    return snapshot.docs
      .map((docSnap) => docSnap.data())
      .filter((article) => article.assignedTo === friendCode);
  }
  
  /**
   * Get all available (unassigned) articles
   * @returns {Promise<Array>} - Array of available articles
   */
  async getAvailableArticles() {
    const snapshot = await getDocs(articlesRef);
    if (snapshot.empty) return [];

    return snapshot.docs
      .map((docSnap) => docSnap.data())
      .filter((article) => article.assignedTo === null || typeof article.assignedTo === 'undefined');
  }
  
  /**
   * Get all published articles
   * @returns {Promise<Array>} - Array of published articles
   */
  async getPublishedArticles() {
    const snapshot = await getDocs(articlesRef);
    if (snapshot.empty) return [];

    const published = snapshot.docs
      .map((docSnap) => docSnap.data())
      .filter((article) => article.isPublished === true);
    return published.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  }
  
  /**
   * Get article by ID
   * @param {string} articleId - Article ID
   * @returns {Promise<Object|null>} - Article data or null
   */
  async getArticle(articleId) {
    const articleDoc = doc(articlesRef, articleId);
    const snapshot = await getDoc(articleDoc);
    return snapshot.exists() ? snapshot.data() : null;
  }
  
  /**
   * Generate a unique article ID based on title
   * @param {string} title - Article title
   * @returns {string} - Generated ID
   */
  generateArticleId(title) {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    return `art_${slug}_${timestamp}_${random}`;
  }
  
  /**
   * Generate URL-friendly slug
   * @param {string} title - Article title
   * @returns {string} - Generated slug
   */
  generateSlug(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }
  
  /**
   * Get article template (for creating instances)
   * @param {string} templateId - Template ID
   * @returns {Promise<Object|null>} - Template data or null
   */
  async getArticleTemplate(templateId) {
    return this.getArticle(templateId);
  }
  
  /**
   * Get all articles (for compatibility with existing system)
   * @returns {Promise<Array>} - Array of all articles
   */
  async getAllArticles() {
    return this.getPublishedArticles();
  }
}

// Export singleton instance
const articlesIdDB = new ArticlesIdDB();
export { articlesIdDB, ArticlesIdDB };