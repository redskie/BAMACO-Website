// BAMACO Website JavaScript
// Data management and dynamic content loading from Firebase

import { playersDB } from './players-db.js';
import { guildsDB } from './guilds-db.js';
import { articlesIdDB } from './articles-id-db.js';

// Create admin badge based on admin role
function createAdminBadge(adminRole = 'admin') {
  const badges = {
    'owner': { icon: '👑', label: 'OWNER', class: 'admin-badge-owner' },
    'admin': { icon: '⭐', label: 'ADMIN', class: 'admin-badge-admin' },
    'moderator': { icon: '🛡️', label: 'MOD', class: 'admin-badge-mod' }
  };

  const badge = badges[adminRole.toLowerCase()] || badges['admin'];

  return `
    <div class="admin-badge ${badge.class}">
      <span class="admin-badge-icon">${badge.icon}</span>
      <span class="admin-badge-label">${badge.label}</span>
    </div>
  `;
}

let data = {
  players: [],
  guilds: [],
  articles: [],
};

// Caching system for improved performance
let cachedData = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Load data from Firebase with caching
async function loadData() {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedData && cacheTime && (now - cacheTime) < CACHE_DURATION) {
    data = cachedData;
    return data;
  }

  try {
    console.log('🔄 Loading fresh data from Firebase...');

    // Load all data from Firebase in parallel
    const [players, guilds, articles] = await Promise.all([
      playersDB.getAllPlayers(),
      guildsDB.getAllGuilds(),
      articlesIdDB.getAllArticles()
    ]);

    data = { players, guilds, articles };

    // Cache the data
    cachedData = { ...data }; // Create a copy
    cacheTime = now;

    console.log('✅ Data loaded from Firebase and cached successfully');
    console.log(`📊 Loaded: ${players.length} players, ${guilds.length} guilds, ${articles.length} articles`);
    return data;
  } catch (error) {
    console.error('❌ Error loading data from Firebase:', error);

    // Return cached data if available, otherwise empty structure
    if (cachedData) {
      console.log('⚠️ Using cached data due to Firebase error');
      data = cachedData;
    } else {
      console.log('⚠️ No cached data available, using empty structure');
      data = { players: [], guilds: [], articles: [] };
    }
    return data;
  }
}

// Clear cache manually (for debugging or forced refresh)
function clearDataCache() {
  cachedData = null;
  cacheTime = null;
  console.log('🗑️ Data cache cleared');
}

// ============================================
// Homepage Functions
// ============================================

async function loadStats() {
  await loadData();
  document.getElementById('player-count').textContent = data.players.length;
  document.getElementById('guild-count').textContent = data.guilds.length;
  document.getElementById('article-count').textContent = data.articles.length;
}

async function loadFeaturedPlayers() {
  await loadData();
  const container = document.getElementById('featured-players');
  const featured = [...data.players]
    .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
    .slice(0, 3);

  container.innerHTML = featured
    .map((player) => createPlayerCard(player))
    .join('');
}

async function loadTopGuilds() {
  await loadData();
  const container = document.getElementById('featured-guilds');
  const top = data.guilds.slice(0, 3);

  container.innerHTML = top.map((guild) => createGuildCard(guild)).join('');
}

async function loadLatestArticles() {
  await loadData();
  const container = document.getElementById('latest-articles');
  const latest = data.articles.slice(0, 3);

  container.innerHTML = latest
    .map((article) => createArticleCard(article))
    .join('');
}

// ============================================
// Players Page Functions
// ============================================

async function loadAllPlayers() {
  await loadData();
  const container = document.getElementById('players-grid');
  container.innerHTML = data.players
    .map((player) => createPlayerCard(player))
    .join('');
}

