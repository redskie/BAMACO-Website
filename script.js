// BAMACO Website JavaScript
// Data management and dynamic content loading

let data = {
  players: [],
  guilds: [],
  articles: [],
};

// Load data from JSON file
async function loadData() {
  try {
    const response = await fetch('data.json');
    data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
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
  const featured = data.players.slice(0, 3);

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
      guild.motto.toLowerCase().includes(searchTerm.toLowerCase())
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
  container.innerHTML = data.articles
    .map((article) => createArticleCard(article))
    .join('');
}

function filterArticles(searchTerm) {
  const container = document.getElementById('articles-grid');
  const filtered = data.articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  container.innerHTML = filtered
    .map((article) => createArticleCard(article))
    .join('');
}

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
    document.getElementById('article-author').innerHTML = `
            By <a href="player-profile.html?id=${author.id}">${author.ign}</a>
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
    document.getElementById('author-info').innerHTML = `
            <div class="author-avatar">${author.ign.charAt(0)}</div>
            <div class="author-details">
                <div class="author-name">
                    <a href="player-profile.html?id=${author.id}">${
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
// Card Creation Functions
// ============================================

function createPlayerCard(player) {
  const displayName = player.ign || player.name;
  const playerSlug = player.id;
  
  // Check if enhanced styles are available (players page)
  const cardClass = document.querySelector('.players-grid-enhanced') ? 'player-card-enhanced' : 'player-card';
  
  if (cardClass === 'player-card-enhanced') {
    return `
      <a href="players/${playerSlug}.html" class="player-card-enhanced">
        <div class="player-avatar">${displayName.substring(0, 2).toUpperCase()}</div>
        <h3 class="player-name">${displayName}</h3>
        <div class="player-meta">
          <div class="player-stat">
            <span class="player-stat-label">Rating</span>
            <span class="player-stat-value">${player.rating || 'N/A'}</span>
          </div>
          <div class="player-stat">
            <span class="player-stat-label">Rank</span>
            <span class="player-stat-value">${player.rank || 'Unranked'}</span>
          </div>
        </div>
      </a>
    `;
  }
  
  // Fallback to original card style for other pages
  return `
    <div class="player-card" onclick="window.location.href='players/${playerSlug}.html'">
      <div class="card-avatar">${displayName.charAt(0)}</div>
      <h3 class="card-name">${displayName}</h3>
      <p class="card-role">${player.role}</p>
      <div class="card-stats">
        <div class="card-stat">
          <span class="card-stat-value">${player.rating}</span>
          <span class="card-stat-label">Rating</span>
        </div>
        <div class="card-stat">
          <span class="card-stat-value">${player.rank}</span>
          <span class="card-stat-label">Rank</span>
        </div>
      </div>
    </div>
  `;
}

function createGuildCard(guild) {
  const guildSlug = guild.id;
  
  // Check if enhanced styles are available (guilds page)
  const cardClass = document.querySelector('.guilds-grid-enhanced') ? 'guild-card-enhanced' : 'guild-card';
  
  if (cardClass === 'guild-card-enhanced') {
    return `
      <a href="guilds/${guildSlug}.html" class="guild-card-enhanced">
        <div class="guild-emblem">${guild.name.charAt(0)}</div>
        <h3 class="guild-name">${guild.name}</h3>
        <p class="guild-motto">${guild.motto}</p>
        <div class="guild-stats">
          <div class="guild-stat">
            <span class="guild-stat-value">${guild.memberCount || 0}</span>
            <span class="guild-stat-label">Members</span>
          </div>
          <div class="guild-stat">
            <span class="guild-stat-value">${guild.level || 1}</span>
            <span class="guild-stat-label">Level</span>
          </div>
        </div>
      </a>
    `;
  }
  
  // Fallback to original card style
  return `
        <div class="guild-card" onclick="window.location.href='guilds/${guildSlug}.html'">
            <div class="card-emblem">${guild.name.charAt(0)}</div>
            <h3 class="card-name">${guild.name}</h3>
            <p class="card-motto">${guild.motto}</p>
            <div class="card-stats">
                <div class="card-stat">
                    <span class="card-stat-value">${guild.memberCount}</span>
                    <span class="card-stat-label">Members</span>
                </div>
                <div class="card-stat">
                    <span class="card-stat-value">${guild.level}</span>
                    <span class="card-stat-label">Level</span>
                </div>
            </div>
        </div>
    `;
}

function createArticleCard(article) {
  const author = data.players.find((p) => p.id === article.authorId);
  const authorIGN = author ? (author.ign || author.name) : article.authorId.replace(/_/g, ' ');
  const articleFilename = article.id;
  
  // Check if enhanced styles are available (articles page)
  const isEnhanced = document.querySelector('.grid-enhanced');
  
  if (isEnhanced) {
    return `
      <a href="articles/${articleFilename}.html" class="card-enhanced" style="text-align: left;">
        <h3 style="font-size: clamp(1.125rem, 4vw, 1.375rem); font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">${article.title}</h3>
        <p style="color: var(--text-secondary); font-size: clamp(0.875rem, 3vw, 1rem); margin-bottom: 1rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${article.excerpt}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: clamp(0.75rem, 2.5vw, 0.875rem);">
          <span style="color: var(--text-muted);">By ${authorIGN}</span>
          <span style="background: var(--bg-tertiary); padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 600;">${article.category}</span>
        </div>
      </a>
    `;
  }
  
  // Fallback to original card style
  return `
        <div class="article-card" onclick="window.location.href='articles/${articleFilename}.html'">
            <h3 class="article-card-title">${article.title}</h3>
            <p class="article-card-excerpt">${article.excerpt}</p>
            <div class="article-card-meta">
                <span>By ${authorIGN}</span>
                <span class="article-category">${article.category}</span>
            </div>
        </div>
    `;
}
