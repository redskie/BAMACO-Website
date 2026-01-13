# Admin Content Manager - User Guide

## Overview
The Admin Content Manager is a comprehensive administrative panel that allows authorized admin users to manage player profiles, view statistics, and perform various administrative tasks across the BAMACO website.

## Access Requirements
- Must have an admin account with `isAdmin: true` in the Firebase database
- Must know the admin access code (set during profile creation)
- Admin credentials (Friend Code + Password)

## Features

### 🔐 Authentication System
- **Secure Login**: Validates admin credentials against Firebase
- **Session Management**: Maintains login session for 30 days
- **Auto-Redirect**: Redirects non-admin users to home page

### 📊 Dashboard Overview
The main dashboard displays key metrics:
- **Total Players**: Count of all registered players
- **Admin Accounts**: Number of users with admin privileges  
- **Active Guilds**: Number of registered guilds
- **Published Articles**: Count of available guides/articles

### 👥 Player Management
Comprehensive player profile management with:
- **Search & Filter**: Find players by IGN, name, or friend code
- **Filter Options**:
  - All Players
  - Admins Only  
  - Regular Players
  - Recent (last 7 days)

### ✏️ Player Profile Editing
Edit any player's profile including:
- **Basic Info**: IGN, Real Name, Rating, Rank
- **Personal Info**: Title, Age, Motto, Bio
- **Admin Settings**: Grant/revoke admin privileges, set admin role

### 📝 Action Logging
Tracks all administrative actions:
- Player profile updates
- Admin privilege changes
- Login/logout events
- Automatic timestamping

## How to Use

### 1. Accessing the Admin Panel
1. Go to `admin-content-manager.html`
2. Enter your Friend Code and Password
3. Click "Authenticate"

**Note**: The admin link (👑 Admin) will automatically appear in the navigation bar for logged-in admin users.

### 2. Managing Players
1. **Find a Player**: Use the search box or filters
2. **Edit Profile**: Click the "Edit" button next to any player
3. **Update Information**: Modify fields as needed
4. **Save Changes**: Click "Save Changes"

### 3. Admin Privilege Management
When editing a player:
1. Check/uncheck "Admin Privileges"
2. Select admin role: Admin, Moderator, or Owner
3. Save changes

### 4. Viewing Player Profiles
Click "View" next to any player to open their public profile in a new tab.

## Admin Roles & Permissions

### Owner (👑)
- Full access to all features
- Can promote/demote other admins
- Highest level of access

### Admin (⭐)
- Can edit all player profiles
- Can manage regular users
- Cannot modify other admin accounts

### Moderator (🛡️)
- Limited editing permissions
- Can assist with content moderation
- Basic administrative access

## Security Features

### Access Control
- **Friend Code Validation**: Must be a registered player
- **Admin Verification**: Account must have `isAdmin: true`
- **Session Validation**: Checks session validity on each page load

### Audit Trail
- **Action Logging**: All changes are recorded
- **Timestamp Tracking**: Every action includes date/time
- **Admin Attribution**: Shows which admin performed each action

### Data Protection
- **Input Validation**: All form data is validated
- **Secure Updates**: Uses Firebase security rules
- **Session Management**: Automatic logout on session expiry

## Technical Implementation

### Database Structure
Player records include admin fields:
```javascript
{
  friendCode: "string",
  ign: "string", 
  name: "string",
  isAdmin: boolean,
  adminRole: "admin" | "moderator" | "owner",
  // ... other player fields
}
```

### Session Storage
Admin session stored in `localStorage`:
```javascript
{
  user: {
    friendCode: "string",
    ign: "string", 
    isAdmin: true,
    adminRole: "string"
  },
  expiresAt: timestamp
}
```

## Troubleshooting

### Cannot Access Admin Panel
1. **Check Admin Status**: Verify your account has `isAdmin: true` in Firebase
2. **Session Expired**: Clear localStorage and log in again
3. **Wrong Credentials**: Verify Friend Code and password

### Cannot Edit Players
1. **Permissions**: Ensure your admin role has sufficient privileges
2. **Network Issues**: Check Firebase connectivity
3. **Session Validity**: Refresh page and try again

### Changes Not Saving
1. **Validation Errors**: Check for required fields
2. **Database Permissions**: Verify Firebase rules allow updates
3. **Session Expired**: Re-authenticate and try again

## Best Practices

### Admin Account Management
- **Regularly Review**: Audit admin accounts periodically
- **Principle of Least Privilege**: Only grant necessary permissions
- **Secure Credentials**: Use strong passwords and keep access codes private

### Player Management
- **Verify Changes**: Double-check edits before saving
- **Document Actions**: Use descriptive action logs
- **Backup Important Data**: Consider exporting critical information

### Security
- **Regular Sessions**: Log out when finished
- **Monitor Activity**: Review action logs regularly
- **Update Credentials**: Change access codes periodically

## API Integration

The admin panel integrates with existing BAMACO systems:
- **Players Database**: Full CRUD operations via `playersDB`
- **Guilds Database**: Read access via `guildsDB`  
- **Articles Database**: Read access via `articlesDB`
- **Real-time Updates**: Live synchronization with Firebase

## Future Enhancements

Planned features for future releases:
- Guild management capabilities
- Article/guide editing
- Bulk player operations
- Advanced reporting
- User activity analytics
- Mobile app integration

---

For technical support or feature requests, contact the BAMACO development team.