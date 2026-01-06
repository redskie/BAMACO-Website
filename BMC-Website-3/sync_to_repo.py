#!/usr/bin/env python3
"""
Auto-sync script for BAMACO Website
Automatically generates data.json and pushes all changes to GitHub
"""

import subprocess
import sys
from datetime import datetime

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"\n{'='*60}")
    print(f"🔄 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            text=True,
            capture_output=True
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(result.stderr)
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stdout:
            print(e.stdout)
        if e.stderr:
            print(e.stderr)
        return False

def main():
    print("\n" + "="*60)
    print("🚀 BAMACO Auto-Sync to GitHub")
    print("="*60)
    
    # Step 1: Generate data.json
    print("\n📊 Step 1: Generating data.json from HTML files...")
    if not run_command("python generate_data.py", "Running data generation"):
        print("\n⚠️  Warning: Data generation had issues, but continuing...")
    
    # Step 2: Check git status
    print("\n📋 Step 2: Checking for changes...")
    result = subprocess.run(
        "git status --short",
        shell=True,
        text=True,
        capture_output=True
    )
    
    if not result.stdout.strip():
        print("✅ No changes to commit. Repository is up to date!")
        return
    
    print("📝 Changes detected:")
    print(result.stdout)
    
    # Step 3: Add all changes
    if not run_command("git add -A", "Adding all changes"):
        print("❌ Failed to add changes")
        sys.exit(1)
    
    # Step 4: Commit with timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Auto-sync: Updates from VS Code ({timestamp})"
    
    # Ask user for custom commit message
    print(f"\n💬 Default commit message: '{commit_message}'")
    custom_message = input("Enter custom message (or press Enter to use default): ").strip()
    
    if custom_message:
        commit_message = custom_message
    
    if not run_command(f'git commit -m "{commit_message}"', "Committing changes"):
        print("❌ Failed to commit changes")
        sys.exit(1)
    
    # Step 5: Pull with rebase (in case remote has changes)
    print("\n🔄 Step 5: Syncing with remote (pull with rebase)...")
    if not run_command("git pull --rebase origin main", "Pulling latest changes"):
        print("⚠️  Pull failed. You may need to resolve conflicts manually.")
        print("Run: git status")
        sys.exit(1)
    
    # Step 6: Push to GitHub
    if not run_command("git push origin main", "Pushing to GitHub"):
        print("❌ Failed to push to GitHub")
        print("💡 Tip: Make sure you're connected to the internet and have push access")
        sys.exit(1)
    
    # Success!
    print("\n" + "="*60)
    print("✅ Successfully synced to GitHub!")
    print("🌐 View at: https://github.com/redskie/BAMACO-Website")
    print("="*60 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Sync cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)
