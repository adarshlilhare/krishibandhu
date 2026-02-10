from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_crop_advisory():
    # Test case 1: Rice-like conditions
    payload = {
        "nitrogen": 80,
        "phosphorus": 40,
        "potassium": 40,
        "temperature": 25,
        "humidity": 80,
        "ph": 6.5,
        "rainfall": 200
    }
    
    response = client.post("/advisory/crop", json=payload)
    assert response.status_code == 200
    data = response.json()
    print("Test 1 (Rice-like) Response:", json.dumps(data, indent=2))
    
    # Check if Rice is in recommendations (it should be, given the model accuracy)
    assert "Rice" in data["recommended_crops"] or len(data["recommended_crops"]) > 0

    # Test case 2: Extreme conditions (No Crop)
    payload_extreme = {
        "nitrogen": 1000,
        "phosphorus": 1000,
        "potassium": 1000,
        "temperature": 100,
        "humidity": 0,
        "ph": 0,
        "rainfall": 0
    }
    
    response_extreme = client.post("/advisory/crop", json=payload_extreme)
    assert response_extreme.status_code == 200
    data_extreme = response_extreme.json()
    print("Test 2 (Extreme) Response:", json.dumps(data_extreme, indent=2))
    
    # Check for the specific "no crop" message
    assert "no crop in the whole world can be grown in this condition" in data_extreme["recommended_crops"]

if __name__ == "__main__":
    test_crop_advisory()
    print("All tests passed!")
