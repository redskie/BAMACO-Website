/**
 * BAMACO Articles Database Module
 * Handles CRUD operations for articles in Firebase Firestore
 */

import { articlesCollection } from '../config/firebase-config.js';
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class ArticlesDB {
  constructor() {
    this.cache = null;
    this.listeners = [];
  }

  /**
   * Get all articles from Firebase
   * @returns {Promise<Array>} Array of article objects
   */
  async getAllArticles() {
    try {
      const snapshot = await getDocs(articlesCollection);
      const articlesArray = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

      this.cache = articlesArray;
      return articlesArray;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  /**
   * Get a specific article by ID
   * @param {string} articleId - Article identifier (e.g., "A001")
   * @returns {Promise<Object|null>} Article object or null
   */
  async getArticle(articleId) {
    try {
      const articleDoc = doc(articlesCollection, articleId);
      const snapshot = await getDoc(articleDoc);
      return snapshot.exists() ? { id: articleId, ...snapshot.data() } : null;
    } catch (error) {
      console.error(`Error fetching article ${articleId}:`, error);
      return null;
    }
  }

  /**
   * Create a new article
   * @param {Object} articleData - Article data object
   * @returns {Promise<boolean>} Success status
   */
  async createArticle(articleData) {
    try {
      const { id, ...data } = articleData;
      if (!id) {
        throw new Error('Article ID is required');
      }

      const articleDoc = doc(articlesCollection, id);
      await setDoc(articleDoc, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ Article ${id} created successfully`);
      return true;
    } catch (error) {
      console.error('Error creating article:', error);
      return false;
    }
  }

  /**
   * Update an existing article
   * @param {string} articleId - Article identifier
   * @param {Object} updates - Fields to update
   * @returns {Promise<boolean>} Success status
   */
  async updateArticle(articleId, updates) {
    try {
      const articleDoc = doc(articlesCollection, articleId);
      await updateDoc(articleDoc, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ Article ${articleId} updated successfully`);
      return true;
    } catch (error) {
      console.error(`Error updating article ${articleId}:`, error);
      return false;
    }
  }

  /**
   * Delete an article
   * @param {string} articleId - Article identifier
   * @returns {Promise<boolean>} Success status
   */
  async deleteArticle(articleId) {
    try {
      const articleDoc = doc(articlesCollection, articleId);
      await deleteDoc(articleDoc);

      console.log(`✅ Article ${articleId} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Error deleting article ${articleId}:`, error);
      return false;
    }
  }

  /**
   * Subscribe to real-time article updates
   * @param {Function} callback - Function to call when data changes
   * @returns {Function} Unsubscribe function
   */
  subscribeToArticles(callback) {
    const unsubscribe = onSnapshot(articlesCollection, (snapshot) => {
      const articlesArray = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
      this.cache = articlesArray;
      callback(articlesArray);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Subscribe to a specific article's updates
   * @param {string} articleId - Article identifier
   * @param {Function} callback - Function to call when data changes
   * @returns {Function} Unsubscribe function
   */
  subscribeToArticle(articleId, callback) {
    const articleDoc = doc(articlesCollection, articleId);
    const unsubscribe = onSnapshot(articleDoc, (snapshot) => {
      callback(snapshot.exists() ? { id: articleId, ...snapshot.data() } : null);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Search articles by title, excerpt, or category
   * @param {string} searchTerm - Search query
   * @returns {Promise<Array>} Filtered article array
   */
  async searchArticles(searchTerm) {
    const articles = await this.getAllArticles();
    const term = searchTerm.toLowerCase();
    
    return articles.filter(article => 
      article.title?.toLowerCase().includes(term) ||
      article.excerpt?.toLowerCase().includes(term) ||
      article.category?.toLowerCase().includes(term)
    );
  }

  /**
   * Get articles by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Filtered article array
   */
  async getArticlesByCategory(category) {
    const articles = await this.getAllArticles();
    return articles.filter(article => article.category === category);
  }

  /**
   * Get articles by author
   * @param {string} authorId - Author identifier
   * @returns {Promise<Array>} Filtered article array
   */
  async getArticlesByAuthor(authorId) {
    const articles = await this.getAllArticles();
    return articles.filter(article => article.authorId === authorId);
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
export const articlesDB = new ArticlesDB();
