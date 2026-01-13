// Simple test script to add a test admin user to Firebase
// Open admin-content-manager.html and run this in browser console

// Test admin user data
const testAdminData = {
  friendCode: '123456789',
  ign: 'TestAdmin',
  name: 'Test Administrator', 
  nickname: 'TestAdmin',
  title: 'Site Admin',
  avatarImage: '',
  rating: '15000',
  rank: 'Rainbow',
  age: '25',
  motto: 'Testing the admin system!',
  joined: '2024',
  bio: 'This is a test admin account for demonstrating the admin content manager.',
  guildId: '',
  achievements: [],
  articles: [],
  isAdmin: true,
  adminRole: 'admin',
  isPublic: true,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Create admin user function
async function createTestAdmin() {
  try {
    console.log('Creating test admin user...');
    
    const result = await window.adminManager?.playersDB?.updatePlayer?.('123456789', testAdminData);
    if (!result) {
      // Try direct Firebase approach
      const response = await fetch('https://bamaco-queue-default-rtdb.asia-southeast1.firebasedatabase.app/players/123456789.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testAdminData)
      });
      
      if (response.ok) {
        console.log('✅ Test admin user created successfully!');
        console.log('Login credentials:');
        console.log('Friend Code: 123456789');
        console.log('Password: admin123');
      } else {
        console.error('❌ Failed to create test admin user');
      }
    } else {
      console.log('✅ Test admin user created via admin manager');
    }
  } catch (error) {
    console.error('❌ Error creating test admin:', error);
  }
}

// Auto-create test admin if not exists
console.log('🔧 Admin test script loaded');
console.log('Run createTestAdmin() to create test account');

// Make function globally available
window.createTestAdmin = createTestAdmin;