"""
Automated Player Profile Processor
Processes GitHub Issues to create or update player profiles
Integrates with MaiMai API to fetch player data automatically
"""

import os
import re
import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

# Add current directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from maimai_api import MaiMaiAPI

def parse_issue_body(body):
    """Extract structured data from issue body"""
    data = {}
    
    # Extract key-value pairs
    patterns = {
        'editKey': r'\*\*Edit Key:\*\*\s*`([^`]+)`',
        'fingerprint': r'\*\*Device Fingerprint:\*\*\s*`([^`]+)`',
        'ign': r'\*\*IGN:\*\*\s*(.+)$',
        'fullName': r'\*\*Full Name:\*\*\s*(.+)$',
        'nickname': r'\*\*Nickname:\*\*\s*(.+)$',
        'age': r'\*\*Age:\*\*\s*(.+)$',
        'friendCode': r'\*\*Friend Code:\*\*\s*(.+)$',
        'motto': r'\*\*Motto:\*\*\s*(.+)$',
        'bio': r'\*\*Bio:\*\*\s*(.+)$',
    }
    
    for key, pattern in patterns.items():
        match = re.search(pattern, body, re.MULTILINE)
        if match:
            data[key] = match.group(1).strip()
    
    return data

def sanitize_filename(name):
    """Create safe filename from IGN"""
    # Remove special characters, keep alphanumeric and spaces
    safe = re.sub(r'[^\w\s-]', '', name)
    # Replace spaces with hyphens
    safe = re.sub(r'[\s]+', '-', safe)
    # Remove leading/trailing hyphens
    safe = safe.strip('-')
    # Convert to lowercase
    return safe.lower()

