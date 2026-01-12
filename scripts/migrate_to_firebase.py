#!/usr/bin/env python3
"""
BAMACO Migration Script: Static HTML → Firebase Database

This script extracts PLAYER_INFO from existing player HTML files and pushes them
to Firebase Realtime Database. Run this once during migration.

Usage:
    python scripts/migrate_to_firebase.py

Environment Variables:
    FIREBASE_URL - Firebase Realtime Database URL (optional, has default)
"""

import os
import re
import json
from pathlib import Path

# Firebase Realtime Database URL
FIREBASE_URL = "https://bamaco-queue-default-rtdb.asia-southeast1.firebasedatabase.app"


def extract_player_info(html_content: str, filename: str) -> dict | None:
    """Extract PLAYER_INFO JavaScript object from HTML file."""
    
    # Find the PLAYER_INFO object in script tags
    pattern = r'const\s+PLAYER_INFO\s*=\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}'
    match = re.search(pattern, html_content, re.DOTALL)
    
    if not match:
        print(f"  ⚠️ No PLAYER_INFO found in {filename}")
        return None
    
    js_object = match.group(1)
    
    # Parse key-value pairs from the JavaScript object
    player = {}
    
    # Extract simple string properties
    simple_props = [
        'name', 'ign', 'nickname', 'title', 'avatarImage', 
        'maimaiFriendCode', 'rating', 'rank', 'age', 
        'motto', 'joined', 'bio', 'guildId', 'trophy'
    ]
    
    for prop in simple_props:
        # Match both 'value' and "value" strings
        pattern = rf"{prop}:\s*['\"]([^'\"]*)['\"]"
        match = re.search(pattern, js_object)
        if match:
            player[prop] = match.group(1)
        else:
            player[prop] = ''
    
    # Extract achievements array
    achievements = []
    achievements_match = re.search(r'achievements:\s*\[(.*?)\]', js_object, re.DOTALL)
    if achievements_match:
        achievements_content = achievements_match.group(1).strip()
        if achievements_content:
            # Find individual achievement objects
            achievement_pattern = r'\{([^}]+)\}'
            for ach_match in re.finditer(achievement_pattern, achievements_content):
                ach_obj = ach_match.group(1)
                achievement = {}
                for field in ['title', 'date', 'description', 'icon']:
                    field_match = re.search(rf"{field}:\s*['\"]([^'\"]*)['\"]", ach_obj)
                    if field_match:
                        achievement[field] = field_match.group(1)
                if achievement:
                    achievements.append(achievement)
    player['achievements'] = achievements
    
    # Extract articles array
    articles = []
    articles_match = re.search(r'articles:\s*\[(.*?)\](?=,?\s*(?:\}|$))', js_object, re.DOTALL)
    if articles_match:
        articles_content = articles_match.group(1).strip()
        if articles_content:
            article_pattern = r'\{([^}]+)\}'
            for art_match in re.finditer(article_pattern, articles_content):
                art_obj = art_match.group(1)
                article = {}
                for field in ['title', 'excerpt', 'slug', 'category']:
                    field_match = re.search(rf"{field}:\s*['\"]([^'\"]*)['\"]", art_obj)
                    if field_match:
                        article[field] = field_match.group(1)
                if article:
                    articles.append(article)
    player['articles'] = articles
    
    return player


def convert_to_firebase_schema(player_info: dict, html_filename: str) -> dict:
    """Convert extracted PLAYER_INFO to Firebase database schema."""
    
    friend_code = player_info.get('maimaiFriendCode', '').replace('-', '')
    
    return {
        'friendCode': friend_code,
        'ign': player_info.get('ign', 'Unknown'),
        'name': player_info.get('name', 'REDACTED'),
        'nickname': player_info.get('nickname', player_info.get('ign', 'Unknown')),
        'title': player_info.get('title', ''),
        'avatarImage': player_info.get('avatarImage', ''),
        'rating': player_info.get('rating', '0'),
        'rank': player_info.get('rank', 'Unranked'),
        'trophy': player_info.get('trophy', ''),
        'age': player_info.get('age', ''),
        'motto': player_info.get('motto', ''),
        'joined': player_info.get('joined', ''),
        'bio': player_info.get('bio', ''),
        'guildId': player_info.get('guildId', ''),
        'achievements': player_info.get('achievements', []),
        'articles': player_info.get('articles', []),
        # Security fields - generated during migration
        'passwordHash': '',  # Empty - users must reset password after migration
        'fingerprint': '',
        'isPublic': True,
        'editKey': '',
        # Metadata
        'migratedFrom': html_filename,
        'migratedAt': '',  # Will be set by Firebase
        'createdAt': '',  # Will be set by Firebase
        'updatedAt': ''   # Will be set by Firebase
    }


