from starlette.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health_returns_200():
    res = client.get("/api/health")
    assert res.status_code == 200


def test_health_has_required_fields():
    data = client.get("/api/health").json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "uptime_seconds" in data
    assert "api_key_configured" in data