def create_player_html(data, is_update=False):
    """Generate player profile HTML file with API integration"""
    
    # Initialize API
    api = MaiMaiAPI()
    
    # Get friend code
    friend_code = data.get('friendCode', '').replace('-', '').strip()
    
    if not friend_code or not api.validate_friend_code(friend_code):
        print(f"❌ Invalid friend code: {friend_code}")
        return None
    
    print(f"🔍 Fetching player data from MaiMai API for friend code: {friend_code}")
    
    # Fetch data from API
    api_data = api.get_player(friend_code)
    
    if not api_data.get('success'):
        print(f"❌ Failed to fetch player data: {api_data.get('error')}")
        print("   Profile creation aborted - please check friend code")
        return None
    
    # Override IGN and rating with API data
    print(f"✅ API data retrieved successfully!")
    print(f"   IGN: {api_data.get('ign')}")
    print(f"   Rating: {api_data.get('rating')}")
    print(f"   Trophy: {api_data.get('trophy', 'None')}")
    
    # Use API data for IGN (overrides user input if any)
    data['ign'] = api_data.get('ign', data.get('ign', 'Unknown'))
    data['api_rating'] = api_data.get('rating', '0')
    data['trophy'] = api_data.get('trophy')
    data['icon_url'] = api_data.get('icon_url')
    
    # Sanitize IGN for filename
    filename = sanitize_filename(data.get('ign', 'player'))
    filepath = Path('players') / f'{filename}.html'
    
    # Check if profile exists (for updates)
    if is_update and not filepath.exists():
        print(f"⚠️  Profile not found for update: {filepath}")
        return None
    
    # If creating new profile, check for duplicates
    if not is_update and filepath.exists():
        print(f"⚠️  Profile already exists: {filepath}")
        print("    Skipping creation. Use update instead.")
        return None
    
    # Load template
    template_path = Path('players/playerprofiletemplate.html')
    if not template_path.exists():
        print(f"❌ Template not found: {template_path}")
        return None
    
    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()
    
    # If updating, preserve admin fields
    admin_data = {}
    if is_update:
        # Read existing profile to preserve admin fields
        with open(filepath, 'r', encoding='utf-8') as f:
            existing = f.read()
        
        # Extract admin fields from existing profile
        admin_patterns = {
            'rating': r"rating:\s*['\"]?(\d+)['\"]?",
            'rank': r"rank:\s*['\"]([^'\"]+)['\"]",
            'title': r"title:\s*['\"]([^'\"]+)['\"]",
            'guildId': r"guildId:\s*['\"]([^'\"]+)['\"]",
            'guildName': r"guildName:\s*['\"]([^'\"]+)['\"]",
            'guildSlug': r"guildSlug:\s*['\"]([^'\"]+)['\"]",
            'guildMotto': r"guildMotto:\s*['\"]([^'\"]+)['\"]",
        }
        
        for key, pattern in admin_patterns.items():
            match = re.search(pattern, existing)
            if match:
                admin_data[key] = match.group(1)
    
    # Default admin values for new profiles (and missing fields)
    default_admin = {
        'rating': data.get('api_rating', '0'),  # Use API rating as default
        'rank': 'Unranked',
        'title': data.get('trophy', 'Community Member'),  # Use trophy as title if available
        'guildId': 'None',
        'guildName': 'None',
        'guildSlug': 'None',
        'guildMotto': 'None',
    }
    
    # Merge defaults with extracted admin data
    admin_data = {**default_admin, **admin_data}
    
    # Replace template placeholders
    replacements = {
        "name: 'Player Name'": f"name: '{data.get('fullName', 'REDACTED')}'",
        "ign: 'PlayerIGN'": f"ign: '{data.get('ign', 'PlayerIGN')}'",
        "nickname: 'Nickname'": f"nickname: '{data.get('nickname', data.get('ign', 'Nickname'))}'",
        "title: 'Special Community Title'": f"title: '{admin_data['title']}'",
        "maimaiFriendCode: '0000-0000-0000'": f"maimaiFriendCode: '{data.get('friendCode', '000000000000000')}'",
        "rating: 0": f"rating: {admin_data['rating']}",
        "rank: 'Unranked'": f"rank: '{admin_data['rank']}'",
        "age: '25'": f"age: '{data.get('age', '25')}'",
        "avatarImage: ''": f"avatarImage: '{data.get('icon_url', '')}'",  # Add icon from API
        "motto: 'Your motto here'": f"motto: '{data.get('motto', 'Unknown')}'",
        "joined: 'Jan 2026'": f"joined: '{datetime.now().strftime('%b %Y')}'",
        "bio: 'Write your bio here. Describe your playstyle, experience, and what makes you unique in the BAMACO community.'": f"bio: '{data.get('bio', 'No bio provided')}'",
        "guildName: 'None'": f"guildName: '{admin_data['guildName']}'",
        "guildSlug: 'None'": f"guildSlug: '{admin_data['guildSlug']}'",
        "guildId: 'guild_slug'": f"guildId: '{admin_data['guildId']}'",
        "guildMotto: 'None'": f"guildMotto: '{admin_data['guildMotto']}'",
    }
    
    html_content = template
    for old, new in replacements.items():
        html_content = html_content.replace(old, new)
    
    # Add edit key to localStorage (inject before </body>)
    edit_key = data.get('editKey', '')
    if edit_key:
        localStorage_script = f"""
    <!-- Edit Key Storage -->
    <script>
      // Store edit key for future edits
      localStorage.setItem('profileEditKey', '{edit_key}');
      console.log('Edit key stored for profile editing');
    </script>
  </body>"""
        html_content = html_content.replace('</body>', localStorage_script)
    
    # Write the file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ Profile {'updated' if is_update else 'created'}: {filepath}")
    return filepath

def regenerate_data_json():
    """Run generate_data.py to update data.json"""
    try:
        result = subprocess.run(['python', 'generate_data.py'], 
                              capture_output=True, text=True, check=True)
        print("✅ data.json regenerated")
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error regenerating data.json: {e}")
        print(e.stderr)
        return False

def main():
    """Main processing function"""
    issue_body = os.environ.get('ISSUE_BODY', '')
    issue_title = os.environ.get('ISSUE_TITLE', '')
    issue_number = os.environ.get('ISSUE_NUMBER', '')
    
    if not issue_body:
        print("❌ No issue body found")
        return
    
    print(f"📋 Processing issue #{issue_number}: {issue_title}")
    
    # Determine if this is create or update
    is_update = '[PROFILE-UPDATE]' in issue_title
    
    # Parse issue data
    data = parse_issue_body(issue_body)
    
    if not data.get('ign'):
        print("❌ No IGN found in issue")
        return
    
    print(f"👤 Player: {data.get('ign')}")
    print(f"🔑 Edit Key: {data.get('editKey')}")
    print(f"🖥️  Fingerprint: {data.get('fingerprint')}")
    
    # Create or update profile
    result = create_player_html(data, is_update)
    
    if result:
        # Regenerate data.json
        regenerate_data_json()
        print("✅ Processing complete!")
    else:
        print("❌ Processing failed")

if __name__ == '__main__':
    main()
