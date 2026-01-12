/**
 * ============================================================================
 * BAMACO USER MENU & MEMBER FEATURES
 * ============================================================================
 * 
 * Provides: User menu, queue requests, profile editing, reports
 * Only visible when logged in
 */

class UserMenu {
  constructor() {
    this.isLoggedIn = false;
    this.user = null;
    this.isAdmin = false;
    this.notifications = [];
    
    this.init();
  }

  init() {
    this.checkSession();
    this.injectUserMenu();
    this.setupEventListeners();
    
    if (this.isAdmin) {
      this.setupAdminNotifications();
    }
  }

  checkSession() {
    const session = localStorage.getItem('bamaco_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.expiresAt > Date.now()) {
          this.isLoggedIn = true;
          this.user = parsed.user;
          this.isAdmin = parsed.user.isAdmin || false;
        }
      } catch (e) {
        this.isLoggedIn = false;
      }
    }
  }

  injectUserMenu() {
    // Wait for navbar to load
    setTimeout(() => {
      const navbar = document.querySelector('nav') || document.querySelector('.navbar');
      if (!navbar) return;

      if (this.isLoggedIn) {
        this.injectLoggedInMenu();
      } else {
        this.injectGuestMenu();
      }

      // Inject floating action buttons for members
      if (this.isLoggedIn) {
        this.injectMemberActions();
      }
    }, 500);
  }

  injectLoggedInMenu() {
    const menuHTML = `
      <div class="user-menu-container relative">
        <button id="userMenuBtn" class="flex items-center gap-2 px-3 py-2 bg-bg-card border border-border-primary rounded-lg hover-btn-secondary transition-all">
          <div class="w-8 h-8 bg-accent-pink rounded-full flex items-center justify-center text-white font-bold text-sm">
            ${this.user.ign?.charAt(0).toUpperCase() || '?'}
          </div>
          <span class="hidden sm:inline text-sm font-semibold">${this.user.ign || 'Player'}</span>
          ${this.isAdmin ? '<span class="text-xs px-1.5 py-0.5 bg-accent-purple text-white rounded">ADMIN</span>' : ''}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div id="userMenuDropdown" class="absolute right-0 top-full mt-2 w-64 bg-bg-card border border-border-primary rounded-xl shadow-xl hidden z-50">
          <div class="p-4 border-b border-border-primary">
            <p class="font-bold text-text-primary">${this.user.ign || 'Player'}</p>
            <p class="text-xs text-text-muted">FC: ${this.formatFriendCode(this.user.friendCode)}</p>
          </div>
          
          <div class="p-2">
            <button onclick="userMenu.openEditProfile()" class="w-full px-4 py-2 text-left rounded-lg hover:bg-bg-tertiary transition-colors flex items-center gap-3">
              <span>✏️</span> Edit My Profile
            </button>
            <button onclick="userMenu.openQueueRequest()" class="w-full px-4 py-2 text-left rounded-lg hover:bg-bg-tertiary transition-colors flex items-center gap-3">
              <span>🎮</span> Request Queue Slot
            </button>
            <button onclick="userMenu.openReportForm()" class="w-full px-4 py-2 text-left rounded-lg hover:bg-bg-tertiary transition-colors flex items-center gap-3">
              <span>📝</span> Submit Report/Request
            </button>
            <a href="players/${this.sanitizeFilename(this.user.ign)}.html" class="w-full px-4 py-2 text-left rounded-lg hover:bg-bg-tertiary transition-colors flex items-center gap-3 block">
              <span>👤</span> View My Profile
            </a>
            ${this.isAdmin ? `
              <div class="border-t border-border-primary my-2"></div>
              <button onclick="userMenu.openAdminPanel()" class="w-full px-4 py-2 text-left rounded-lg hover:bg-bg-tertiary transition-colors flex items-center gap-3 text-accent-purple">
                <span>⚙️</span> Admin Panel
                ${this.notifications.length > 0 ? `<span class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">${this.notifications.length}</span>` : ''}
              </button>
            ` : ''}
          </div>
          
          <div class="p-2 border-t border-border-primary">
            <button onclick="userMenu.logout()" class="w-full px-4 py-2 text-left rounded-lg hover:bg-red-100 text-red-600 transition-colors flex items-center gap-3">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>
    `;

    // Find nav actions area and inject
    const navActions = document.querySelector('.nav-actions') || document.querySelector('nav .flex.gap');
    if (navActions) {
      navActions.insertAdjacentHTML('beforeend', menuHTML);
    } else {
      // Fallback: add to end of navbar
      const navbar = document.querySelector('nav');
      if (navbar) {
        const wrapper = document.createElement('div');
        wrapper.className = 'ml-auto';
        wrapper.innerHTML = menuHTML;
        navbar.appendChild(wrapper);
      }
    }

    // Setup dropdown toggle
    document.getElementById('userMenuBtn')?.addEventListener('click', () => {
      document.getElementById('userMenuDropdown')?.classList.toggle('hidden');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu-container')) {
        document.getElementById('userMenuDropdown')?.classList.add('hidden');
      }
    });
  }

  injectGuestMenu() {
    const menuHTML = `
      <button onclick="userMenu.showLoginModal()" class="px-4 py-2 bg-accent-pink text-white font-semibold rounded-lg hover-btn-primary text-sm">
        Login
      </button>
    `;

    const navActions = document.querySelector('.nav-actions') || document.querySelector('nav');
    if (navActions) {
      const wrapper = document.createElement('div');
      wrapper.className = 'ml-auto';
      wrapper.innerHTML = menuHTML;
      navActions.appendChild(wrapper);
    }
  }

  injectMemberActions() {
    // Add floating member action button
    const fabHTML = `
      <div id="memberFab" class="fixed bottom-24 right-4 sm:right-6 z-40">
        <button onclick="userMenu.toggleMemberActions()" class="w-14 h-14 bg-accent-purple text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform">
          ⚡
        </button>
        
        <div id="memberActionsMenu" class="absolute bottom-full right-0 mb-3 hidden">
          <div class="bg-bg-card border border-border-primary rounded-xl shadow-xl p-2 min-w-[200px]">
            <button onclick="userMenu.openQueueRequest()" class="w-full px-4 py-3 text-left rounded-lg hover:bg-bg-tertiary transition-colors flex items-center gap-3">
              <span>🎮</span> Request Queue
            </button>
            <button onclick="userMenu.openEditProfile()" class="w-full px-4 py-3 text-left rounded-lg hover:bg-bg-tertiary transition-colors flex items-center gap-3">
              <span>✏️</span> Edit Profile
            </button>
            <button onclick="userMenu.openReportForm()" class="w-full px-4 py-3 text-left rounded-lg hover:bg-bg-tertiary transition-colors flex items-center gap-3">
              <span>📝</span> Submit Report
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', fabHTML);
  }

  toggleMemberActions() {
    document.getElementById('memberActionsMenu')?.classList.toggle('hidden');
  }

  setupEventListeners() {
    window.addEventListener('bamaco-auth-change', (e) => {
      this.isLoggedIn = e.detail.isLoggedIn;
      this.user = e.detail.user;
      this.isAdmin = e.detail.isAdmin;
      this.injectUserMenu();
    });

    // Close member actions on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#memberFab')) {
        document.getElementById('memberActionsMenu')?.classList.add('hidden');
      }
    });
  }

  setupAdminNotifications() {
    // Listen for admin notifications from Firebase
    // This would connect to Firebase in production
    setInterval(() => {
      this.checkNotifications();
    }, 30000); // Check every 30 seconds
  }

  async checkNotifications() {
    // In production, this would fetch from Firebase
    const stored = localStorage.getItem('bamaco_admin_notifications');
    if (stored) {
      this.notifications = JSON.parse(stored).filter(n => !n.read);
      this.updateNotificationBadge();
    }
  }

  updateNotificationBadge() {
    const badge = document.querySelector('#userMenuBtn .bg-red-500');
    if (badge) {
      badge.textContent = this.notifications.length;
      badge.classList.toggle('hidden', this.notifications.length === 0);
    }
  }

  // ========================================================================
  // MEMBER ACTIONS
  // ========================================================================

  openQueueRequest() {
    this.closeAllMenus();
    this.showModal('queueRequest', `
      <div class="text-center mb-6">
        <div class="text-5xl mb-4">🎮</div>
        <h2 class="text-2xl font-bold">Request Queue Slot</h2>
        <p class="text-text-muted mt-2">Request to join the queue. An admin will approve your request.</p>
      </div>
      
      <div class="bg-bg-tertiary rounded-lg p-4 mb-6">
        <p class="text-sm"><strong>Player:</strong> ${this.user.ign}</p>
        <p class="text-sm text-text-muted">Your request will be sent to active admins</p>
      </div>
      
      <div id="queueRequestResult" class="hidden mb-4 p-3 rounded-lg text-sm"></div>
      
      <div class="flex gap-3">
        <button onclick="userMenu.submitQueueRequest()" class="flex-1 px-6 py-3 bg-accent-pink text-white font-semibold rounded-lg hover-btn-primary">
          Send Request
        </button>
        <button onclick="userMenu.closeModal()" class="px-6 py-3 bg-bg-secondary border border-border-primary rounded-lg hover-btn-secondary">
          Cancel
        </button>
      </div>
    `);
  }

  async submitQueueRequest() {
    const resultDiv = document.getElementById('queueRequestResult');
    
    try {
      // Store request in localStorage (in production, use Firebase)
      const requests = JSON.parse(localStorage.getItem('bamaco_queue_requests') || '[]');
      const newRequest = {
        id: Date.now().toString(),
        friendCode: this.user.friendCode,
        ign: this.user.ign,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };
      requests.push(newRequest);
      localStorage.setItem('bamaco_queue_requests', JSON.stringify(requests));

      // Notify admins (store notification)
      const notifications = JSON.parse(localStorage.getItem('bamaco_admin_notifications') || '[]');
      notifications.push({
        id: Date.now().toString(),
        type: 'queue_request',
        requestId: newRequest.id,
        playerIgn: this.user.ign,
        message: `${this.user.ign} requests to join the queue`,
        read: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('bamaco_admin_notifications', JSON.stringify(notifications));

      resultDiv.className = 'mb-4 p-3 rounded-lg text-sm bg-green-100 text-green-700 border border-green-300';
      resultDiv.textContent = '✅ Request sent! An admin will review it shortly.';
      resultDiv.classList.remove('hidden');

      setTimeout(() => this.closeModal(), 2000);
      
    } catch (error) {
      resultDiv.className = 'mb-4 p-3 rounded-lg text-sm bg-red-100 text-red-700 border border-red-300';
      resultDiv.textContent = '❌ Failed to send request. Please try again.';
      resultDiv.classList.remove('hidden');
    }
  }

  openEditProfile() {
    this.closeAllMenus();
    this.showModal('editProfile', `
      <div class="mb-6">
        <h2 class="text-2xl font-bold">Edit My Profile</h2>
        <p class="text-text-muted mt-2">Update your profile information</p>
      </div>
      
      <form id="editProfileForm" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-2">Real Name (Optional)</label>
          <input type="text" id="editFullName" placeholder="Leave blank for REDACTED" 
            class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink">
        </div>
        
        <div>
          <label class="block text-sm font-semibold mb-2">Personal Motto</label>
          <input type="text" id="editMotto" placeholder="Your personal motto" maxlength="100"
            class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink">
        </div>
        
        <div>
          <label class="block text-sm font-semibold mb-2">Bio</label>
          <textarea id="editBio" rows="4" placeholder="Tell us about yourself..." maxlength="500"
            class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink resize-none"></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-semibold mb-2">Year Started Playing</label>
          <input type="number" id="editYearStarted" min="2012" max="2026" placeholder="e.g., 2020"
            class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink">
        </div>
        
        <div id="editProfileResult" class="hidden p-3 rounded-lg text-sm"></div>
        
        <div class="flex gap-3 pt-2">
          <button type="submit" class="flex-1 px-6 py-3 bg-accent-pink text-white font-semibold rounded-lg hover-btn-primary">
            Save Changes
          </button>
          <button type="button" onclick="userMenu.closeModal()" class="px-6 py-3 bg-bg-secondary border border-border-primary rounded-lg hover-btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    `);

    document.getElementById('editProfileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitProfileEdit();
    });
  }

  async submitProfileEdit() {
    const resultDiv = document.getElementById('editProfileResult');
    const updates = {
      fullName: document.getElementById('editFullName').value.trim() || 'REDACTED',
      motto: document.getElementById('editMotto').value.trim(),
      bio: document.getElementById('editBio').value.trim(),
      yearStarted: document.getElementById('editYearStarted').value
    };

    try {
      // Store update request (in production, would update Firebase and trigger GitHub action)
      const updateRequests = JSON.parse(localStorage.getItem('bamaco_profile_updates') || '[]');
      updateRequests.push({
        id: Date.now().toString(),
        friendCode: this.user.friendCode,
        ign: this.user.ign,
        updates,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('bamaco_profile_updates', JSON.stringify(updateRequests));

      resultDiv.className = 'p-3 rounded-lg text-sm bg-green-100 text-green-700 border border-green-300';
      resultDiv.textContent = '✅ Profile update submitted! Changes will be reflected shortly.';
      resultDiv.classList.remove('hidden');

      setTimeout(() => this.closeModal(), 2000);
      
    } catch (error) {
      resultDiv.className = 'p-3 rounded-lg text-sm bg-red-100 text-red-700 border border-red-300';
      resultDiv.textContent = '❌ Failed to update profile. Please try again.';
      resultDiv.classList.remove('hidden');
    }
  }

  openReportForm() {
    this.closeAllMenus();
    this.showModal('report', `
      <div class="mb-6">
        <h2 class="text-2xl font-bold">Submit Report/Request</h2>
        <p class="text-text-muted mt-2">Send feedback, report bugs, or make suggestions</p>
      </div>
      
      <form id="reportForm" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-2">Type</label>
          <select id="reportType" class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink">
            <option value="bug">🐛 Bug Report</option>
            <option value="feature">✨ Feature Request</option>
            <option value="recommendation">💡 Recommendation</option>
            <option value="feedback">💬 General Feedback</option>
            <option value="other">📋 Other</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-semibold mb-2">Title</label>
          <input type="text" id="reportTitle" placeholder="Brief description" required
            class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink">
        </div>
        
        <div>
          <label class="block text-sm font-semibold mb-2">Description</label>
          <textarea id="reportDescription" rows="5" placeholder="Detailed description of your report/request..." required
            class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink resize-none"></textarea>
        </div>
        
        <div id="reportResult" class="hidden p-3 rounded-lg text-sm"></div>
        
        <div class="flex gap-3 pt-2">
          <button type="submit" class="flex-1 px-6 py-3 bg-accent-pink text-white font-semibold rounded-lg hover-btn-primary">
            Submit Report
          </button>
          <button type="button" onclick="userMenu.closeModal()" class="px-6 py-3 bg-bg-secondary border border-border-primary rounded-lg hover-btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    `);

    document.getElementById('reportForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitReport();
    });
  }

  async submitReport() {
    const resultDiv = document.getElementById('reportResult');
    const report = {
      type: document.getElementById('reportType').value,
      title: document.getElementById('reportTitle').value.trim(),
      description: document.getElementById('reportDescription').value.trim()
    };

    if (!report.title || !report.description) {
      resultDiv.className = 'p-3 rounded-lg text-sm bg-yellow-100 text-yellow-700 border border-yellow-300';
      resultDiv.textContent = '⚠️ Please fill in all required fields.';
      resultDiv.classList.remove('hidden');
      return;
    }

    try {
      // Store report (in production, would create GitHub issue)
      const reports = JSON.parse(localStorage.getItem('bamaco_reports') || '[]');
      reports.push({
        id: Date.now().toString(),
        ...report,
        submittedBy: this.user.ign,
        friendCode: this.user.friendCode,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('bamaco_reports', JSON.stringify(reports));

      resultDiv.className = 'p-3 rounded-lg text-sm bg-green-100 text-green-700 border border-green-300';
      resultDiv.textContent = '✅ Report submitted! Thank you for your feedback.';
      resultDiv.classList.remove('hidden');

      setTimeout(() => this.closeModal(), 2000);
      
    } catch (error) {
      resultDiv.className = 'p-3 rounded-lg text-sm bg-red-100 text-red-700 border border-red-300';
      resultDiv.textContent = '❌ Failed to submit report. Please try again.';
      resultDiv.classList.remove('hidden');
    }
  }

  openAdminPanel() {
    // Redirect to admin page with notifications
    window.location.href = 'queue-admin.html';
  }

  // ========================================================================
  // HELPERS
  // ========================================================================

  showModal(type, content) {
    const existingModal = document.getElementById('memberActionModal');
    if (existingModal) existingModal.remove();

    const modalHTML = `
      <div id="memberActionModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="userMenu.closeModal()"></div>
        <div class="relative bg-bg-card border border-border-primary rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          ${content}
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  closeModal() {
    document.getElementById('memberActionModal')?.remove();
  }

  closeAllMenus() {
    document.getElementById('userMenuDropdown')?.classList.add('hidden');
    document.getElementById('memberActionsMenu')?.classList.add('hidden');
  }

  showLoginModal() {
    // Remove guest mode and reload to show auth modal
    sessionStorage.removeItem('bamaco_guest_mode');
    window.location.reload();
  }

  logout() {
    localStorage.removeItem('bamaco_session');
    localStorage.removeItem('bamaco_remember_me');
    sessionStorage.removeItem('bamaco_guest_mode');
    window.location.reload();
  }

  formatFriendCode(code) {
    if (!code) return '---';
    return code.match(/.{1,3}/g)?.join('-') || code;
  }

  sanitizeFilename(name) {
    if (!name) return 'player';
    return name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s]+/g, '-').trim();
  }
}

// Initialize
const userMenu = new UserMenu();
window.userMenu = userMenu;