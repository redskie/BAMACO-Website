"""
MaiMai DX Player Data API Integration
Fetches player data from MaiMai DX using friend codes
"""

import requests
import time
from typing import Dict, List, Optional

class MaiMaiAPI:
    """Wrapper for MaiMai DX Player Data API"""
    
    BASE_URL = "https://maimai-data-get.onrender.com"
    
    def __init__(self, timeout: int = 60):
        """
        Initialize MaiMai API client
        
        Args:
            timeout: Request timeout in seconds (default 60 for cold start)
        """
        self.timeout = timeout
        self.session = requests.Session()
    
    def get_player(self, friend_code: str, max_retries: int = 3) -> Dict:
        """
        Get player data by friend code with retry logic
        
        Args:
            friend_code: 15-digit MaiMai friend code
            max_retries: Maximum number of retry attempts
        
        Returns:
            Dictionary with player data or error information
        """
        url = f"{self.BASE_URL}/api/player/{friend_code}"
        
        for attempt in range(max_retries):
            try:
                print(f"📡 Fetching player data for {friend_code} (attempt {attempt + 1}/{max_retries})")
                
                response = self.session.get(url, timeout=self.timeout)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if data.get("success"):
                        print(f"✅ Successfully fetched data for {data.get('ign', 'Unknown')}")
                        return data
                    elif "Session expired" in data.get("error", ""):
                        print("⏳ Session expired, waiting and retrying...")
                        time.sleep(5)
                        continue
                    else:
                        print(f"❌ API returned error: {data.get('error')}")
                        return data
                else:
                    print(f"⚠️  Server returned status {response.status_code}")
                    if attempt < max_retries - 1:
                        time.sleep(2)
                        continue
                    return {
                        "success": False,
                        "error": f"Server error: {response.status_code}"
                    }
                    
            except requests.Timeout:
                print(f"⏰ Request timeout (attempt {attempt + 1}/{max_retries})")
                if attempt < max_retries - 1:
                    time.sleep(2)
                    continue
                return {
                    "success": False,
                    "error": "Request timeout - API may be cold starting"
                }
            except Exception as e:
                print(f"❌ Error: {str(e)}")
                return {
                    "success": False,
                    "error": f"Exception: {str(e)}"
                }
        
        return {
            "success": False,
            "error": "Max retries exceeded"
        }
    
    def get_batch(self, friend_codes: List[str]) -> Dict:
        """
        Get data for multiple players (max 10 at a time)
        
        Args:
            friend_codes: List of friend codes (max 10)
        
        Returns:
            Dictionary with batch results
        """
        if len(friend_codes) > 10:
            return {
                "success": False,
                "error": "Maximum 10 friend codes per batch request"
            }
        
        if len(friend_codes) == 0:
            return {
                "success": False,
                "error": "At least one friend code required"
            }
        
        url = f"{self.BASE_URL}/api/batch"
        
        try:
            print(f"📡 Batch fetching data for {len(friend_codes)} players")
            
            response = self.session.post(
                url,
                json={"friend_codes": friend_codes},
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                successful = sum(1 for r in data.get("results", []) if r.get("success"))
                print(f"✅ Batch fetch complete: {successful}/{len(friend_codes)} successful")
                return data
            else:
                return {
                    "success": False,
                    "error": f"Server error: {response.status_code}"
                }
                
        except Exception as e:
            print(f"❌ Batch error: {str(e)}")
            return {
                "success": False,
                "error": f"Exception: {str(e)}"
            }
    
    def check_health(self) -> Dict:
        """
        Check API health status
        
        Returns:
            Dictionary with health status
        """
        url = f"{self.BASE_URL}/health"
        
        try:
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                return {"status": "unhealthy", "error": f"Status {response.status_code}"}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}
    
    def validate_friend_code(self, friend_code: str) -> bool:
        """
        Validate friend code format (basic check, API does full validation)
        
        Args:
            friend_code: Friend code to validate
        
        Returns:
            True if valid format, False otherwise
        """
        # Basic validation - must be numeric and reasonable length
        # API will do the actual validation
        return (
            isinstance(friend_code, str) and
            len(friend_code) >= 10 and
            friend_code.isdigit()
        )


def test_api():
    """Test the API integration"""
    api = MaiMaiAPI()
    
    print("\n" + "="*60)
    print("🧪 Testing MaiMai API Integration")
    print("="*60 + "\n")
    
    # Test health check
    print("1. Testing health check...")
    health = api.check_health()
    print(f"   Health status: {health.get('status', 'unknown')}\n")
    
    # Test single player fetch
    test_code = "101680566000997"
    print(f"2. Testing single player fetch ({test_code})...")
    result = api.get_player(test_code)
    
    if result.get("success"):
        print(f"   ✅ Success!")
        print(f"   IGN: {result.get('ign')}")
        print(f"   Rating: {result.get('rating')}")
        print(f"   Trophy: {result.get('trophy', 'None')}")
        print(f"   Icon URL: {result.get('icon_url', 'None')}\n")
    else:
        print(f"   ❌ Failed: {result.get('error')}\n")
    
    # Test batch fetch
    test_codes = ["101680566000997", "101232330856982"]
    print(f"3. Testing batch fetch ({len(test_codes)} codes)...")
    batch_result = api.get_batch(test_codes)
    
    if batch_result.get("success"):
        print(f"   ✅ Batch success!")
        for r in batch_result.get("results", []):
            if r.get("success"):
                print(f"   - {r.get('ign')}: {r.get('rating')}")
            else:
                print(f"   - Error: {r.get('error')}")
    else:
        print(f"   ❌ Batch failed: {batch_result.get('error')}")
    
    print("\n" + "="*60)
    print("✨ API Test Complete")
    print("="*60 + "\n")


if __name__ == "__main__":
    test_api()
