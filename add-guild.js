// Quick script to add guild data to Firebase
// Run this in browser console

(async function addGuildData() {
  try {
    // Import the guilds database
    const { guildsDB } = await import('./assets/guilds-db.js');
    
    // Add GODARX guild
    const guildData = {
      id: 'godarx',
      name: 'GODARX',
      tag: '[GX]',
      description: 'Premier MaiMai guild in Bataan region',
      members: ['bmcmarx'],
      founded: '2024-01-15',
      logo: 'https://via.placeholder.com/150x150/FF6B9D/FFFFFF?text=GX'
    };
    
    console.log('Adding guild data...', guildData);
    const result = await guildsDB.createGuild(guildData);
    
    if (result) {
      console.log('✅ Guild added successfully!');
      
      // Verify by fetching all guilds
      const allGuilds = await guildsDB.getAllGuilds();
      console.log('📊 All guilds:', allGuilds);
    } else {
      console.log('❌ Failed to add guild');
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();