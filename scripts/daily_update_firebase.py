#!/usr/bin/env python3
"""
BAMACO Daily Update Script - Firebase Version

Fetches all players from Firebase, updates their MaiMai stats via API,
and pushes changes back to Firebase.

Runs daily via GitHub Actions at 10:00 AM PHT.
"""

import json
import requests
from datetime import datetime
from typing import Optional

# Configuration
FIREBASE_URL = "https://bamaco-queue-default-rtdb.asia-southeast1.firebasedatabase.app"
MAIMAI_API_URL = "https://maimai-data-get.onrender.com/api/player"

def log(message: str, level: str = "INFO"):
    """Print formatted log message."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")

def fetch_all_players() -> dict:
    """Fetch all players from Firebase."""
    try:
        response = requests.get(f"{FIREBASE_URL}/players.json", timeout=30)
        response.raise_for_status()
        data = response.json()
        return data if data else {}
    except requests.RequestException as e:
        log(f"Failed to fetch players from Firebase: {e}", "ERROR")
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

def update_player_in_firebase(friend_code: str, updates: dict) -> bool:
    """Update a player's data in Firebase."""
    try:
        # Add timestamp
        updates["lastApiUpdate"] = datetime.now().isoformat()

        response = requests.patch(
            f"{FIREBASE_URL}/players/{friend_code}.json",
            json=updates,
            timeout=30
        )
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        log(f"Failed to update {friend_code} in Firebase: {e}", "ERROR")
        return False

def main():
    """Main update routine."""
    log("=" * 60)
    log("BAMACO Daily Update - Firebase Version")
    log("=" * 60)

    # Fetch all players
    log("Fetching players from Firebase...")
    players = fetch_all_players()

    if not players:
        log("No players found in Firebase. Exiting.", "WARN")
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

            if update_player_in_firebase(friend_code, changes):
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
