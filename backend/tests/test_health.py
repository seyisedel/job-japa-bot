"""Tests for JobJapa Admin backend health endpoints."""
import os
import requests
import pytest

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://726d8feb-9d31-426e-8d46-69df113cef1c.preview.emergentagent.com",
).rstrip("/")


class TestHealth:
    def test_health_endpoint(self):
        r = requests.get(f"{BASE_URL}/api/health", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("service") == "jobjapa-admin"

    def test_api_root(self):
        r = requests.get(f"{BASE_URL}/api/", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
