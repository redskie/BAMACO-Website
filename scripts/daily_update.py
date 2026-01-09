"""
Daily Player Data Update Script
Fetches fresh data from MaiMai API and updates all player profiles
"""

import sys
import os
import re
from pathlib import Path
from datetime import datetime

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

from maimai_api import MaiMaiAPI


def extract_friend_code_from_html(html_file):
    """Extract friend code from player HTML file"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find maimaiFriendCode in PLAYER_INFO
        match = re.search(r"maimaiFriendCode:\s*['\"]([^'\"]+)['\"]", content)
        if match:
            return match.group(1)
        return None
    except Exception as e:
        print(f"Error reading {html_file}: {e}")
        return None


def update_player_html(html_file, api_data):
    """Update player HTML file with fresh API data"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
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
                r"(rating:\s*['\"]?)(\d+)(['\"]?)",
                r"\g<1>" + api_data['rating'] + r"\g<3>",
                content
            )
        
        # Update trophy (if available)
        if api_data.get('trophy'):
            # Try to update trophy/title field
            content = re.sub(
                r"(title:\s*['\"])([^'\"]*)(['\"])",
                r"\1" + api_data['trophy'].replace('\\', '\\\\').replace("'", "\\'") + r"\3",
                content
            )
        
        # Update icon/avatar URL (if available)
        if api_data.get('icon_url'):
            content = re.sub(
                r"(avatarImage:\s*['\"])([^'\"]*)(['\"])",
                r"\1" + api_data['icon_url'] + r"\3",
                content
            )
        
        # Only write if changed
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"Error updating {html_file}: {e}")
        return False


def update_all_players():
    """Update all player profiles with fresh API data"""
    print("\n" + "="*70)
    print("🔄 Daily Player Data Update")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")
    
    # Initialize API
    api = MaiMaiAPI(timeout=60)
    
    # Check API health
    print("🏥 Checking API health...")
    health = api.check_health()
    print(f"   Status: {health.get('status', 'unknown')}\n")
    
    # Find all player HTML files
    players_dir = Path('players')
    player_files = list(players_dir.glob('*.html'))
    
    # Exclude template
    player_files = [f for f in player_files if f.stem != 'playerprofiletemplate']
    
    print(f"📂 Found {len(player_files)} player profiles\n")
    
    # Collect friend codes
    friend_codes = []
    file_map = {}
    
    for player_file in player_files:
        friend_code = extract_friend_code_from_html(player_file)
        if friend_code and api.validate_friend_code(friend_code):
            friend_codes.append(friend_code)
            file_map[friend_code] = player_file
        else:
            print(f"⚠️  Skipping {player_file.name}: Invalid or missing friend code")
    
    print(f"✅ {len(friend_codes)} valid friend codes to update\n")
    
    if not friend_codes:
        print("❌ No valid friend codes found. Exiting.")
        return
    
    # Process in batches of 10
    batch_size = 10
    updated_count = 0
    error_count = 0
    
    for i in range(0, len(friend_codes), batch_size):
        batch = friend_codes[i:i+batch_size]
        print(f"📦 Processing batch {i//batch_size + 1} ({len(batch)} players)...")
        
        # Fetch data for batch
        result = api.get_batch(batch)
        
        if result.get('success'):
            for player_data in result.get('results', []):
                if player_data.get('success'):
                    friend_code = player_data.get('friend_code')
                    player_file = file_map.get(friend_code)
                    
                    if player_file:
                        ign = player_data.get('ign', 'Unknown')
                        rating = player_data.get('rating', 'N/A')
                        
                        print(f"   📝 Updating {player_file.name}: {ign} ({rating})")
                        
                        if update_player_html(player_file, player_data):
                            updated_count += 1
                            print(f"      ✅ Updated successfully")
                        else:
                            print(f"      ℹ️  No changes needed")
                else:
                    error_count += 1
                    print(f"   ❌ Error: {player_data.get('error')}")
        else:
            print(f"   ❌ Batch error: {result.get('error')}")
            error_count += len(batch)
        
        print()
    
    # Summary
    print("="*70)
    print("📊 Update Summary")
    print("="*70)
    print(f"✅ Updated: {updated_count} profiles")
    print(f"❌ Errors: {error_count} profiles")
    print(f"📂 Total: {len(friend_codes)} profiles")
    print("="*70 + "\n")
    
    # Regenerate data.json
    if updated_count > 0:
        print("🔄 Regenerating data.json...")
        try:
            import subprocess
            result = subprocess.run(
                ['python', 'generate_data.py'],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode == 0:
                print("✅ data.json regenerated successfully\n")
            else:
                print(f"⚠️  Warning: data.json regeneration failed\n{result.stderr}\n")
        except Exception as e:
            print(f"⚠️  Warning: Could not regenerate data.json: {e}\n")
    
    print("✨ Daily update complete!\n")
    
    return {
        'updated': updated_count,
        'errors': error_count,
        'total': len(friend_codes)
    }


if __name__ == "__main__":
    try:
        update_all_players()
    except KeyboardInterrupt:
        print("\n\n⚠️  Update interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