def push_to_firebase(players: dict) -> bool:
    """Push players data to Firebase using REST API."""
    import urllib.request
    import urllib.error
    
    url = f"{FIREBASE_URL}/players.json"
    
    try:
        data = json.dumps(players).encode('utf-8')
        request = urllib.request.Request(
            url, 
            data=data, 
            method='PATCH',
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(request, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"  ✅ Firebase update successful")
            return True
            
    except urllib.error.HTTPError as e:
        print(f"  ❌ HTTP Error: {e.code} - {e.reason}")
        return False
    except urllib.error.URLError as e:
        print(f"  ❌ URL Error: {e.reason}")
        return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def main():
    """Main migration function."""
    print("=" * 60)
    print("🔄 BAMACO Migration: Static HTML → Firebase")
    print("=" * 60)
    
    # Get project root (one level up from scripts folder)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    players_dir = project_root / "players"
    
    if not players_dir.exists():
        print(f"❌ Players directory not found: {players_dir}")
        return
    
    # Find all player HTML files (exclude template)
    html_files = [f for f in players_dir.glob("*.html") 
                  if 'template' not in f.name.lower()]
    
    print(f"\n📁 Found {len(html_files)} player files to migrate:")
    for f in html_files:
        print(f"   - {f.name}")
    
    print("\n" + "-" * 40)
    
    players_to_migrate = {}
    migration_summary = {
        'success': [],
        'failed': [],
        'skipped': []
    }
    
    for html_file in html_files:
        print(f"\n📄 Processing: {html_file.name}")
        
        try:
            content = html_file.read_text(encoding='utf-8')
            
            # Extract PLAYER_INFO
            player_info = extract_player_info(content, html_file.name)
            
            if not player_info:
                migration_summary['skipped'].append(html_file.name)
                continue
            
            # Convert to Firebase schema
            firebase_data = convert_to_firebase_schema(player_info, html_file.name)
            
            friend_code = firebase_data['friendCode']
            
            if not friend_code:
                print(f"  ⚠️ No friend code found, skipping")
                migration_summary['skipped'].append(html_file.name)
                continue
            
            print(f"  ✅ Extracted: {firebase_data['ign']} (FC: {friend_code})")
            print(f"     Rating: {firebase_data['rating']}, Joined: {firebase_data['joined']}")
            
            # Use friend code as key
            players_to_migrate[friend_code] = firebase_data
            migration_summary['success'].append({
                'file': html_file.name,
                'ign': firebase_data['ign'],
                'friendCode': friend_code
            })
            
        except Exception as e:
            print(f"  ❌ Error processing {html_file.name}: {str(e)}")
            migration_summary['failed'].append({
                'file': html_file.name,
                'error': str(e)
            })
    
    print("\n" + "=" * 60)
    print("📊 MIGRATION SUMMARY")
    print("=" * 60)
    
    print(f"\n✅ Successfully parsed: {len(migration_summary['success'])} players")
    for p in migration_summary['success']:
        print(f"   - {p['ign']} ({p['friendCode']})")
    
    if migration_summary['skipped']:
        print(f"\n⏭️ Skipped: {len(migration_summary['skipped'])} files")
        for f in migration_summary['skipped']:
            print(f"   - {f}")
    
    if migration_summary['failed']:
        print(f"\n❌ Failed: {len(migration_summary['failed'])} files")
        for f in migration_summary['failed']:
            print(f"   - {f['file']}: {f['error']}")
    
    # Save extracted data locally for backup
    output_file = project_root / "config" / "migrated_players.json"
    output_file.parent.mkdir(exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(players_to_migrate, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Backup saved to: {output_file}")
    
    # Confirm before pushing to Firebase
    if not players_to_migrate:
        print("\n⚠️ No players to migrate!")
        return
    
    print(f"\n🔥 Ready to push {len(players_to_migrate)} players to Firebase")
    print(f"   Database URL: {FIREBASE_URL}")
    
    user_input = input("\nProceed with Firebase upload? (yes/no): ").strip().lower()
    
    if user_input in ['yes', 'y']:
        print("\n📤 Uploading to Firebase...")
        if push_to_firebase(players_to_migrate):
            print("\n🎉 Migration complete!")
            print("\n⚠️ IMPORTANT: Users will need to:")
            print("   1. Log in with their friend code")
            print("   2. Use 'Forgot Password' to set a new password")
            print("   (Password hashes were not migrated for security)")
        else:
            print("\n❌ Firebase upload failed. Check errors above.")
    else:
        print("\n⏸️ Migration cancelled. Data saved locally for later.")


if __name__ == "__main__":
    main()
