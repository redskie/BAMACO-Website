// Test MaiMai API integration
// Run this in the browser console on any page that loads Firebase modules

(async function testMaiMaiIntegration() {
  console.log('🧪 Testing MaiMai API Integration...');

  try {
    // Test 1: Direct API call
    console.log('\n1️⃣ Testing direct MaiMai API call...');
    const testCode = '101680566000997'; // Test friend code from API docs
    const apiResponse = await fetch(`https://maimai-data-get.onrender.com/api/player/${testCode}`);
    const apiData = await apiResponse.json();

    console.log('API Response:', apiData);

    if (apiData.success) {
      console.log('✅ API call successful');
      console.log(`   IGN: ${apiData.ign}`);
      console.log(`   Rating: ${apiData.rating}`);
      console.log(`   Trophy: ${apiData.trophy || 'None'}`);
      console.log(`   Icon: ${apiData.icon_url || 'None'}`);

      // Test 2: Create test player with API data
      console.log('\n2️⃣ Testing player creation with API data...');

      try {
        const { playersDB } = await import('./assets/players-db.js');

        const testPlayerData = {
          friendCode: '999' + testCode.slice(3), // Modified to avoid conflicts
          ign: apiData.ign,
          name: 'Test Player',
          nickname: apiData.ign,
          title: apiData.title || apiData.trophy || '',
          avatarImage: apiData.icon_url || apiData.iconUrl || '',
          rating: apiData.rating || '0',
          trophy: apiData.trophy || '',
          age: '25',
          motto: 'Testing API integration',
          joined: '2026',
          bio: 'This is a test profile created to verify MaiMai API integration.',
          passwordHash: 'test:hash',
          isPublic: true
        };

        console.log('Creating test player with normalized data:', testPlayerData);

        // Note: This will only work if Firebase rules allow writes
        const createdPlayer = await playersDB.createPlayer(testPlayerData);
        console.log('✅ Test player created:', createdPlayer);

        // Test 3: Update from API
        console.log('\n3️⃣ Testing API update...');
        const updatedPlayer = await playersDB.updateFromAPI(testPlayerData.friendCode, apiData);
        console.log('✅ Player updated from API:', updatedPlayer);

        console.log('\n🎉 All tests passed! MaiMai API integration is working correctly.');

      } catch (dbError) {
        console.error('❌ Database operation failed:', dbError);
        console.log('This might be due to Firebase rules or missing authentication.');
      }

    } else {
      console.error('❌ API call failed:', apiData.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
})();
