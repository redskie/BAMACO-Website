/**
 * ============================================================================
 * BAMACO AUTH MODAL COMPONENT
 * ============================================================================
 *
 * Renders the authentication modal on page load
 * Handles: Login, Guest mode, Create Account, Password setup
 */

class AuthModal {
  constructor() {
    this.authSystem = null;
    this.currentView = 'main'; // main, login, register, setPassword
    this.apiData = null;
    this.validFriendCode = false;

    this.init();
  }

  async init() {
    // Wait for auth module to load
    try {
      const authModule = await import('./auth.js');
      this.authSystem = authModule.default;
    } catch (e) {
      console.warn('Auth module not loaded, using standalone mode');
      this.authSystem = new StandaloneAuth();
    }

    // Check if user should see modal
    if (this.shouldShowModal()) {
      this.injectModal();
      this.showModal();
    }

    // Listen for auth events
    this.setupEventListeners();
  }

  shouldShowModal() {
    // Don't show if already logged in
    const session = localStorage.getItem('bamaco_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.expiresAt > Date.now()) {
          return false;
        }
      } catch (e) {}
    }

    // Don't show if in guest mode for this session
    if (sessionStorage.getItem('bamaco_guest_mode') === 'true') {
      return false;
    }

    return true;
  }

  injectModal() {
    const modalHTML = `
      <div id="authModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal Container -->
        <div class="relative bg-bg-card border-2 border-border-primary rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">

          <!-- Main View: Choose Action -->
          <div id="authMainView" class="p-6 sm:p-8">
            <!-- Header -->
            <div class="text-center mb-8">
              <img src="https://maimai.sega.jp/storage/root/logo.png" alt="MaiMai Logo" class="w-auto h-auto mx-auto mb-4 drop-shadow-lg">
              <h2 class="text-2xl sm:text-3xl font-black text-text-primary mb-2">Welcome to BAMACO</h2>
              <p class="text-text-muted text-sm">Bataan MaiMai Community</p>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
              <button onclick="authModal.showLoginView()" class="w-full px-6 py-4 bg-accent-pink text-white font-semibold rounded-xl hover-btn-primary flex items-center justify-center gap-3 text-lg">
                <span>🔑</span> Login
              </button>

              <button onclick="authModal.showRegisterView()" class="w-full px-6 py-4 bg-accent-purple text-white font-semibold rounded-xl hover-btn-primary flex items-center justify-center gap-3 text-lg">
                <span>✨</span> Create Account
              </button>

              <button onclick="authModal.continueAsGuest()" class="w-full px-6 py-4 bg-bg-secondary border-2 border-border-primary text-text-primary font-semibold rounded-xl hover-btn-secondary flex items-center justify-center gap-3 text-lg">
                <span>👤</span> Continue as Guest
              </button>
            </div>

            <!-- Guest Notice -->
            <div class="mt-6 p-4 bg-bg-tertiary/50 rounded-lg border border-border-primary">
              <p class="text-xs text-text-muted text-center">
                <strong>Logged in users get:</strong> Queue requests, profile editing, submit reports & more!
              </p>
            </div>
          </div>

          <!-- Login View -->
          <div id="authLoginView" class="p-6 sm:p-8 hidden">
            <button onclick="authModal.showMainView()" class="mb-4 text-text-muted hover:text-text-primary transition-colors flex items-center gap-2">
              ← Back
            </button>

            <h2 class="text-2xl font-bold text-text-primary mb-6">Login to BAMACO</h2>

            <form id="loginForm" class="space-y-5">
              <!-- Friend Code -->
              <div>
                <label class="block text-sm font-semibold text-text-primary mb-2">
                  MaiMai Friend Code
                </label>
                <input
                  type="text"
                  id="loginFriendCode"
                  placeholder="000-000-000-000-000"
                  maxlength="19"
                  class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all"
                  required>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-semibold text-text-primary mb-2">
                  Password
                </label>
                <div class="relative">
                  <input
                    type="password"
                    id="loginPassword"
                    placeholder="Enter your password"
                    class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all pr-12"
                    required>
                  <button type="button" onclick="authModal.togglePasswordVisibility('loginPassword')" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    👁️
                  </button>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="flex items-center gap-2">
                <input type="checkbox" id="rememberMe" class="w-4 h-4 rounded border-border-primary accent-accent-pink">
                <label for="rememberMe" class="text-sm text-text-muted">Remember me for 30 days</label>
              </div>

              <!-- Error Message -->
              <div id="loginError" class="hidden p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"></div>

              <!-- Submit -->
              <button type="submit" class="w-full px-6 py-4 bg-accent-pink text-white font-semibold rounded-lg hover-btn-primary flex items-center justify-center gap-2">
                <span id="loginBtnText">Login</span>
                <svg id="loginSpinner" class="animate-spin h-5 w-5 hidden" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </form>

            <p class="mt-4 text-center text-sm text-text-muted">
              Don't have an account?
              <button onclick="authModal.showRegisterView()" class="text-accent-pink hover:underline font-semibold">Create one</button>
            </p>
          </div>

          <!-- Register View -->
          <div id="authRegisterView" class="p-6 sm:p-8 hidden">
            <button onclick="authModal.showMainView()" class="mb-4 text-text-muted hover:text-text-primary transition-colors flex items-center gap-2">
              ← Back
            </button>

            <h2 class="text-2xl font-bold text-text-primary mb-6">Create Your Account</h2>

            <form id="registerForm" class="space-y-5">
              <!-- Friend Code -->
              <div>
                <label class="block text-sm font-semibold text-text-primary mb-2">
                  MaiMai Friend Code <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="registerFriendCode"
                  placeholder="000-000-000-000-000"
                  maxlength="19"
                  class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all"
                  required>
                <div id="registerCodeStatus" class="mt-2 text-sm hidden">
                  <div id="registerCodeLoading" class="flex items-center text-text-muted">
                    <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating...
                  </div>
                  <div id="registerCodeValid" class="text-green-600 hidden">✅ Valid! Found: <span id="foundIgn"></span></div>
                  <div id="registerCodeInvalid" class="text-red-500 hidden">❌ Invalid friend code</div>
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-semibold text-text-primary mb-2">
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    type="password"
                    id="registerPassword"
                    placeholder="Create a strong password"
                    class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all pr-12"
                    required>
                  <button type="button" onclick="authModal.togglePasswordVisibility('registerPassword')" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    👁️
                  </button>
                </div>
                <div id="passwordStrength" class="mt-2 space-y-1 text-xs">
                  <div id="passLength" class="text-text-muted">○ At least 8 characters</div>
                  <div id="passUpper" class="text-text-muted">○ One uppercase letter</div>
                  <div id="passNumber" class="text-text-muted">○ One number</div>
                  <div id="passSpecial" class="text-text-muted">○ One special character (!@#$%^&*)</div>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-semibold text-text-primary mb-2">
                  Confirm Password <span class="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="registerPasswordConfirm"
                  placeholder="Confirm your password"
                  class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all"
                  required>
                <div id="passwordMatch" class="mt-1 text-xs hidden"></div>
              </div>

              <!-- Error Message -->
              <div id="registerError" class="hidden p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"></div>

              <!-- Submit -->
              <button type="submit" id="registerBtn" disabled class="w-full px-6 py-4 bg-accent-purple text-white font-semibold rounded-lg hover-btn-primary disabled:bg-text-muted disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <span id="registerBtnText">Validate Friend Code First</span>
                <svg id="registerSpinner" class="animate-spin h-5 w-5 hidden" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </form>

            <p class="mt-4 text-center text-sm text-text-muted">
              Already have an account?
              <button onclick="authModal.showLoginView()" class="text-accent-pink hover:underline font-semibold">Login</button>
            </p>
          </div>

          <!-- Set Password View (for existing profile owners) -->
          <div id="authSetPasswordView" class="p-6 sm:p-8 hidden">
            <div class="text-center mb-6">
              <div class="text-5xl mb-4">🔐</div>
              <h2 class="text-2xl font-bold text-text-primary mb-2">Set Up Your Password</h2>
              <p class="text-text-muted text-sm">We detected you own a profile. Set a password to unlock member features!</p>
            </div>

            <div id="setPasswordProfile" class="p-4 bg-bg-tertiary rounded-lg mb-6 text-center">
              <p class="text-sm text-text-muted">Profile: <strong id="setPasswordIgn">-</strong></p>
            </div>

            <form id="setPasswordForm" class="space-y-5">
              <!-- Password -->
              <div>
                <label class="block text-sm font-semibold text-text-primary mb-2">
                  Create Password
                </label>
                <input
                  type="password"
                  id="setPassword"
                  placeholder="Create a strong password"
                  class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all"
                  required>
                <div id="setPasswordStrength" class="mt-2 space-y-1 text-xs">
                  <div id="setPassLength" class="text-text-muted">○ At least 8 characters</div>
                  <div id="setPassUpper" class="text-text-muted">○ One uppercase letter</div>
                  <div id="setPassNumber" class="text-text-muted">○ One number</div>
                  <div id="setPassSpecial" class="text-text-muted">○ One special character</div>
                </div>
              </div>

              <!-- Confirm -->
              <div>
                <label class="block text-sm font-semibold text-text-primary mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="setPasswordConfirm"
                  placeholder="Confirm password"
                  class="w-full px-4 py-3 border border-border-primary rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all"
                  required>
              </div>

              <div class="flex gap-3">
                <button type="submit" class="flex-1 px-6 py-4 bg-accent-pink text-white font-semibold rounded-lg hover-btn-primary">
                  Set Password
                </button>
                <button type="button" onclick="authModal.skipSetPassword()" class="px-6 py-4 bg-bg-secondary border border-border-primary text-text-primary rounded-lg hover-btn-secondary">
                  Skip
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.attachFormHandlers();
  }

  attachFormHandlers() {
    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Register form
    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    // Set password form
    document.getElementById('setPasswordForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSetPassword();
    });

    // Friend code input formatting & validation
    const registerCode = document.getElementById('registerFriendCode');
    if (registerCode) {
      registerCode.addEventListener('input', (e) => {
        this.formatFriendCode(e.target);
        this.debouncedValidate();
      });
    }

    const loginCode = document.getElementById('loginFriendCode');
    if (loginCode) {
      loginCode.addEventListener('input', (e) => {
        this.formatFriendCode(e.target);
      });
    }

    // Password strength checker
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
      registerPassword.addEventListener('input', () => this.checkPasswordStrength('register'));
    }

    const setPassword = document.getElementById('setPassword');
    if (setPassword) {
      setPassword.addEventListener('input', () => this.checkPasswordStrength('set'));
    }

    // Password match checker
    const confirmPassword = document.getElementById('registerPasswordConfirm');
    if (confirmPassword) {
      confirmPassword.addEventListener('input', () => this.checkPasswordMatch());
    }
  }

  setupEventListeners() {
    window.addEventListener('bamaco-show-set-password', (e) => {
      this.showSetPasswordView(e.detail);
    });
  }

  // ========================================================================
  // VIEW MANAGEMENT
  // ========================================================================

  showModal() {
    document.getElementById('authModal')?.classList.remove('hidden');
  }

  hideModal() {
    document.getElementById('authModal')?.classList.add('hidden');
  }

  showMainView() {
    this.currentView = 'main';
    document.getElementById('authMainView')?.classList.remove('hidden');
    document.getElementById('authLoginView')?.classList.add('hidden');
    document.getElementById('authRegisterView')?.classList.add('hidden');
    document.getElementById('authSetPasswordView')?.classList.add('hidden');
  }

  showLoginView() {
    this.currentView = 'login';
    document.getElementById('authMainView')?.classList.add('hidden');
    document.getElementById('authLoginView')?.classList.remove('hidden');
    document.getElementById('authRegisterView')?.classList.add('hidden');
    document.getElementById('authSetPasswordView')?.classList.add('hidden');
  }

  showRegisterView() {
    this.currentView = 'register';
    document.getElementById('authMainView')?.classList.add('hidden');
    document.getElementById('authLoginView')?.classList.add('hidden');
    document.getElementById('authRegisterView')?.classList.remove('hidden');
    document.getElementById('authSetPasswordView')?.classList.add('hidden');
  }

  showSetPasswordView(profileData) {
    this.currentView = 'setPassword';
    this.profileData = profileData;

    document.getElementById('setPasswordIgn').textContent = profileData.ign;

    document.getElementById('authMainView')?.classList.add('hidden');
    document.getElementById('authLoginView')?.classList.add('hidden');
    document.getElementById('authRegisterView')?.classList.add('hidden');
    document.getElementById('authSetPasswordView')?.classList.remove('hidden');
  }

  // ========================================================================
  // FORM HANDLING
  // ========================================================================

  formatFriendCode(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 15) value = value.substring(0, 15);
    input.value = value;
  }

  debouncedValidate() {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.validateFriendCode();
    }, 1000);
  }

  async validateFriendCode() {
    const input = document.getElementById('registerFriendCode');
    const cleanCode = input.value.replace(/\D/g, '');

    if (cleanCode.length !== 15) {
      this.showCodeStatus('hide');
      this.updateRegisterButton(false);
      return;
    }

    this.showCodeStatus('loading');

    try {
      const response = await fetch(`https://maimai-data-get.onrender.com/api/player/${cleanCode}`);
      const data = await response.json();

      if (data.success) {
        this.apiData = data;
        document.getElementById('foundIgn').textContent = data.ign;
        this.showCodeStatus('valid');
        this.validFriendCode = true;
        this.updateRegisterButton(this.isPasswordValid());
      } else {
        this.showCodeStatus('invalid');
        this.validFriendCode = false;
        this.updateRegisterButton(false);
      }
    } catch (error) {
      this.showCodeStatus('invalid');
      this.validFriendCode = false;
      this.updateRegisterButton(false);
    }
  }

  showCodeStatus(status) {
    const container = document.getElementById('registerCodeStatus');
    const loading = document.getElementById('registerCodeLoading');
    const valid = document.getElementById('registerCodeValid');
    const invalid = document.getElementById('registerCodeInvalid');

    container?.classList.toggle('hidden', status === 'hide');
    loading?.classList.toggle('hidden', status !== 'loading');
    valid?.classList.toggle('hidden', status !== 'valid');
    invalid?.classList.toggle('hidden', status !== 'invalid');
  }

  checkPasswordStrength(prefix) {
    const password = document.getElementById(prefix === 'register' ? 'registerPassword' : 'setPassword').value;
    const pre = prefix === 'register' ? 'pass' : 'setPass';

    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    document.getElementById(`${pre}Length`).innerHTML = checks.length ? '✅ At least 8 characters' : '○ At least 8 characters';
    document.getElementById(`${pre}Length`).className = checks.length ? 'text-green-600' : 'text-text-muted';

    document.getElementById(`${pre}Upper`).innerHTML = checks.upper ? '✅ One uppercase letter' : '○ One uppercase letter';
    document.getElementById(`${pre}Upper`).className = checks.upper ? 'text-green-600' : 'text-text-muted';

    document.getElementById(`${pre}Number`).innerHTML = checks.number ? '✅ One number' : '○ One number';
    document.getElementById(`${pre}Number`).className = checks.number ? 'text-green-600' : 'text-text-muted';

    document.getElementById(`${pre}Special`).innerHTML = checks.special ? '✅ One special character' : '○ One special character (!@#$%^&*)';
    document.getElementById(`${pre}Special`).className = checks.special ? 'text-green-600' : 'text-text-muted';

    if (prefix === 'register') {
      this.updateRegisterButton(this.validFriendCode && this.isPasswordValid());
    }
  }

  isPasswordValid() {
    const password = document.getElementById('registerPassword')?.value || '';
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  checkPasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerPasswordConfirm').value;
    const matchDiv = document.getElementById('passwordMatch');

    if (confirm.length > 0) {
      matchDiv.classList.remove('hidden');
      if (password === confirm) {
        matchDiv.textContent = '✅ Passwords match';
        matchDiv.className = 'mt-1 text-xs text-green-600';
      } else {
        matchDiv.textContent = '❌ Passwords do not match';
        matchDiv.className = 'mt-1 text-xs text-red-500';
      }
    } else {
      matchDiv.classList.add('hidden');
    }
  }

  updateRegisterButton(enabled) {
    const btn = document.getElementById('registerBtn');
    const text = document.getElementById('registerBtnText');

    btn.disabled = !enabled;
    text.textContent = enabled ? '✨ Create Account' : 'Complete All Fields';
  }

  togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  // ========================================================================
  // AUTH ACTIONS
  // ========================================================================

  async handleLogin() {
    const friendCode = document.getElementById('loginFriendCode').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorDiv = document.getElementById('loginError');
    const btn = document.querySelector('#loginForm button[type="submit"]');
    const spinner = document.getElementById('loginSpinner');
    const text = document.getElementById('loginBtnText');

    btn.disabled = true;
    spinner.classList.remove('hidden');
    text.textContent = 'Logging in...';
    errorDiv.classList.add('hidden');

    try {
      const result = await this.authSystem.login(friendCode, password, rememberMe);

      if (result.success) {
        this.hideModal();
        window.location.reload();
      } else {
        errorDiv.textContent = result.error;
        errorDiv.classList.remove('hidden');
      }
    } catch (error) {
      errorDiv.textContent = 'Login failed. Please try again.';
      errorDiv.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      spinner.classList.add('hidden');
      text.textContent = 'Login';
    }
  }

  async handleRegister() {
    if (!this.validFriendCode || !this.apiData) {
      alert('Please validate your friend code first.');
      return;
    }

    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerPasswordConfirm').value;
    const errorDiv = document.getElementById('registerError');
    const btn = document.getElementById('registerBtn');
    const spinner = document.getElementById('registerSpinner');
    const text = document.getElementById('registerBtnText');

    if (password !== confirm) {
      errorDiv.textContent = 'Passwords do not match';
      errorDiv.classList.remove('hidden');
      return;
    }

    btn.disabled = true;
    spinner.classList.remove('hidden');
    text.textContent = 'Creating account...';
    errorDiv.classList.add('hidden');

    try {
      const friendCode = document.getElementById('registerFriendCode').value;
      const result = await this.authSystem.register(friendCode, password, this.apiData);

      if (result.success) {
        this.hideModal();
        window.location.reload();
      } else {
        errorDiv.textContent = result.error || result.errors?.join(', ');
        errorDiv.classList.remove('hidden');
      }
    } catch (error) {
      errorDiv.textContent = 'Registration failed. Please try again.';
      errorDiv.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      spinner.classList.add('hidden');
      text.textContent = '✨ Create Account';
    }
  }

  async handleSetPassword() {
    const password = document.getElementById('setPassword').value;
    const confirm = document.getElementById('setPasswordConfirm').value;

    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    try {
      const result = await this.authSystem.setPassword(this.profileData.friendCode, password);

      if (result.success) {
        alert('Password set successfully! You can now login.');
        this.showLoginView();
      } else {
        alert(result.error || result.errors?.join(', '));
      }
    } catch (error) {
      alert('Failed to set password. Please try again.');
    }
  }

  continueAsGuest() {
    this.authSystem.continueAsGuest();
    this.hideModal();
  }

  skipSetPassword() {
    sessionStorage.setItem('bamaco_guest_mode', 'true');
    this.hideModal();
  }
}

