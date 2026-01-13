#!/usr/bin/env python3
"""
BAMACO Daily Update Script - Firebase Version

Fetches all players from Firebase, updates their MaiMai stats via API,
and pushes changes back to Firebase using the Realtime Database.

Runs daily via GitHub Actions at 10:00 AM PHT.
"""

import json
import requests
from datetime import datetime
from typing import Optional

# Configuration - Using both Firestore and RTDB
FIRESTORE_URL = "https://firestore.googleapis.com/v1/projects/bamaco-queue/databases/(default)/documents"
FIREBASE_URL = "https://bamaco-queue-default-rtdb.asia-southeast1.firebasedatabase.app"
MAIMAI_API_URL = "https://maimai-data-get.onrender.com/api/player"

def log(message: str, level: str = "INFO"):
    """Print formatted log message."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")

def fetch_all_players() -> dict:
    """Fetch all players from Firestore."""
    try:
        response = requests.get(f"{FIRESTORE_URL}/players", timeout=30)
        response.raise_for_status()
        data = response.json()

        # Parse Firestore document format
        players = {}
        if 'documents' in data:
            for doc in data['documents']:
                # Extract friend code from document path
                doc_path = doc['name']
                friend_code = doc_path.split('/')[-1]

                # Extract fields from Firestore format
                fields = doc.get('fields', {})
                player_data = {}

                for key, value in fields.items():
                    if 'stringValue' in value:
                        player_data[key] = value['stringValue']
                    elif 'integerValue' in value:
                        player_data[key] = value['integerValue']
                    elif 'booleanValue' in value:
                        player_data[key] = value['booleanValue']
                    elif 'timestampValue' in value:
                        player_data[key] = value['timestampValue']

                players[friend_code] = player_data

        return players

    except requests.RequestException as e:
        log(f"Failed to fetch players from Firestore: {e}", "ERROR")
        return {}

def fetch_maimai_data(friend_code: str) -> Optional[dict]:
    """Fetch player data from MaiMai API."""
    try:
        response = requests.get(f"{MAIMAI_API_URL}/{friend_code}", timeout=30)
        data = response.json()

        if data.get("success"):
            # Normalize fields from MaiMai API
            return {
                "ign": data.get("ign"),
                "rating": data.get("rating"),
                # Use trophy as title fallback when title is missing
                "title": data.get("title") or data.get("trophy"),
                "trophy": data.get("trophy"),
                # Prefer avatar_url first, then icon_url; keep icon/iconUrl as fallbacks
                "avatarImage": data.get("avatar_url") or data.get("icon_url") or data.get("iconUrl") or data.get("icon")
            }
        else:
            log(f"API returned unsuccessful for {friend_code}", "WARN")
            return None

    except requests.RequestException as e:
        log(f"API request failed for {friend_code}: {e}", "ERROR")
        return None

def update_player_in_firestore(friend_code: str, updates: dict) -> bool:
    """Update a player's data in Firestore."""
    try:
        # Add timestamp
        updates["lastApiUpdate"] = datetime.now().isoformat()
        
        # Build individual field updates (avoid complex merge operations)
        for field_name, field_value in updates.items():
            field_update = {"fields": {field_name: {"stringValue": str(field_value)}}}
            
            response = requests.patch(
                f"{FIRESTORE_URL}/players/{friend_code}",
                json=field_update,
                params={"updateMask.fieldPaths": field_name},
                timeout=30
            )
            
            if response.status_code != 200:
                log(f"Failed to update field {field_name}: {response.status_code} - {response.text}", "WARN")
                # Continue with other fields instead of failing completely
        
        log(f"Updated {len(updates)} fields in Firestore for {friend_code}", "INFO")
        return True
        
    except requests.RequestException as e:
        log(f"Failed to update {friend_code} in Firestore: {e}", "ERROR")
        return False

def main():
    """Main update routine."""
    log("=" * 60)
    log("BAMACO Daily Update - Firebase Version")
    log("=" * 60)

    # Fetch all players
    log("Fetching players from Firestore...")
    players = fetch_all_players()

    if not players:
        log("No players found in Firestore. Exiting.", "WARN")
        return

    log(f"Found {len(players)} players to update")

    # Track stats
    stats = {
        "updated": 0,
        "unchanged": 0,
        "failed": 0,
        "api_error": 0
    }

    # Process each player
    for friend_code, player_data in players.items():
        ign = player_data.get("ign", "Unknown")
        log(f"Processing: {ign} ({friend_code})")

        # Fetch latest data from MaiMai API
        api_data = fetch_maimai_data(friend_code)

        if not api_data:
            stats["api_error"] += 1
            continue

        # Check what changed
        changes = {}
        fields_to_check = ["ign", "rating", "title", "trophy", "avatarImage"]

        for field in fields_to_check:
            api_value = api_data.get(field)
            current_value = player_data.get(field)

            # Only update if API returned a value and it's different
            if api_value and api_value != current_value:
                changes[field] = api_value

        if changes:
            log(f"  Changes detected: {list(changes.keys())}")

            if update_player_in_firestore(friend_code, changes):
                stats["updated"] += 1
                log(f"  ✅ Updated successfully")
            else:
                stats["failed"] += 1
                log(f"  ❌ Update failed")
        else:
            stats["unchanged"] += 1
            log(f"  No changes needed")

    # Summary
    log("")
    log("=" * 60)
    log("UPDATE SUMMARY")
    log("=" * 60)
    log(f"✅ Updated:   {stats['updated']} players")
    log(f"⏸️  Unchanged: {stats['unchanged']} players")
    log(f"⚠️  API Error: {stats['api_error']} players")
    log(f"❌ Failed:    {stats['failed']} players")
    log("=" * 60)

    # Exit with error if any failures
    if stats["failed"] > 0:
        log("Some updates failed. Check logs above.", "WARN")

if __name__ == "__main__":
    main()
