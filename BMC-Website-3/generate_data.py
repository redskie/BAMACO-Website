"""
BAMACO Data Generator
Automatically generates data.json from actual HTML files in the directory
- Scans players/ folder for player profiles
- Scans articles/ folder for articles
- Scans guilds/ folder for guild profiles
- Automatically picks top 3 highest rated players as featured
- Automatically picks 3 most recent articles as latest
"""

import json
import re
import os
from pathlib import Path
from datetime import datetime

def extract_player_data(html_file):
    """Extract player data from HTML file containing PLAYER_INFO JavaScript object"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the PLAYER_INFO object
        match = re.search(r'const PLAYER_INFO = \{(.*?)\};', content, re.DOTALL)
        if not match:
            return None
        
        info_text = match.group(1)
        
        # Extract values using regex
        def get_value(key):
            pattern = rf"{key}:\s*['\"]([^'\"]*)['\"]"
            match = re.search(pattern, info_text)
            return match.group(1) if match else ""
        
        def get_number(key):
            pattern = rf"{key}:\s*['\"]?(\d+)['\"]?"
            match = re.search(pattern, info_text)
            return int(match.group(1)) if match else 0
        
        # Extract achievements array
        achievements = []
        achievements_match = re.search(r'achievements:\s*\[(.*?)\]', info_text, re.DOTALL)
        if achievements_match:
            ach_text = achievements_match.group(1)
            # Find all achievement objects
            ach_objects = re.finditer(r'\{([^}]*)\}', ach_text)
            for ach_obj in ach_objects:
                obj_text = ach_obj.group(1)
                name_match = re.search(r"name:\s*['\"]([^'\"]*)['\"]", obj_text)
                desc_match = re.search(r"description:\s*['\"]([^'\"]*)['\"]", obj_text)
                icon_match = re.search(r"icon:\s*['\"]([^'\"]*)['\"]", obj_text)
                
                if name_match and desc_match and icon_match:
                    achievements.append({
                        "icon": icon_match.group(1),
                        "name": name_match.group(1),
                        "description": desc_match.group(1)
                    })
        
        # Generate ID from filename
        file_id = Path(html_file).stem.replace('-', '_')
        
        player_data = {
            "id": file_id,
            "name": get_value("name"),
            "ign": get_value("ign"),
            "maimaiFriendCode": get_value("maimaiFriendCode"),
            "nickname": get_value("nickname"),
            "motto": get_value("motto"),
            "age": get_number("age"),
            "rating": get_number("rating"),
            "role": get_value("title"),  # Using title as role
            "rank": get_value("rank"),
            "joined": get_value("joined"),
            "bio": get_value("bio"),
            "guildId": get_value("guildId"),  # Using guildId field
            "achievements": achievements
        }
        
        return player_data
    except Exception as e:
        print(f"Error processing {html_file}: {e}")
        return None

def extract_guild_data(html_file):
    """Extract guild data from HTML file containing GUILD_INFO JavaScript object"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Try to find the GUILD_INFO object first
        info_match = re.search(r'const GUILD_INFO = \{(.*?)\};', content, re.DOTALL)
        
        if info_match:
            # Extract from GUILD_INFO object
            info_text = info_match.group(1)
            
            def get_value(key):
                pattern = rf"{key}:\s*['\"]([^'\"]*)['\"]"
                match = re.search(pattern, info_text)
                return match.group(1) if match else ""
            
            def get_number(key):
                pattern = rf"{key}:\s*['\"]?(\d+)['\"]?"
                match = re.search(pattern, info_text)
                return int(match.group(1)) if match else 0
            
            # Extract achievements array
            achievements = []
            achievements_match = re.search(r'achievements:\s*\[(.*?)\]', info_text, re.DOTALL)
            if achievements_match:
                ach_text = achievements_match.group(1)
                # Find all achievement objects
                ach_objects = re.finditer(r'\{([^}]*)\}', ach_text)
                for ach_obj in ach_objects:
                    obj_text = ach_obj.group(1)
                    name_match = re.search(r"name:\s*['\"]([^'\"]*)['\"]", obj_text)
                    desc_match = re.search(r"description:\s*['\"]([^'\"]*)['\"]", obj_text)
                    icon_match = re.search(r"icon:\s*['\"]([^'\"]*)['\"]", obj_text)
                    
                    if name_match and desc_match and icon_match:
                        achievements.append({
                            "icon": icon_match.group(1),
                            "name": name_match.group(1),
                            "description": desc_match.group(1)
                        })
            
            guild_id = get_value("id")
            name = get_value("name")
            
            return {
                "id": guild_id,
                "name": name,
                "motto": get_value("motto"),
                "memberCount": get_number("memberCount"),
                "level": get_number("level"),
                "established": get_value("established"),
                "description": get_value("description"),
                "achievements": achievements
            }
        
        else:
            # Fallback to old extraction method for legacy files
            file_id = Path(html_file).stem.replace('-', '_')
            
            # Get guild name from title
            title_match = re.search(r'<title>([^-]+)', content)
            name = title_match.group(1).strip() if title_match else Path(html_file).stem.replace('-', ' ').title()
            
            # Get motto from profile-role
            motto_match = re.search(r'<p class="profile-role">([^<]+)</p>', content)
            motto = motto_match.group(1).strip() if motto_match else ""
            
            # Get member count
            member_match = re.search(r'<span class="stat-label">Members</span>\s*<span class="stat-value">(\d+)</span>', content)
            member_count = int(member_match.group(1)) if member_match else 0
            
            # Get level
            level_match = re.search(r'<span class="stat-label">Level</span>\s*<span class="stat-value">(\d+)</span>', content)
            level = int(level_match.group(1)) if level_match else 0
            
            # Get established date
            established_match = re.search(r'<span class="stat-label">Established</span>\s*<span class="stat-value">([^<]+)</span>', content)
            established = established_match.group(1).strip() if established_match else ""
            
            # Get description
            desc_match = re.search(r'<h3 class="section-title">About the Guild</h3>\s*<div class="card">\s*<p>([^<]+)</p>', content, re.DOTALL)
            description = desc_match.group(1).strip() if desc_match else ""
            
            # Extract achievements
            achievements = []
            ach_section = re.search(r'<h3 class="section-title">Achievements</h3>(.*?)</section>', content, re.DOTALL)
            if ach_section:
                ach_badges = re.finditer(r'<div class="achievement-icon">([^<]+)</div>\s*<div class="achievement-name">([^<]+)</div>\s*<div class="achievement-description">([^<]+)</div>', ach_section.group(1))
                for badge in ach_badges:
                    achievements.append({
                        "icon": badge.group(1).strip(),
                        "name": badge.group(2).strip(),
                        "description": badge.group(3).strip()
                    })
            
            return {
                "id": file_id,
                "name": name,
                "motto": motto,
                "memberCount": member_count,
                "level": level,
                "established": established,
                "description": description,
                "achievements": achievements
            }
            
    except Exception as e:
        print(f"Error processing {html_file}: {e}")
        return None

