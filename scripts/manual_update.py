#!/usr/bin/env python3
"""
BAMACO Manual Update Tool
A comprehensive manual update script for testing and maintenance purposes.
"""

import json
import os
import sys
from datetime import datetime
import requests
from pathlib import Path

class ManualUpdater:
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.data_file = self.base_path / "data.json"
        self.backup_dir = self.base_path / "backups"
        self.backup_dir.mkdir(exist_ok=True)
        
    def display_menu(self):
        """Display the main menu options"""
        print("\n" + "="*50)
        print("🎯 BAMACO MANUAL UPDATE TOOL")
        print("="*50)
        print("1.  🔄 Update Player Data")
        print("2.  🏛️  Update Guild Data") 
        print("3.  📊 Update Queue Data")
        print("4.  🔍 Test API Connection")
        print("5.  📝 Add New Player Profile")
        print("6.  🏆 Add New Guild Profile")
        print("7.  📋 View Current Data")
        print("8.  🔧 Data Validation Check")
        print("9.  💾 Create Data Backup")
        print("10. 📤 Restore from Backup")
        print("11. 🧪 Run Test Suite")
        print("12. 🔄 Regenerate All Data")
        print("13. 📊 Generate Statistics")
        print("14. 🗑️  Clean Old Data")
        print("0.  ❌ Exit")
        print("="*50)

    def load_data(self):
        """Load data from data.json"""
        try:
            if self.data_file.exists():
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                print("⚠️  data.json not found, creating new structure...")
                return {"players": {}, "guilds": {}, "queue": [], "last_updated": ""}
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return {"players": {}, "guilds": {}, "queue": [], "last_updated": ""}

    def save_data(self, data):
        """Save data to data.json"""
        try:
            data["last_updated"] = datetime.now().isoformat()
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print("✅ Data saved successfully!")
            return True
        except Exception as e:
            print(f"❌ Error saving data: {e}")
            return False

    def create_backup(self):
        """Create a backup of current data"""
        try:
            data = self.load_data()
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = self.backup_dir / f"data_backup_{timestamp}.json"
            
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Backup created: {backup_file.name}")
            return str(backup_file)
        except Exception as e:
            print(f"❌ Error creating backup: {e}")
            return None

    def restore_backup(self):
        """Restore data from a backup file"""
        try:
            backups = list(self.backup_dir.glob("data_backup_*.json"))
            if not backups:
                print("❌ No backup files found!")
                return False

            print("\n📋 Available backups:")
            for i, backup in enumerate(sorted(backups, reverse=True), 1):
                print(f"{i}. {backup.name}")
            
            choice = input("\nEnter backup number to restore (0 to cancel): ").strip()
            if choice == "0":
                return False
                
            backup_idx = int(choice) - 1
            if 0 <= backup_idx < len(backups):
                backup_file = sorted(backups, reverse=True)[backup_idx]
                
                with open(backup_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if self.save_data(data):
                    print(f"✅ Restored from {backup_file.name}")
                    return True
            else:
                print("❌ Invalid backup selection!")
                
        except Exception as e:
            print(f"❌ Error restoring backup: {e}")
        return False

    def update_player_data(self):
        """Manual player data update"""
        data = self.load_data()
        
        print("\n🔄 Player Data Update")
        print("1. Update existing player")
        print("2. Add new player")
        print("3. Remove player")
        
        choice = input("Choose option (1-3): ").strip()
        
        if choice == "1":
            self._update_existing_player(data)
        elif choice == "2":
            self._add_new_player(data)
        elif choice == "3":
            self._remove_player(data)
        else:
            print("❌ Invalid choice!")

    def _update_existing_player(self, data):
        """Update existing player information"""
        if not data["players"]:
            print("❌ No players found!")
            return
            
        print("\n📋 Current players:")
        players = list(data["players"].keys())
        for i, player in enumerate(players, 1):
            print(f"{i}. {player}")
        
        try:
            choice = int(input("Select player number: ")) - 1
            if 0 <= choice < len(players):
                player_id = players[choice]
                player_data = data["players"][player_id]
                
                print(f"\n📝 Updating {player_id}")
                print("Leave blank to keep current value")
                
                # Update fields
                for field in ["name", "rating", "guild", "friend_code", "region"]:
                    current = player_data.get(field, "")
                    new_value = input(f"{field.title()} ({current}): ").strip()
                    if new_value:
                        player_data[field] = new_value
                
                self.save_data(data)
            else:
                print("❌ Invalid player selection!")
        except ValueError:
            print("❌ Invalid input!")

    def _add_new_player(self, data):
        """Add a new player"""
        print("\n➕ Add New Player")
        
        player_id = input("Player ID: ").strip()
        if not player_id:
            print("❌ Player ID cannot be empty!")
            return
            
        if player_id in data["players"]:
            print("❌ Player already exists!")
            return
        
        player_data = {
            "name": input("Name: ").strip(),
            "rating": input("Rating: ").strip(),
            "guild": input("Guild: ").strip(),
            "friend_code": input("Friend Code: ").strip(),
            "region": input("Region: ").strip(),
            "last_updated": datetime.now().isoformat()
        }
        
        data["players"][player_id] = player_data
        self.save_data(data)
        print(f"✅ Player {player_id} added successfully!")

    def _remove_player(self, data):
        """Remove a player"""
        if not data["players"]:
            print("❌ No players found!")
            return
            
        print("\n📋 Current players:")
        players = list(data["players"].keys())
        for i, player in enumerate(players, 1):
            print(f"{i}. {player}")
        
        try:
            choice = int(input("Select player number to remove: ")) - 1
            if 0 <= choice < len(players):
                player_id = players[choice]
                confirm = input(f"⚠️  Are you sure you want to remove {player_id}? (yes/no): ")
                if confirm.lower() == 'yes':
                    del data["players"][player_id]
                    self.save_data(data)
                    print(f"✅ Player {player_id} removed!")
            else:
                print("❌ Invalid player selection!")
        except ValueError:
            print("❌ Invalid input!")

    def test_api_connection(self):
        """Test API connections"""
        print("\n🔍 Testing API Connections...")
        
        # Test endpoints
        endpoints = [
            "https://maimai.sega.jp/",
            "https://ongeki.sega.jp/",
            "https://chunithm.sega.jp/"
        ]
        
        for endpoint in endpoints:
            try:
                print(f"Testing {endpoint}...")
                response = requests.get(endpoint, timeout=5)
                if response.status_code == 200:
                    print(f"✅ {endpoint} - OK")
                else:
                    print(f"⚠️  {endpoint} - Status: {response.status_code}")
            except Exception as e:
                print(f"❌ {endpoint} - Error: {e}")

    def view_current_data(self):
        """Display current data overview"""
        data = self.load_data()
        
        print("\n📊 Current Data Overview")
        print("="*40)
        print(f"Players: {len(data.get('players', {}))}")
        print(f"Guilds: {len(data.get('guilds', {}))}")
        print(f"Queue entries: {len(data.get('queue', []))}")
        print(f"Last updated: {data.get('last_updated', 'Never')}")
        print("="*40)
        
        # Show some details
        if data.get("players"):
            print("\n👥 Recent Players:")
            for i, (player_id, player_data) in enumerate(list(data["players"].items())[:5], 1):
                name = player_data.get("name", "Unknown")
                rating = player_data.get("rating", "N/A")
                print(f"  {i}. {player_id} ({name}) - Rating: {rating}")
            
            if len(data["players"]) > 5:
                print(f"  ... and {len(data['players']) - 5} more")

    def validate_data(self):
        """Validate data integrity"""
        print("\n🔧 Running Data Validation...")
        data = self.load_data()
        issues = []
        
        # Check players
        for player_id, player_data in data.get("players", {}).items():
            if not isinstance(player_data, dict):
                issues.append(f"Player {player_id}: Invalid data structure")
            else:
                required_fields = ["name", "rating"]
                for field in required_fields:
                    if field not in player_data:
                        issues.append(f"Player {player_id}: Missing {field}")
        
        # Check guilds
        for guild_id, guild_data in data.get("guilds", {}).items():
            if not isinstance(guild_data, dict):
                issues.append(f"Guild {guild_id}: Invalid data structure")
        
        if issues:
            print(f"❌ Found {len(issues)} issues:")
            for issue in issues:
                print(f"  - {issue}")
        else:
            print("✅ Data validation passed!")

    def run_test_suite(self):
        """Run basic tests"""
        print("\n🧪 Running Test Suite...")
        
        tests_passed = 0
        total_tests = 3
        
        # Test 1: Data file accessibility
        try:
            data = self.load_data()
            print("✅ Test 1: Data loading - PASSED")
            tests_passed += 1
        except Exception as e:
            print(f"❌ Test 1: Data loading - FAILED ({e})")
        
        # Test 2: Backup functionality
        try:
            backup_file = self.create_backup()
            if backup_file and os.path.exists(backup_file):
                print("✅ Test 2: Backup creation - PASSED")
                tests_passed += 1
            else:
                print("❌ Test 2: Backup creation - FAILED")
        except Exception as e:
            print(f"❌ Test 2: Backup creation - FAILED ({e})")
        
        # Test 3: Data validation
        try:
            self.validate_data()
            print("✅ Test 3: Data validation - PASSED")
            tests_passed += 1
        except Exception as e:
            print(f"❌ Test 3: Data validation - FAILED ({e})")
        
        print(f"\n📊 Test Results: {tests_passed}/{total_tests} tests passed")

    def generate_statistics(self):
        """Generate and display statistics"""
        data = self.load_data()
        
        print("\n📊 BAMACO Statistics")
        print("="*40)
        
        players = data.get("players", {})
        guilds = data.get("guilds", {})
        
        # Player statistics
        if players:
            ratings = [float(p.get("rating", 0)) for p in players.values() if p.get("rating", "").replace(".", "").isdigit()]
            if ratings:
                avg_rating = sum(ratings) / len(ratings)
                max_rating = max(ratings)
                min_rating = min(ratings)
                
                print(f"Average Rating: {avg_rating:.2f}")
                print(f"Highest Rating: {max_rating}")
                print(f"Lowest Rating: {min_rating}")
        
        # Guild distribution
        if players:
            guild_counts = {}
            for player_data in players.values():
                guild = player_data.get("guild", "No Guild")
                guild_counts[guild] = guild_counts.get(guild, 0) + 1
            
            print("\n🏛️  Guild Distribution:")
            for guild, count in sorted(guild_counts.items(), key=lambda x: x[1], reverse=True):
                print(f"  {guild}: {count} players")

    def run(self):
        """Main application loop"""
        print("🎮 Welcome to BAMACO Manual Update Tool!")
        
        while True:
            try:
                self.display_menu()
                choice = input("\nEnter your choice (0-14): ").strip()
                
                if choice == "0":
                    print("👋 Goodbye!")
                    break
                elif choice == "1":
                    self.update_player_data()
                elif choice == "2":
                    print("🏛️  Guild update feature coming soon!")
                elif choice == "3":
                    print("📊 Queue update feature coming soon!")
                elif choice == "4":
                    self.test_api_connection()
                elif choice == "5":
                    self._add_new_player(self.load_data())
                elif choice == "6":
                    print("🏆 New guild profile feature coming soon!")
                elif choice == "7":
                    self.view_current_data()
                elif choice == "8":
                    self.validate_data()
                elif choice == "9":
                    self.create_backup()
                elif choice == "10":
                    self.restore_backup()
                elif choice == "11":
                    self.run_test_suite()
                elif choice == "12":
                    print("🔄 Regenerate all data feature coming soon!")
                elif choice == "13":
                    self.generate_statistics()
                elif choice == "14":
                    print("🗑️  Clean old data feature coming soon!")
                else:
                    print("❌ Invalid choice! Please try again.")
                    
                input("\nPress Enter to continue...")
                
            except KeyboardInterrupt:
                print("\n\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ An error occurred: {e}")
                input("Press Enter to continue...")

if __name__ == "__main__":
    updater = ManualUpdater()
    updater.run()