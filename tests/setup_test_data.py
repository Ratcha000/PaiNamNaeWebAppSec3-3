"""
Test Data Setup Helper for Payment UAT Tests
Creates pending payment data via API so driver tests can verify payments.
"""
import urllib.request
import json
import sys

API_BASE = "http://localhost:3001/api"

def api_call(method, path, body=None):
    url = f"{API_BASE}{path}"
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        res = urllib.request.urlopen(req)
        raw = res.read().decode()
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            print(f"  Non-JSON Response: {raw[:200]}")
            return None
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        print(f"  API Error {e.code}: {err_body}")
        return None
    except urllib.error.URLError as e:
        print(f"  Connection Error: {e.reason} (Is the backend running on port 3000?)")
        return None

def main():
    print("=" * 50)
    print("Payment UAT - Test Data Setup")
    print("=" * 50)

    # Step 1: Setup Driver Profile
    print("\n[1] Setting up Driver Profile for testro1...")
    profile_res = api_call("POST", "/test/setup-driver-profile", body={"driverUsername": "testro1"})
    
    if profile_res and profile_res.get("data"):
        data = profile_res["data"]
        print(f"  ✅ QR Code: {'SET' if data.get('hasQrCode') else 'NOT SET'}")
        print(f"  ✅ Bank Info: {'SET' if data.get('hasBankInfo') else 'NOT SET'}")
        print(f"  ✅ Payment Method: {data.get('paymentMethod')}")
    else:
        print("  ❌ Failed to setup driver profile")
        sys.exit(1)

    # Step 2: Reset Payments
    print("\n[2] Checking and resetting passenger payments...")
    reset_res = api_call("POST", "/test/reset-payments", body={
        "passengerUsername": "testro2",
        "driverUsername": "testro1"
    })
    
    if reset_res and reset_res.get("data"):
        data = reset_res["data"]
        print(f"  ✅ {reset_res.get('message', 'Reset successful')}")
        print(f"  Total payments: {data.get('totalPayments')}")
        print(f"  Pending payments: {data.get('pendingCount')}")
        
        for p in data.get("payments", []):
            pid = p.get("id", "?")[:12]
            status = p.get("status", "?")
            verify = p.get("verificationStatus", "?")
            amount = p.get("amount", "?")
            print(f"  - {pid}... status={status} verify={verify} amount={amount}")
            
        if data.get("pendingCount", 0) > 0:
             print("\n" + "=" * 50)
             print("  ✅ READY! The system is now ready for UAT tests.")
             print("  💡 Run: robot --outputdir results --loglevel DEBUG payment/")
             print("=" * 50)
        else:
             print("\n  ⚠️ WARNING: No pending payments available. Tests might skip.")
    else:
        print("  ❌ Failed to reset payments")
        sys.exit(1)

if __name__ == "__main__":
    main()
