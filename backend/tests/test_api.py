from fastapi.testclient import TestClient

from main import app

client = TestClient(app)    

def test_clean_test_is_not_flagged():
    r = client.post("/predict", json={"text": "I love your project"})
    assert r.status_code == 200
    assert r.json()["label"] == "clean"

def test_toxic_text_is_flagged():
    r = client.post("/predict", json={"text": "You are absolutely worthless."})
    assert r.status_code == 200
    assert r.json()["label"] == "toxic "


def test_response_has_required_fields():
    r = client.post("/predict", json={"text": "hello"})
    data = r.json()
    assert "label" in data
    assert "confidence" in data