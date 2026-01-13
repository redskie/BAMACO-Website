# BAMACO Website - End-to-End Workflow Guide

Comprehensive reference for profile creation/editing, player/guild/article flows, admin tasks, queue handling, and key DOM IDs/variables used across the project. This complements README and QUICK_REFERENCE.

---

## Environment & Data Sources
- **No Node/npm**: Use Python tooling only (e.g., `python -m http.server`).
- **Design system**: `/assets/tailwind-config.js` is the single source of truth (no inline styles).
- **Firestore (canonical)**: `players`, `guilds`, `articles`, `achievements`.
- **Realtime Database (queue-only)**: `queue`, `currentlyPlaying`, `gameHistory`, `playerCredits`.
- **Friend codes**: 15 continuous digits (no dashes/spaces) everywhere.

---

## Profile Creation (create-profile.html)
- **Goal**: Create a new player doc in Firestore `players/{friendCode}` with validated MaiMai data.
- **Inputs**:
  - `friendCode` (id: `friendCode`) – digits-only enforced; validated via MaiMai API.
  - Auth fields: `password`, `confirmPassword` with strength + match checks.
  - Optional profile details (IGN auto-fetched but user fields also captured).
- **Validation Flow**:
  1. Input sanitization strips non-digits, caps at 15.
  2. `Validate Friend Code` auto-check triggers MaiMai API `https://maimai-data-get.onrender.com/api/player/{code}`.
  3. If Firestore already has the code, form blocks submission.
  4. UI states: `friendCodeStatus` container with `friendCodeLoading`, `friendCodeValid`, `friendCodeInvalid`.
  5. Submit button text controlled via `submitText`; disabled until code + password rules pass.
- **Data Flow**:
  - On success, calls `playersDB.createPlayer` with cleaned code and hashed password (SHA-256 + salt).
  - Success modal button `viewProfileBtn` links to `player-profile.html?id={friendCode}`.
- **Key DOM IDs**: `friendCode`, `friendCodeStatus`, `friendCodeLoading`, `friendCodeValid`, `friendCodeInvalid`, `apiDataDisplay`, `apiIgn`, `apiRating`, `apiTitle`, `apiTrophy`, `submitBtn`, `submitText`, password strength bars `strength1-4`, `strengthText`, `passwordMatch`.

## Profile Editing (edit-profile.html)
- **Goal**: Update an existing player doc.
- **Inputs**: `friend-code` (prefilled when session user has friendCode), other profile fields, `edit-key` (from local storage or query).
- **Access Control**: Requires matching `editKey` or authenticated session user with same friendCode.
- **Flow**:
  - Loads player via `playersDB.getPlayer(friendCode)`.
  - Submits updates via `playersDB.updatePlayer(friendCode, updates, editKey)`.
  - Post-update CTA links to `player-profile.html?id={friendCode}`.
- **Key DOM IDs**: `edit-profile-form`, `friend-code`, `edit-key`, `status-message`, `error-message`, `success-message`.

## Player Profile (player-profile.html)
- **Goal**: Render player data from Firestore and allow owner to navigate to edit.
- **Data load**: Query param `id`/`friendCode`; uses `playersDB.getPlayer`.
- **Formatting**: Friend code displayed as digits-only (15 max) via `formatFriendCode`.
- **Ownership check**: Compares local session `friendCode` or stored `editKey` to show edit button (`edit-profile-section`, `edit-profile-btn`).
- **Key DOM IDs**: `player-name`, `player-title`, `player-rating`, `player-rank`, `player-joined`, `player-full-name`, `player-friend-code`, `player-nickname`, `player-motto`, `player-age`, `player-trophy`, `guild-section`, `guild-link`, `achievements-section`, `achievements-container`, `articles-section`, `articles-container`, `error-message`.

## Auth Modal (assets/auth-modal.js)
- **Views**: `authMainView`, `authLoginView`, `authRegisterView`, `authSetPasswordView`.
- **Register**: `registerFriendCode` digits-only; uses MaiMai API validation; `registerBtnText` reflects validation state; statuses `registerCodeLoading`, `registerCodeValid`, `registerCodeInvalid`.
- **Login**: `loginFriendCode`, `loginPassword`.
- **State**: `validFriendCode`, `profileData`, `apiData` for fetched MaiMai data.

## Admin Surfaces
- **queue-admin.html** (RTDB queue mgmt)
  - Shows pending requests and queue; friend codes displayed digits-only via `formatFriendCode`.
  - Key IDs: `newPlayerName`, `queueList`, `currentlyPlayingList`, `historyList`, `creditsList`, modals for approvals.
- **admin-content-manager.html**
  - Player table with admin badges; friend code rendered digits-only.
  - Actions: `editPlayer(friendCode)`, `viewPlayer(friendCode)`.
- **id-manager-admin.html** (if present)
  - Manages achievements/articles per player; relies on `friendCode` selections.

## Players Module (assets/players-db.js)
- **Firestore CRUD**: `createPlayer`, `getPlayer`, `updatePlayer`, `subscribeToPlayers`, `subscribeToPlayer`, plus assignment helpers (achievements/articles) if present.
- **IDs**: Document ID equals `friendCode` (digits only; length validated by MaiMai API).

## Guilds Module (assets/guilds-db.js)
- **Firestore**: `guilds/{id}` documents.
- **Usage**: `guild-profile.html?id={guildId}` uses module to fetch guild data.

## Articles Module (assets/articles-db.js)
- **Firestore**: `articles/{id}` documents with HTML content.
- **Usage**: `article.html?id={articleId}` renders content; author linkage via `authorId` (player friendCode).

## Achievements Module (assets/achievements-db.js)
- **Firestore**: `achievements/{id}` documents; can assign to players by friendCode.

## Queue System
- **Data store**: RTDB paths `queue`, `currentlyPlaying`, `gameHistory`, `playerCredits`.
- **Pages**: `queue.html` (public), `queue-admin.html` (admin), `queue-history.html` (history view).
- **Patterns**: `onValue` listeners for live updates; admin actions mutate RTDB nodes.

## Navigation & User Menu
- **Navbar**: `/assets/navbar.js` builds links from `NAVBAR_CONFIG` (edit here for nav changes).
- **User menu**: `/assets/user-menu.js` renders session info; friend code shown digits-only via `formatFriendCode`.

## Variables, IDs, and Tags (Key References)
- **Friend code inputs**: `friendCode` (create), `friend-code` (edit), `registerFriendCode` (auth register), `loginFriendCode` (auth login).
- **Status/validation**: `friendCodeStatus`, `friendCodeLoading`, `friendCodeValid`, `friendCodeInvalid`, `apiDataDisplay` (create); `registerCodeLoading`, `registerCodeValid`, `registerCodeInvalid` (auth modal).
- **Buttons**: `submitBtn`/`submitText` (create-profile), `registerBtnText` (auth modal), `edit-profile-btn` (player profile).
- **Display fields**: `player-friend-code`, `player-name`, `player-title`, `guild-link`, `achievements-container`, `articles-container`.
- **Admin tables**: `playersTableContainer`, `playersTableBody`, `playersEmpty`, `playersLoading` (admin-content-manager); `queueList`, `currentlyPlayingList`, `historyList`, `creditsList` (queue-admin).

---

## Best Practices
- Use digits-only friend codes (no separators); rely on MaiMai API for length/validity.
- Keep design tokens centralized in `tailwind-config.js`; avoid inline styles.
- Use Firestore modules for CRUD; avoid touching `config/data.json` (legacy).
- Queue writes/read only through RTDB refs from `config/firebase-config.js`.
- After edits, open relevant page in browser to verify UI state/validation flows.