// Standalone auth fallback (when auth.js isn't loaded as module)
class StandaloneAuth {
  async login(friendCode, password, rememberMe) {
    // Simplified login without Firebase
    const cleanCode = friendCode.replace(/\D/g, '');
    const users = JSON.parse(localStorage.getItem('bamaco_users') || '{}');

    if (!users[cleanCode]) {
      return { success: false, error: 'Account not found' };
    }

    const hashedInput = await this.hashPassword(password);
    if (users[cleanCode].passwordHash !== hashedInput) {
      return { success: false, error: 'Incorrect password' };
    }

    const session = {
      user: users[cleanCode],
      expiresAt: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000)
    };
    localStorage.setItem('bamaco_session', JSON.stringify(session));
    localStorage.setItem('bamaco_remember_me', rememberMe.toString());

    return { success: true, user: users[cleanCode] };
  }

  async register(friendCode, password, apiData) {
    const cleanCode = friendCode.replace(/\D/g, '');
    const users = JSON.parse(localStorage.getItem('bamaco_users') || '{}');

    if (users[cleanCode]) {
      return { success: false, error: 'Account already exists' };
    }

    const passwordHash = await this.hashPassword(password);
    users[cleanCode] = {
      friendCode: cleanCode,
      ign: apiData.ign,
      rating: apiData.rating,
      passwordHash,
      isAdmin: false
    };

    localStorage.setItem('bamaco_users', JSON.stringify(users));
    localStorage.setItem('bamaco_profile_owner', JSON.stringify({ friendCode: cleanCode, ign: apiData.ign }));

    const session = {
      user: users[cleanCode],
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    };
    localStorage.setItem('bamaco_session', JSON.stringify(session));

    return { success: true, user: users[cleanCode] };
  }

  async setPassword(friendCode, password) {
    const cleanCode = friendCode.replace(/\D/g, '');
    const users = JSON.parse(localStorage.getItem('bamaco_users') || '{}');

    if (!users[cleanCode]) {
      return { success: false, error: 'Profile not found' };
    }

    users[cleanCode].passwordHash = await this.hashPassword(password);
    localStorage.setItem('bamaco_users', JSON.stringify(users));

    return { success: true };
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'bamaco_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  continueAsGuest() {
    sessionStorage.setItem('bamaco_guest_mode', 'true');
  }
}

// Initialize and expose globally
const authModal = new AuthModal();
window.authModal = authModal;