function filterPlayers(searchTerm) {
  const container = document.getElementById('players-grid');
  const filtered = data.players.filter((player) => {
    const displayName = player.ign || player.name;
    return (
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  container.innerHTML = filtered
    .map((player) => createPlayerCard(player))
    .join('');
}

// ============================================
// Guilds Page Functions
// ============================================

async function loadAllGuilds() {
  await loadData();
  const container = document.getElementById('guilds-grid');
  container.innerHTML = data.guilds
    .map((guild) => createGuildCard(guild))
    .join('');
}

function filterGuilds(searchTerm) {
  const container = document.getElementById('guilds-grid');
  const filtered = data.guilds.filter(
    (guild) =>
      guild.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guild.description && guild.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (guild.motto && guild.motto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (guild.tag && guild.tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  container.innerHTML = filtered
    .map((guild) => createGuildCard(guild))
    .join('');
}

// ============================================
// Articles Page Functions
// ============================================

async function loadAllArticles() {
  await loadData();
  const container = document.getElementById('articles-grid');

  if (data.articles.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-bold text-text-secondary mb-2">No Articles Found</h3>
        <p class="text-text-muted">Check back later for new tips and guides!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = data.articles
    .map((article) => createArticleCard(article))
    .join('');
}

// Make globally accessible
window.loadAllArticles = loadAllArticles;

function filterArticles(searchTerm) {
  const container = document.getElementById('articles-grid');
  const filtered = data.articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-text-secondary mb-2">No Articles Found</h3>
        <p class="text-text-muted">Try searching for different keywords</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((article) => createArticleCard(article))
    .join('');
}

// Make globally accessible
window.filterArticles = filterArticles;

// ============================================
// Player Profile Page Functions
// ============================================

async function loadPlayerProfile(playerId) {
  await loadData();
  const player = data.players.find((p) => p.id === playerId);

  if (!player) {
    document.querySelector('.profile-name').textContent = 'Player not found';
    return;
  }

  // Update profile header
  document.getElementById('player-avatar').textContent = player.ign.charAt(0);
  document.getElementById('player-name').textContent = player.ign;
  document.getElementById('player-role').textContent = player.role;
  document.getElementById('player-rating').textContent = player.rating;
  document.getElementById('player-rank').textContent = player.rank;
  document.getElementById('player-joined').textContent = player.joined;

  // Update bio
  document.getElementById('player-bio').textContent = player.bio;

  // Update guild affiliation
  const guild = data.guilds.find((g) => g.id === player.guildId);
  if (guild) {
    document.getElementById('player-guild').innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="card-emblem" style="width: 60px; height: 60px; font-size: 1.5rem;">
                    ${guild.name.charAt(0)}
                </div>
                <div>
                    <h4 style="margin-bottom: 0.3rem;">
                        <a href="guild-profile.html?id=${guild.id}">${
      guild.name
    }</a>
                    </h4>
                    <p class="text-muted" style="font-size: 0.9rem;">${
                      guild.motto
                    }</p>
                </div>
            </div>
        `;
  } else {
    document.getElementById('player-guild').innerHTML =
      '<p class="text-muted">Not affiliated with any guild</p>';
  }

  // Update achievements
  const achievementsContainer = document.getElementById('player-achievements');
  if (player.achievements && player.achievements.length > 0) {
    achievementsContainer.innerHTML = player.achievements
      .map(
        (achievement) => `
            <div class="achievement-badge">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `
      )
      .join('');
  } else {
    achievementsContainer.innerHTML =
      '<p class="text-muted">No achievements yet</p>';
  }

  // Update articles by this player
  const playerArticles = data.articles.filter((a) => a.authorId === playerId);
  const articlesContainer = document.getElementById('player-articles');
  if (playerArticles.length > 0) {
    articlesContainer.innerHTML = playerArticles
      .map((article) => createArticleCard(article))
      .join('');
  } else {
    articlesContainer.innerHTML =
      '<p class="text-muted">No guides published yet</p>';
  }
}

// ============================================
// Guild Profile Page Functions
// ============================================

async function loadGuildProfile(guildId) {
  await loadData();
  const guild = data.guilds.find((g) => g.id === guildId);

  if (!guild) {
    document.querySelector('.profile-name').textContent = 'Guild not found';
    return;
  }

  // Update profile header
  document.getElementById('guild-emblem').textContent = guild.name.charAt(0);
  document.getElementById('guild-name').textContent = guild.name;
  document.getElementById('guild-motto').textContent = guild.motto;
  document.getElementById('guild-members').textContent = guild.memberCount;
  document.getElementById('guild-level').textContent = guild.level;
  document.getElementById('guild-established').textContent = guild.established;

  // Update description
  document.getElementById('guild-description').textContent = guild.description;

  // Update achievements
  const achievementsContainer = document.getElementById('guild-achievements');
  if (guild.achievements && guild.achievements.length > 0) {
    achievementsContainer.innerHTML = guild.achievements
      .map(
        (achievement) => `
            <div class="achievement-badge">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `
      )
      .join('');
  } else {
    achievementsContainer.innerHTML =
      '<p class="text-muted">No achievements yet</p>';
  }

  // Update guild members
  const guildMembers = data.players.filter((p) => p.guildId === guildId);
  const membersContainer = document.getElementById('guild-members-grid');
  if (guildMembers.length > 0) {
    membersContainer.innerHTML = guildMembers
      .map((player) => createPlayerCard(player))
      .join('');
  } else {
    membersContainer.innerHTML = '<p class="text-muted">No members yet</p>';
  }
}

// ============================================
// Article Page Functions
// ============================================

async function loadArticle(articleId) {
  await loadData();
  const article = data.articles.find((a) => a.id === articleId);

  if (!article) {
    document.getElementById('article-title').textContent = 'Article not found';
    return;
  }

  // Update article header
  document.getElementById('article-title').textContent = article.title;

  // Find author
  const author = data.players.find((p) => p.id === article.authorId);
  if (author) {
    const authorProfileId = author.friendCode || author.id;
    document.getElementById('article-author').innerHTML = `
            By <a href="player-profile.html?id=${authorProfileId}">${author.ign}</a>
        `;
  }

  document.getElementById('article-date').textContent = article.date;
  document.getElementById('article-category').innerHTML = `
        <span class="article-category">${article.category}</span>
    `;

  // Update article content
  document.getElementById('article-content').innerHTML = article.content;

  // Update author info
  if (author) {
    const authorProfileId = author.friendCode || author.id;
    document.getElementById('author-info').innerHTML = `
            <div class="author-avatar">${author.ign.charAt(0)}</div>
            <div class="author-details">
                <div class="author-name">
                    <a href="player-profile.html?id=${authorProfileId}">${
      author.ign
    }</a>
                </div>
                <div class="author-bio">${author.bio}</div>
            </div>
        `;
  }

  // Load related articles (same category)
  const related = data.articles
    .filter((a) => a.category === article.category && a.id !== articleId)
    .slice(0, 3);

  const relatedContainer = document.getElementById('related-articles');
  if (related.length > 0) {
    relatedContainer.innerHTML = related
      .map((a) => createArticleCard(a))
      .join('');
  } else {
    relatedContainer.innerHTML =
      '<p class="text-muted">No related articles found</p>';
  }
}

// ============================================
// Utility Functions
// ============================================

// Centralized marquee functionality
function createMarqueeElement(text, threshold = 25) {
  if (text.length >= threshold) {
    const container = document.createElement('div');
    container.className = 'marquee-container';

    const content = document.createElement('span');
    content.className = 'marquee-content';
    content.textContent = text;

    container.appendChild(content);
    return container;
  } else {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }
}

// Apply marquee to an existing element
function applyMarqueeToElement(element, text, threshold = 25) {
  if (text.length >= threshold) {
    const container = document.createElement('div');
    container.className = 'marquee-container';

    const content = document.createElement('span');
    content.className = 'marquee-content';
    content.textContent = text;

    container.appendChild(content);

    element.innerHTML = '';
    element.appendChild(container);
  } else {
    element.textContent = text;
  }
}

// ============================================
// Card Creation Functions
// ============================================

function createPlayerCard(player) {
  const displayName = player.ign || player.name;
  const playerSlug = player.id;

  // Use friendCode if available, otherwise fall back to id
  const profileId = player.friendCode || player.id;

  // Check if enhanced styles are available (players page)
  const cardClass = document.querySelector('.players-grid-enhanced') ? 'player-card-enhanced' : 'player-card';

// Create avatar HTML with square framing and image source
  const avatarContent = player.avatarImage && player.avatarImage.trim()
    ? `<img src="${player.avatarImage}" alt="${displayName}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div class="w-full h-full flex items-center justify-center text-white font-bold">${displayName.substring(0, 2).toUpperCase()}</div>`
    : `<div class="w-full h-full flex items-center justify-center text-white font-bold">${displayName.substring(0, 2).toUpperCase()}</div>`;

  // Handle marquee for long titles using centralized function
  const playerRole = player.role || player.title || player.special_title || 'Player';
  const roleContent = playerRole.length >= 25
    ? `<div class="marquee-container text-xs"><span class="marquee-content">${playerRole}</span></div>`
    : `<p class="card-role">${playerRole}</p>`;

  // Create admin badge if user is admin
  const adminBadge = player.isAdmin ? createAdminBadge(player.adminRole || 'admin') : '';

  if (cardClass === 'player-card-enhanced') {
    return `
      <a href="player-profile.html?id=${profileId}" class="block bg-white rounded-lg border border-border-primary p-4 hover-card transition-all duration-200 card-compact">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-bg-secondary rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            ${avatarContent}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-text-primary truncate">${displayName}</h3>
            <p class="text-xs text-text-muted truncate">${playerRole}</p>
          </div>
          ${adminBadge}
        </div>
        <div class="flex gap-4 text-center">
          <div class="flex-1">
            <p class="text-xs text-text-muted">Rating</p>
            <p class="text-sm font-semibold text-text-primary">${player.rating || 'N/A'}</p>
          </div>
          <div class="flex-1">
            <p class="text-xs text-text-muted">Rank</p>
            <p class="text-sm font-semibold text-text-primary">${player.rank || 'Unranked'}</p>
          </div>
        </div>
      </a>
    `;
  }

  // Fallback to original card style for other pages with square avatar framing
  const fallbackAvatarContent = player.avatarImage && player.avatarImage.trim()
    ? `<img src="${player.avatarImage}" alt="${displayName}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div class="w-full h-full flex items-center justify-center text-white font-bold" style="display:none;">${displayName.charAt(0).toUpperCase()}</div>`
    : `<div class="w-full h-full flex items-center justify-center text-white font-bold">${displayName.charAt(0).toUpperCase()}</div>`;

  return `
    <div class="bg-white rounded-lg border border-border-primary p-4 hover-card transition-all duration-200 cursor-pointer card-compact" onclick="window.location.href='player-profile.html?id=${profileId}'">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-12 h-12 bg-bg-secondary rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          ${fallbackAvatarContent}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-text-primary truncate">${displayName}</h3>
          <div class="text-xs text-text-muted truncate">
            ${roleContent}
          </div>
        </div>
        ${adminBadge}
      </div>
      <div class="flex gap-4 text-center">
        <div class="flex-1">
          <p class="text-xs text-text-muted">Rating</p>
          <p class="text-sm font-semibold text-text-primary">${player.rating || 'N/A'}</p>
        </div>
        <div class="flex-1">
          <p class="text-xs text-text-muted">Rank</p>
          <p class="text-sm font-semibold text-text-primary">${player.rank || 'Unranked'}</p>
        </div>
      </div>
    </div>
  `;
}

function createGuildCard(guild) {
  const guildId = guild.id;

  return `
    <a href="guild-profile.html?id=${guildId}" class="block bg-bg-card border border-border-primary rounded-xl p-6 hover-card hover-gradient-line group">
      <!-- Guild Emblem -->
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-3xl font-black text-white mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
        ${guild.name.charAt(0)}
      </div>

      <!-- Guild Name -->
      <h3 class="text-xl font-bold text-text-primary mb-2 group-hover:text-accent-pink transition-colors">${guild.name}</h3>

      <!-- Guild Description -->
      <p class="text-text-secondary text-sm mb-4 line-clamp-2">${guild.description || guild.motto || 'No description available'}</p>

      <!-- Guild Stats -->
      <div class="flex gap-4">
        <div class="flex-1 bg-bg-tertiary rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-accent-pink">${guild.members ? guild.members.length : (guild.memberCount || 0)}</div>
          <div class="text-xs text-text-muted uppercase tracking-wide">Members</div>
        </div>
        <div class="flex-1 bg-bg-tertiary rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-accent-purple">${guild.level || 1}</div>
          <div class="text-xs text-text-muted uppercase tracking-wide">Level</div>
        </div>
      </div>
    </a>
  `;
}

function createArticleCard(article) {
  // Look up author by friendCode (primary key) or fallback to id
  const author = data.players.find((p) => p.friendCode === article.authorId || p.id === article.authorId || p.ign === article.author);
  const authorIGN = author ? (author.ign || author.name) : (article.author || article.authorId?.replace(/_/g, ' ') || 'Anonymous');
  const articleId = article.id;

  return `
    <a href="article.html?id=${articleId}" class="block bg-bg-card border border-border-primary rounded-xl p-6 hover-card hover-gradient-line group">
      <!-- Article Title -->
      <h3 class="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-purple transition-colors line-clamp-2">${article.title}</h3>

      <!-- Article Excerpt -->
      <p class="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">${article.excerpt || article.description || 'No description available'}</p>

      <!-- Article Meta -->
      <div class="flex justify-between items-center gap-2 text-sm">
        <span class="text-text-muted">By ${authorIGN}</span>
        <span class="bg-bg-tertiary px-3 py-1 rounded-full font-semibold text-accent-purple">${article.category}</span>
      </div>
    </a>
  `;
}

// Export functions for use in other modules
window.loadData = loadData;
window.data = data;
window.createPlayerCard = createPlayerCard;
window.createGuildCard = createGuildCard;
window.createArticleCard = createArticleCard;
