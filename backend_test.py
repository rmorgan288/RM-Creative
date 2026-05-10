"""
Comprehensive backend API tests for Rhys Morgan Creative Marketing
Tests all endpoints: Auth, Proposals CRUD, Proposal Actions, File Uploads, Contact Form
"""

import requests
import io
import json
from pathlib import Path

# Backend URL from frontend/.env
BASE_URL = "https://design-portfolio-780.preview.emergentagent.com/api"
ADMIN_PASSWORD = "BrunelHouse0301!"

# Test state
jwt_token = None
test_proposal_id = None
test_action_id = None

def print_test(name):
    print(f"\n{'='*80}")
    print(f"TEST: {name}")
    print('='*80)

def print_result(passed, message):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {message}")
    return passed

def get_headers(auth=False):
    headers = {"Content-Type": "application/json"}
    if auth and jwt_token:
        headers["Authorization"] = f"Bearer {jwt_token}"
    return headers

# =============================================================================
# 1. AUTH TESTS
# =============================================================================

def test_auth_login_correct():
    print_test("Auth - Login with correct password")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"password": ADMIN_PASSWORD},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "expires_in_hours" in data:
                global jwt_token
                jwt_token = data["token"]
                return print_result(True, f"Login successful, got JWT token (expires in {data['expires_in_hours']}h)")
            else:
                return print_result(False, f"Missing token or expires_in_hours in response: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_auth_login_wrong():
    print_test("Auth - Login with wrong password")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"password": "WrongPassword123!"},
            timeout=10
        )
        if response.status_code == 401:
            return print_result(True, "Correctly rejected wrong password with 401")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_auth_me_valid():
    print_test("Auth - GET /auth/me with valid token")
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("role") == "admin":
                return print_result(True, "Got admin role from /auth/me")
            else:
                return print_result(False, f"Expected role=admin, got: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_auth_me_invalid():
    print_test("Auth - GET /auth/me without token")
    try:
        response = requests.get(f"{BASE_URL}/auth/me", timeout=10)
        if response.status_code == 401:
            return print_result(True, "Correctly rejected request without token (401)")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

# =============================================================================
# 2. PROPOSALS CRUD TESTS
# =============================================================================

def test_proposals_get_hobby_horse_public():
    print_test("Proposals - GET /proposals/hobby-horse (public, no auth)")
    try:
        response = requests.get(f"{BASE_URL}/proposals/hobby-horse", timeout=10)
        if response.status_code == 200:
            data = response.json()
            checks = []
            
            # Check client
            if data.get("client") == "The Hobby Horse":
                checks.append("✓ client='The Hobby Horse'")
            else:
                checks.append(f"✗ client='{data.get('client')}' (expected 'The Hobby Horse')")
            
            # Check tiers
            tiers = data.get("investment", {}).get("tiers", [])
            tier_names = [t.get("name") for t in tiers]
            if len(tiers) == 3 and set(tier_names) == {"Essentials", "Growth", "Elite"}:
                checks.append(f"✓ 3 tiers: {tier_names}")
            else:
                checks.append(f"✗ tiers: {tier_names} (expected Essentials, Growth, Elite)")
            
            # Check Growth tier featured
            growth_tier = next((t for t in tiers if t.get("name") == "Growth"), None)
            if growth_tier and growth_tier.get("featured") is True:
                checks.append("✓ Growth tier has featured=True")
            else:
                checks.append(f"✗ Growth tier featured={growth_tier.get('featured') if growth_tier else 'N/A'}")
            
            # Check terms[1] contains £30/hr
            terms = data.get("terms", [])
            if len(terms) > 1 and "£30/hr" in terms[1]:
                checks.append(f"✓ terms[1] contains '£30/hr'")
            else:
                checks.append(f"✗ terms[1]: {terms[1] if len(terms) > 1 else 'N/A'}")
            
            print("\n".join(checks))
            all_passed = all("✓" in c for c in checks)
            return print_result(all_passed, "hobby-horse proposal validation")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_proposals_list_admin():
    print_test("Proposals - GET /proposals (admin)")
    try:
        response = requests.get(
            f"{BASE_URL}/proposals",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            slugs = [p.get("slug") for p in data]
            if "hobby-horse" in slugs:
                return print_result(True, f"Got {len(data)} proposals, includes 'hobby-horse'")
            else:
                return print_result(False, f"hobby-horse not in list: {slugs}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_proposals_list_no_auth():
    print_test("Proposals - GET /proposals (no auth)")
    try:
        response = requests.get(f"{BASE_URL}/proposals", timeout=10)
        if response.status_code == 401:
            return print_result(True, "Correctly rejected unauthenticated request (401)")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_proposals_create():
    print_test("Proposals - POST /proposals (create test-client-1)")
    global test_proposal_id
    try:
        payload = {
            "slug": "test-client-1",
            "status": "draft",
            "client": "Test Client One",
            "projectTitle": "Test Project",
            "preparedFor": "Test Person",
            "preparedBy": "Rhys Morgan",
            "reference": "TEST-001",
            "intro": "This is a test proposal",
            "scope": {"summary": "Test scope"},
            "investment": {"currency": "£", "tiers": []},
            "terms": []
        }
        response = requests.post(
            f"{BASE_URL}/proposals",
            headers={"Authorization": f"Bearer {jwt_token}", "Content-Type": "application/json"},
            json=payload,
            timeout=10
        )
        if response.status_code == 201:
            data = response.json()
            test_proposal_id = data.get("id")
            if test_proposal_id and data.get("slug") == "test-client-1":
                return print_result(True, f"Created proposal with id={test_proposal_id}")
            else:
                return print_result(False, f"Missing id or wrong slug: {data}")
        else:
            return print_result(False, f"Expected 201, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_proposals_create_duplicate():
    print_test("Proposals - POST /proposals (duplicate slug)")
    try:
        payload = {
            "slug": "test-client-1",
            "status": "draft",
            "client": "Duplicate",
            "projectTitle": "Duplicate",
            "preparedFor": "Test",
            "preparedBy": "Test",
            "reference": "DUP",
            "intro": "Duplicate",
            "scope": {"summary": "Dup"},
            "investment": {"currency": "£", "tiers": []},
            "terms": []
        }
        response = requests.post(
            f"{BASE_URL}/proposals",
            headers={"Authorization": f"Bearer {jwt_token}", "Content-Type": "application/json"},
            json=payload,
            timeout=10
        )
        if response.status_code == 409:
            return print_result(True, "Correctly rejected duplicate slug with 409")
        else:
            return print_result(False, f"Expected 409, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_proposals_update():
    print_test("Proposals - PUT /proposals/{id} (update)")
    try:
        payload = {
            "slug": "test-client-1",
            "status": "published",
            "client": "Test Client One Updated",
            "projectTitle": "Updated Project",
            "preparedFor": "Test Person",
            "preparedBy": "Rhys Morgan",
            "reference": "TEST-001-UPD",
            "intro": "Updated intro",
            "scope": {"summary": "Updated scope"},
            "investment": {"currency": "£", "tiers": []},
            "terms": []
        }
        response = requests.put(
            f"{BASE_URL}/proposals/{test_proposal_id}",
            headers={"Authorization": f"Bearer {jwt_token}", "Content-Type": "application/json"},
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("client") == "Test Client One Updated" and data.get("status") == "published":
                return print_result(True, "Successfully updated proposal")
            else:
                return print_result(False, f"Update didn't reflect changes: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_proposals_delete():
    print_test("Proposals - DELETE /proposals/{id}")
    try:
        response = requests.delete(
            f"{BASE_URL}/proposals/{test_proposal_id}",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=10
        )
        if response.status_code == 204:
            return print_result(True, "Successfully deleted proposal (204)")
        else:
            return print_result(False, f"Expected 204, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_proposals_get_deleted():
    print_test("Proposals - GET deleted proposal by slug")
    try:
        response = requests.get(f"{BASE_URL}/proposals/test-client-1", timeout=10)
        if response.status_code == 404:
            return print_result(True, "Correctly returned 404 for deleted proposal")
        else:
            return print_result(False, f"Expected 404, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_slug_validation_bad():
    print_test("Slug validation - POST with invalid slug 'Bad Slug!'")
    try:
        payload = {
            "slug": "Bad Slug!",
            "status": "draft",
            "client": "Test",
            "projectTitle": "Test",
            "preparedFor": "Test",
            "preparedBy": "Test",
            "reference": "TEST",
            "intro": "Test",
            "scope": {"summary": "Test"},
            "investment": {"currency": "£", "tiers": []},
            "terms": []
        }
        response = requests.post(
            f"{BASE_URL}/proposals",
            headers={"Authorization": f"Bearer {jwt_token}", "Content-Type": "application/json"},
            json=payload,
            timeout=10
        )
        if response.status_code == 400:
            return print_result(True, "Correctly rejected invalid slug with 400")
        else:
            return print_result(False, f"Expected 400, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_slug_validation_upper():
    print_test("Slug validation - POST with uppercase slug 'UPPER'")
    try:
        payload = {
            "slug": "UPPER",
            "status": "draft",
            "client": "Test",
            "projectTitle": "Test",
            "preparedFor": "Test",
            "preparedBy": "Test",
            "reference": "TEST",
            "intro": "Test",
            "scope": {"summary": "Test"},
            "investment": {"currency": "£", "tiers": []},
            "terms": []
        }
        response = requests.post(
            f"{BASE_URL}/proposals",
            headers={"Authorization": f"Bearer {jwt_token}", "Content-Type": "application/json"},
            json=payload,
            timeout=10
        )
        # Note: The backend converts to lowercase, so "UPPER" becomes "upper" which is valid
        # Let's check if it was created with lowercase
        if response.status_code == 201:
            data = response.json()
            if data.get("slug") == "upper":
                # Clean up
                requests.delete(
                    f"{BASE_URL}/proposals/{data.get('id')}",
                    headers={"Authorization": f"Bearer {jwt_token}"},
                    timeout=10
                )
                return print_result(True, "Slug was normalized to lowercase 'upper'")
            else:
                return print_result(False, f"Unexpected slug: {data.get('slug')}")
        else:
            return print_result(False, f"Expected 201 (normalized), got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

# =============================================================================
# 3. PROPOSAL ACTIONS TESTS
# =============================================================================

def test_action_approve():
    print_test("Proposal Actions - POST approve action")
    global test_action_id
    try:
        payload = {"action": "approve", "tier": "Growth"}
        response = requests.post(
            f"{BASE_URL}/proposals/hobby-horse/action",
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and data.get("id"):
                test_action_id = data.get("id")
                return print_result(True, f"Created approve action with id={test_action_id}")
            else:
                return print_result(False, f"Missing ok or id: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_action_revision():
    print_test("Proposal Actions - POST revision action")
    try:
        payload = {
            "action": "revision",
            "payload": {"name": "Test User", "question": "Can we adjust the timeline?"}
        }
        response = requests.post(
            f"{BASE_URL}/proposals/hobby-horse/action",
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and data.get("id"):
                return print_result(True, f"Created revision action with id={data.get('id')}")
            else:
                return print_result(False, f"Missing ok or id: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_action_decline():
    print_test("Proposal Actions - POST decline action")
    try:
        payload = {
            "action": "decline",
            "payload": {"feedback": "Not the right time for us"}
        }
        response = requests.post(
            f"{BASE_URL}/proposals/hobby-horse/action",
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and data.get("id"):
                return print_result(True, f"Created decline action with id={data.get('id')}")
            else:
                return print_result(False, f"Missing ok or id: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_action_invalid():
    print_test("Proposal Actions - POST invalid action")
    try:
        payload = {"action": "foo"}
        response = requests.post(
            f"{BASE_URL}/proposals/hobby-horse/action",
            json=payload,
            timeout=10
        )
        if response.status_code == 400:
            return print_result(True, "Correctly rejected invalid action with 400")
        else:
            return print_result(False, f"Expected 400, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_action_nonexistent_slug():
    print_test("Proposal Actions - POST to non-existent slug")
    try:
        payload = {"action": "approve", "tier": "Growth"}
        response = requests.post(
            f"{BASE_URL}/proposals/nonexistent-slug-xyz/action",
            json=payload,
            timeout=10
        )
        if response.status_code == 404:
            return print_result(True, "Correctly returned 404 for non-existent slug")
        else:
            return print_result(False, f"Expected 404, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_action_list_admin():
    print_test("Proposal Actions - GET /proposal-actions (admin)")
    try:
        response = requests.get(
            f"{BASE_URL}/proposal-actions",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if len(data) >= 3:
                # Check that our 3 actions are in the list (most recent first)
                actions = [a.get("action") for a in data[:5]]
                return print_result(True, f"Got {len(data)} actions, recent: {actions}")
            else:
                return print_result(False, f"Expected at least 3 actions, got {len(data)}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_action_list_no_auth():
    print_test("Proposal Actions - GET /proposal-actions (no auth)")
    try:
        response = requests.get(f"{BASE_URL}/proposal-actions", timeout=10)
        if response.status_code == 401:
            return print_result(True, "Correctly rejected unauthenticated request (401)")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_action_mark_read():
    print_test("Proposal Actions - POST /proposal-actions/{id}/read")
    try:
        response = requests.post(
            f"{BASE_URL}/proposal-actions/{test_action_id}/read",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                return print_result(True, "Marked action as read")
            else:
                return print_result(False, f"Missing ok: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_action_unread_count():
    print_test("Proposal Actions - GET /proposal-actions/unread-count")
    try:
        response = requests.get(
            f"{BASE_URL}/proposal-actions/unread-count",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if "count" in data and isinstance(data["count"], int):
                return print_result(True, f"Unread count: {data['count']}")
            else:
                return print_result(False, f"Missing or invalid count: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

# =============================================================================
# 4. FILE UPLOAD TESTS
# =============================================================================

def test_upload_valid_image():
    print_test("File Upload - POST /uploads with valid PNG")
    global uploaded_filename
    try:
        # Create a minimal valid PNG (1x1 pixel)
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  # PNG signature
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,  # IHDR chunk
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,  # IDAT chunk
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,  # IEND chunk
            0x42, 0x60, 0x82
        ])
        
        files = {"file": ("test.png", io.BytesIO(png_data), "image/png")}
        response = requests.post(
            f"{BASE_URL}/uploads",
            headers={"Authorization": f"Bearer {jwt_token}"},
            files=files,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if "filename" in data and "path" in data:
                uploaded_filename = data["filename"]
                return print_result(True, f"Uploaded file: {data['filename']}, path: {data['path']}")
            else:
                return print_result(False, f"Missing filename or path: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_upload_get_file():
    print_test("File Upload - GET /uploads/{filename}")
    try:
        response = requests.get(f"{BASE_URL}/uploads/{uploaded_filename}", timeout=10)
        if response.status_code == 200:
            if len(response.content) > 0:
                return print_result(True, f"Retrieved file, size: {len(response.content)} bytes")
            else:
                return print_result(False, "File content is empty")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_upload_wrong_extension():
    print_test("File Upload - POST with .txt file")
    try:
        files = {"file": ("test.txt", io.BytesIO(b"test content"), "text/plain")}
        response = requests.post(
            f"{BASE_URL}/uploads",
            headers={"Authorization": f"Bearer {jwt_token}"},
            files=files,
            timeout=10
        )
        if response.status_code == 400:
            return print_result(True, "Correctly rejected .txt file with 400")
        else:
            return print_result(False, f"Expected 400, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_upload_no_auth():
    print_test("File Upload - POST without auth")
    try:
        png_data = bytes([0x89, 0x50, 0x4E, 0x47])  # Minimal PNG header
        files = {"file": ("test.png", io.BytesIO(png_data), "image/png")}
        response = requests.post(f"{BASE_URL}/uploads", files=files, timeout=10)
        if response.status_code == 401:
            return print_result(True, "Correctly rejected unauthenticated upload (401)")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_upload_path_traversal():
    print_test("File Upload - GET with path traversal attempt")
    try:
        response = requests.get(f"{BASE_URL}/uploads/../../etc/passwd", timeout=10)
        if response.status_code == 404:
            return print_result(True, "Path traversal blocked (404)")
        else:
            return print_result(False, f"Expected 404, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

# =============================================================================
# 5. CONTACT FORM TESTS
# =============================================================================

def test_contact_submit():
    print_test("Contact Form - POST /contact")
    try:
        payload = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "message": "I'm interested in your services."
        }
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and data.get("id"):
                return print_result(True, f"Submitted contact form with id={data.get('id')}")
            else:
                return print_result(False, f"Missing ok or id: {data}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_contact_missing_fields():
    print_test("Contact Form - POST with missing fields")
    try:
        payload = {"name": "John Doe", "email": ""}  # Missing message
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        if response.status_code == 400:
            return print_result(True, "Correctly rejected incomplete form with 400")
        else:
            return print_result(False, f"Expected 400, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_contact_list_admin():
    print_test("Contact Form - GET /contact-submissions (admin)")
    try:
        response = requests.get(
            f"{BASE_URL}/contact-submissions",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if len(data) >= 1:
                return print_result(True, f"Got {len(data)} contact submissions")
            else:
                return print_result(False, f"Expected at least 1 submission, got {len(data)}")
        else:
            return print_result(False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

def test_contact_list_no_auth():
    print_test("Contact Form - GET /contact-submissions (no auth)")
    try:
        response = requests.get(f"{BASE_URL}/contact-submissions", timeout=10)
        if response.status_code == 401:
            return print_result(True, "Correctly rejected unauthenticated request (401)")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {e}")

# =============================================================================
# MAIN TEST RUNNER
# =============================================================================

if __name__ == "__main__":
    print("\n" + "="*80)
    print("RHYS MORGAN CREATIVE MARKETING - BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin Password: {ADMIN_PASSWORD}")
    
    results = []
    
    # 1. Auth tests
    results.append(test_auth_login_correct())
    results.append(test_auth_login_wrong())
    results.append(test_auth_me_valid())
    results.append(test_auth_me_invalid())
    
    # 2. Proposals CRUD tests
    results.append(test_proposals_get_hobby_horse_public())
    results.append(test_proposals_list_admin())
    results.append(test_proposals_list_no_auth())
    results.append(test_proposals_create())
    results.append(test_proposals_create_duplicate())
    results.append(test_proposals_update())
    results.append(test_proposals_delete())
    results.append(test_proposals_get_deleted())
    results.append(test_slug_validation_bad())
    results.append(test_slug_validation_upper())
    
    # 3. Proposal actions tests
    results.append(test_action_approve())
    results.append(test_action_revision())
    results.append(test_action_decline())
    results.append(test_action_invalid())
    results.append(test_action_nonexistent_slug())
    results.append(test_action_list_admin())
    results.append(test_action_list_no_auth())
    results.append(test_action_mark_read())
    results.append(test_action_unread_count())
    
    # 4. File upload tests
    results.append(test_upload_valid_image())
    results.append(test_upload_get_file())
    results.append(test_upload_wrong_extension())
    results.append(test_upload_no_auth())
    results.append(test_upload_path_traversal())
    
    # 5. Contact form tests
    results.append(test_contact_submit())
    results.append(test_contact_missing_fields())
    results.append(test_contact_list_admin())
    results.append(test_contact_list_no_auth())
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    print(f"Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
    
    print("="*80)