def extract_article_data(html_file):
    """Extract article data from HTML file containing ARTICLE_INFO JavaScript object"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        file_id = Path(html_file).stem.replace('-', '_')
        
        # Try to find ARTICLE_INFO object first
        info_match = re.search(r'const ARTICLE_INFO = \{(.*?)\};', content, re.DOTALL)
        
        if info_match:
            # Extract from ARTICLE_INFO object
            info_text = info_match.group(1)
            
            def get_value(key):
                pattern = rf"{key}:\s*['\"]([^'\"]*)['\"]"
                match = re.search(pattern, info_text)
                return match.group(1) if match else ""
            
            # Get content (may span multiple lines with backticks)
            content_match = re.search(r"content:\s*`(.*?)`", info_text, re.DOTALL)
            article_content = content_match.group(1).strip() if content_match else ""
            
            # Extract first paragraph for excerpt
            excerpt_match = re.search(r'<p>(.*?)</p>', article_content, re.DOTALL)
            excerpt = excerpt_match.group(1).strip() if excerpt_match else ""
            excerpt = re.sub('<[^>]+>', '', excerpt)  # Remove HTML tags from excerpt
            
            title = get_value("title")
            author = get_value("author")
            date_str = get_value("date")
            category = get_value("category")
            
        else:
            # Fallback to old extraction method for legacy files
            # Get title
            title_match = re.search(r'<h1 class="article-title">([^<]+)</h1>', content)
            title = title_match.group(1).strip() if title_match else ""
            
            # Get category
            category_match = re.search(r'<div class="article-category">([^<]+)</div>', content)
            category = category_match.group(1).strip() if category_match else ""
            
            # Get author
            author_match = re.search(r'<span class="article-author">By ([^<]+)</span>', content)
            author = author_match.group(1).strip() if author_match else ""
            
            # Get date
            date_match = re.search(r'<span class="article-date">([^<]+)</span>', content)
            date_str = date_match.group(1).strip() if date_match else ""
            
            # Get excerpt/first paragraph
            excerpt_match = re.search(r'<div class="article-content">.*?<p>([^<]+)</p>', content, re.DOTALL)
            excerpt = excerpt_match.group(1).strip() if excerpt_match else ""
            
            # Get full content
            content_match = re.search(r'<div class="article-content">(.*?)</div>', content, re.DOTALL)
            article_content = content_match.group(1).strip() if content_match else ""
        
        # Parse date for sorting
        try:
            date_obj = datetime.strptime(date_str, "%b %d, %Y")
        except:
            try:
                date_obj = datetime.strptime(date_str, "%B %d, %Y")
            except:
                date_obj = datetime.now()
        
        return {
            "id": file_id,
            "title": title,
            "excerpt": excerpt if len(excerpt) < 200 else excerpt[:197] + "...",
            "category": category,
            "authorId": author.lower().replace(' ', '_'),
            "date": date_str,
            "date_obj": date_obj,  # For sorting
            "content": article_content
        }
    except Exception as e:
        print(f"Error processing {html_file}: {e}")
        return None

def generate_data_json():
    """Main function to generate data.json from actual files"""
    base_dir = Path(__file__).parent
    
    print("🔍 Scanning for player profiles...")
    players_dir = base_dir / "players"
    players = []
    
    if players_dir.exists():
        for html_file in players_dir.glob("*.html"):
            if html_file.name != "playerprofiletemplate.html":
                print(f"  📄 Processing {html_file.name}")
                player_data = extract_player_data(html_file)
                if player_data and player_data['ign']:  # Only add if has valid data
                    players.append(player_data)
    
    print(f"✅ Found {len(players)} players")
    
    # Sort players by rating (highest first) for featured selection
    players_sorted = sorted(players, key=lambda x: x.get('rating', 0), reverse=True)
    
    print("\n🔍 Scanning for guild profiles...")
    guilds_dir = base_dir / "guilds"
    guilds = []
    
    if guilds_dir.exists():
        for html_file in guilds_dir.glob("*.html"):
            if html_file.name != "guildtemplate.html":
                print(f"  📄 Processing {html_file.name}")
                guild_data = extract_guild_data(html_file)
                if guild_data and guild_data['name']:
                    guilds.append(guild_data)
    
    print(f"✅ Found {len(guilds)} guilds")
    
    # Populate guild members from players
    print("\n🔗 Linking players to guilds...")
    for guild in guilds:
        guild_members = []
        for player in players_sorted:
            if player.get('guildId') == guild['id']:
                guild_members.append({
                    "id": player['id'],
                    "name": player['name'],
                    "ign": player['ign'],
                    "role": player['role'],
                    "rating": player['rating'],
                    "rank": player['rank']
                })
        guild['members'] = guild_members
        print(f"  👥 {guild['name']}: {len(guild_members)} members")
    
    print("\n🔍 Scanning for articles...")
    articles_dir = base_dir / "articles"
    articles = []
    
    if articles_dir.exists():
        for html_file in articles_dir.glob("*.html"):
            if html_file.name != "articletemplate.html":
                print(f"  📄 Processing {html_file.name}")
                article_data = extract_article_data(html_file)
                if article_data and article_data['title']:
                    articles.append(article_data)
    
    # Sort articles by date (newest first)
    articles_sorted = sorted(articles, key=lambda x: x.get('date_obj', datetime.now()), reverse=True)
    
    # Remove date_obj from articles (used only for sorting)
    for article in articles_sorted:
        article.pop('date_obj', None)
    
    print(f"✅ Found {len(articles)} articles")
    
    # Auto-link articles to player profiles
    print("\n📝 Linking articles to authors...")
    for player in players_sorted:
        player_articles = []
        for article in articles_sorted:
            # Match by IGN or name
            author_id = article.get('authorId', '')
            player_ign_id = player['ign'].lower().replace(' ', '_')
            player_name_id = player['name'].lower().replace(' ', '_')
            
            if author_id == player_ign_id or author_id == player_name_id:
                player_articles.append({
                    "id": article['id'],
                    "title": article['title'],
                    "excerpt": article['excerpt'],
                    "category": article['category'],
                    "date": article['date']
                })
        
        if player_articles:
            player['articles'] = player_articles
            print(f"  ✍️  {player['ign']}: {len(player_articles)} article(s)")
    
    # Build final data structure
    data = {
        "players": players_sorted,
        "guilds": guilds,
        "articles": articles_sorted
    }
    
    # Write to data.json
    output_file = base_dir / "data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✨ Successfully generated {output_file}")
    print(f"📊 Stats:")
    print(f"   - {len(players)} players")
    print(f"   - Top 3 rated players (for featured): {', '.join([p['ign'] for p in players_sorted[:3]])}")
    print(f"   - {len(guilds)} guilds")
    print(f"   - {len(articles)} articles")
    print(f"   - Latest 3 articles: {', '.join([a['title'][:30] + '...' if len(a['title']) > 30 else a['title'] for a in articles_sorted[:3]])}")

if __name__ == "__main__":
    generate_data_json()
