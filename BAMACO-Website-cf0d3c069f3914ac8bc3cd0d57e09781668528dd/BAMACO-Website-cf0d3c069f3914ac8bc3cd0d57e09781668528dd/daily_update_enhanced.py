"""
Improved daily update with better error tracking
"""
import os
import re
import sys
from datetime import datetime

# Add scripts directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'scripts'))
from maimai_api import MaiMaiAPI

# Track errors for detailed reporting
error_log = []
skip_list = []

def should_skip_profile(friend_code):
    """
    Check if a profile should be permanently skipped
    Add known problematic friend codes here
    """
    # Known problematic friend codes that consistently fail
    SKIP_CODES = [
        # Add codes that should be skipped after verification
    ]
    return friend_code in SKIP_CODES

def update_all_players():
    print("\n" + "="*70)
    print("🔄 Daily Player Data Update (Enhanced)")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")
    
    api = MaiMaiAPI()
    
    # Check API health first
    print("🏥 Checking API health...")
    try:
        import requests
        health = requests.get("https://maimai-data-get.onrender.com/health", timeout=10)
        if health.status_code == 200:
            health_data = health.json()
            print(f"   Status: {health_data.get('status', 'unknown')}")
            if not health_data.get('session_valid', False):
                print("   ⚠️  Warning: API session invalid - some updates may fail")
    except:
        print("   ⚠️  Could not check API health")
    
    # Get all player files
    players_dir = 'players'
    player_files = [f for f in os.listdir(players_dir) 
                   if f.endswith('.html') and f != 'playerprofiletemplate.html']
    
    print(f"\n📂 Found {len(player_files)} player profiles\n")
    
    # Extract friend codes
    players_to_update = []
    for filename in player_files:
        filepath = os.path.join(players_dir, filename)
        friend_code = extract_friend_code_from_html(filepath)
        
        if not friend_code:
            print(f"⚠️  Skipping {filename}: No friend code found")
            skip_list.append({'file': filename, 'reason': 'No friend code'})
            continue
            
        if len(friend_code) != 15:
            print(f"⚠️  Skipping {filename}: Invalid friend code length ({len(friend_code)})")
            skip_list.append({'file': filename, 'reason': f'Invalid length: {len(friend_code)}'})
            continue
            
        if should_skip_profile(friend_code):
            print(f"⚠️  Skipping {filename}: In permanent skip list")
            skip_list.append({'file': filename, 'reason': 'Permanently skipped'})
            continue
        
        players_to_update.append({
            'file': filename,
            'path': filepath,
            'friend_code': friend_code
        })
    
    print(f"✅ {len(players_to_update)} valid friend codes to update\n")
    
    # Process in batches
    batch_size = 10
    updated_count = 0
    failed_count = 0
    
    for i in range(0, len(players_to_update), batch_size):
        batch = players_to_update[i:i+batch_size]
        batch_num = (i // batch_size) + 1
        
        print(f"📦 Processing batch {batch_num} ({len(batch)} players)...")
        
        # Batch fetch
        friend_codes = [p['friend_code'] for p in batch]
        print(f"📡 Batch fetching data for {len(friend_codes)} players")
        batch_results = api.get_batch(friend_codes)
        
        if batch_results['success']:
            print(f"✅ Batch fetch complete: {batch_results['successful']}/{len(friend_codes)} successful")
            
            # Update each player
            for player in batch:
                result = batch_results['results'].get(player['friend_code'])
                
                if result and result.get('success'):
                    ign = result.get('ign', 'Unknown')
                    rating = result.get('rating', '0')
                    print(f"   📝 Updating {player['file']}: {ign} ({rating})")
                    
                    if update_player_html(player['path'], result):
                        print(f"      ✅ Updated successfully")
                        updated_count += 1
                    else:
                        print(f"      ❌ Failed to update file")
                        failed_count += 1
                        error_log.append({
                            'file': player['file'],
                            'friend_code': player['friend_code'],
                            'error': 'File update failed'
                        })
                else:
                    error_msg = result.get('error', 'Unknown error') if result else 'No result returned'
                    print(f"   ❌ {player['file']}: {error_msg}")
                    failed_count += 1
                    error_log.append({
                        'file': player['file'],
                        'friend_code': player['friend_code'],
                        'error': error_msg
                    })
        else:
            print(f"❌ Batch fetch failed: {batch_results.get('error', 'Unknown error')}")
            for player in batch:
                failed_count += 1
                error_log.append({
                    'file': player['file'],
                    'friend_code': player['friend_code'],
                    'error': batch_results.get('error', 'Batch fetch failed')
                })
    
    # Print detailed summary
    print("\n" + "="*70)
    print("📊 Detailed Update Summary")
    print("="*70)
    print(f"✅ Updated: {updated_count} profiles")
    print(f"❌ Errors: {failed_count} profiles")
    print(f"⏭️  Skipped: {len(skip_list)} profiles")
    print(f"📂 Total: {len(player_files)} profiles")
    print("="*70)
    
    # Show skipped profiles
    if skip_list:
        print("\n⏭️  SKIPPED PROFILES:")
        for item in skip_list:
            print(f"   • {item['file']}: {item['reason']}")
    
    # Show detailed errors
    if error_log:
        print("\n❌ FAILED UPDATES (Detailed):")
        for item in error_log:
            print(f"   • {item['file']}")
            print(f"     Friend Code: {item['friend_code']}")
            print(f"     Error: {item['error']}")
            
            # Provide specific recommendations
            if 'not found' in item['error'].lower() or '500' in item['error']:
                print(f"     💡 Recommendation: Verify friend code with player")
                print(f"        Consider adding to skip list if persistent")
    
    print("\n" + "="*70 + "\n")
    
    # Regenerate data.json
    print("🔄 Regenerating data.json...")
    try:
        os.system('python generate_data.py')
        print("✅ data.json regenerated\n")
    except Exception as e:
        print(f"⚠️  Warning: data.json regeneration failed: {e}\n")
    
    print("✨ Daily update complete!\n")
    return updated_count, failed_count, len(skip_list)

def extract_friend_code_from_html(filepath):
    """Extract friend code from HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r"maimaiFriendCode:\s*['\"](\d+)['\"]", content)
            if match:
                return match.group(1)
    except Exception as e:
        print(f"   Error reading {filepath}: {e}")
    return None

def update_player_html(filepath, api_data):
    """Update player HTML with API data"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update IGN
        if api_data.get('ign'):
            content = re.sub(
                r"(ign:\s*['\"])[^'\"]*(['\"])",
                r"\1" + api_data['ign'].replace('\\', '\\\\').replace("'", "\\'") + r"\2",
                content
            )
        
        # Update rating
        if api_data.get('rating'):
            content = re.sub(
                r"(rating:\s*['\"]?)(\d+|Unrated)(['\"]?)",
                r"\g<1>" + api_data['rating'] + r"\g<3>",
                content
            )
        
        # Save if changed
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"      Error: {e}")
        return False

if __name__ == '__main__':
    update_all_players()
