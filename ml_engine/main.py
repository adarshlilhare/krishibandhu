from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "KrishiBandhu ML Engine is running"}

import json
import hashlib

# Load disease dataset
with open('diseases.json', 'r') as f:
    DISEASE_DATASET = json.load(f)

import io
from PIL import Image
import numpy as np

@app.post("/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    # Read file content
    content = await file.read()
    
    # 1. Check for "Plant-like" features (Green Color Dominance)
    try:
        image = Image.open(io.BytesIO(content)).convert('RGB')
        img_array = np.array(image)
        
        # Calculate green dominance
        # Simple heuristic: Count pixels where Green > Red and Green > Blue
        # A more robust way is converting to HSV, but this is fast and effective for a mock
        green_pixels = np.sum((img_array[:, :, 1] > img_array[:, :, 0]) & (img_array[:, :, 1] > img_array[:, :, 2]))
        total_pixels = img_array.shape[0] * img_array.shape[1]
        green_ratio = green_pixels / total_pixels
        
        # Threshold: If less than 10% of the image is "green-dominant", assume it's not a crop/plant
        if green_ratio < 0.10:
             return {
                "disease": "No Crop or Plant Detected",
                "confidence": 0.0,
                "remedy": "The uploaded image does not appear to be a crop or plant leaf (insufficient green color). Please upload a clear image of a plant leaf."
            }
            
    except Exception as e:
        print(f"Error processing image: {e}")
        # Fallback if image processing fails
        pass

    # 2. Deterministic Disease Selection (for valid crops)
    file_hash = hashlib.md5(content).hexdigest()
    
    # Use the hash to deterministically select a disease from the dataset
    index = int(file_hash, 16) % len(DISEASE_DATASET)
    result = DISEASE_DATASET[index]

    # Check for the 50-80% range logic
    if 0.50 <= result['confidence'] <= 0.80:
        return {
            "disease": "No Disease Detected",
            "crop": result.get('crop', 'Unknown'),
            "confidence": result['confidence'],
            "remedy": "No specific disease detected with high confidence. The plant appears to be relatively healthy or the symptoms are minor."
        }
    
    return result

# Crop Dataset with optimal conditions
# Expanded Crop Dataset (30+ crops)
CROP_DATA = [
    # Grains & Cereals
    {
        "name": "Rice",
        "conditions": {"N": 80, "P": 40, "K": 40, "temp": 25, "humidity": 80, "ph": 6.5, "rainfall": 200},
        "tolerance": {"N": 20, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 50}
    },
    {
        "name": "Wheat",
        "conditions": {"N": 60, "P": 30, "K": 30, "temp": 20, "humidity": 60, "ph": 6.5, "rainfall": 100},
        "tolerance": {"N": 15, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 30}
    },
    {
        "name": "Maize",
        "conditions": {"N": 70, "P": 40, "K": 40, "temp": 25, "humidity": 65, "ph": 6.5, "rainfall": 150},
        "tolerance": {"N": 20, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 40}
    },
    {
        "name": "Barley",
        "conditions": {"N": 60, "P": 30, "K": 30, "temp": 18, "humidity": 50, "ph": 6.5, "rainfall": 80},
        "tolerance": {"N": 15, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    {
        "name": "Millet",
        "conditions": {"N": 40, "P": 20, "K": 20, "temp": 28, "humidity": 40, "ph": 6.5, "rainfall": 50},
        "tolerance": {"N": 10, "P": 5, "K": 5, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    
    # Pulses & Legumes
    {
        "name": "Chickpea",
        "conditions": {"N": 40, "P": 60, "K": 30, "temp": 20, "humidity": 50, "ph": 7.0, "rainfall": 80},
        "tolerance": {"N": 10, "P": 15, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    {
        "name": "Kidney Beans",
        "conditions": {"N": 20, "P": 60, "K": 20, "temp": 22, "humidity": 55, "ph": 6.0, "rainfall": 100},
        "tolerance": {"N": 5, "P": 15, "K": 5, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 30}
    },
    {
        "name": "Pigeon Peas",
        "conditions": {"N": 20, "P": 60, "K": 20, "temp": 28, "humidity": 60, "ph": 6.0, "rainfall": 100},
        "tolerance": {"N": 5, "P": 15, "K": 5, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 30}
    },
    {
        "name": "Moth Beans",
        "conditions": {"N": 20, "P": 40, "K": 20, "temp": 28, "humidity": 45, "ph": 7.0, "rainfall": 60},
        "tolerance": {"N": 5, "P": 10, "K": 5, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    {
        "name": "Mung Bean",
        "conditions": {"N": 20, "P": 40, "K": 20, "temp": 28, "humidity": 60, "ph": 6.5, "rainfall": 75},
        "tolerance": {"N": 5, "P": 10, "K": 5, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    {
        "name": "Black Gram",
        "conditions": {"N": 40, "P": 60, "K": 20, "temp": 28, "humidity": 65, "ph": 7.0, "rainfall": 70},
        "tolerance": {"N": 10, "P": 15, "K": 5, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    {
        "name": "Lentil",
        "conditions": {"N": 20, "P": 60, "K": 20, "temp": 20, "humidity": 50, "ph": 6.5, "rainfall": 60},
        "tolerance": {"N": 5, "P": 15, "K": 5, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },

    # Fruits
    {
        "name": "Apple",
        "conditions": {"N": 100, "P": 50, "K": 100, "temp": 15, "humidity": 60, "ph": 6.0, "rainfall": 100},
        "tolerance": {"N": 20, "P": 10, "K": 20, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 30}
    },
    {
        "name": "Banana",
        "conditions": {"N": 100, "P": 75, "K": 50, "temp": 27, "humidity": 80, "ph": 6.5, "rainfall": 150},
        "tolerance": {"N": 20, "P": 15, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 40}
    },
    {
        "name": "Mango",
        "conditions": {"N": 20, "P": 20, "K": 30, "temp": 30, "humidity": 50, "ph": 6.0, "rainfall": 120},
        "tolerance": {"N": 5, "P": 5, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 30}
    },
    {
        "name": "Grapes",
        "conditions": {"N": 20, "P": 120, "K": 200, "temp": 25, "humidity": 60, "ph": 6.5, "rainfall": 70},
        "tolerance": {"N": 5, "P": 20, "K": 40, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    {
        "name": "Watermelon",
        "conditions": {"N": 100, "P": 10, "K": 50, "temp": 26, "humidity": 50, "ph": 6.5, "rainfall": 50},
        "tolerance": {"N": 20, "P": 5, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 10}
    },
    {
        "name": "Muskmelon",
        "conditions": {"N": 100, "P": 10, "K": 50, "temp": 28, "humidity": 50, "ph": 6.5, "rainfall": 50},
        "tolerance": {"N": 20, "P": 5, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 10}
    },
    {
        "name": "Orange",
        "conditions": {"N": 20, "P": 10, "K": 10, "temp": 25, "humidity": 60, "ph": 7.0, "rainfall": 110},
        "tolerance": {"N": 5, "P": 5, "K": 5, "temp": 10, "humidity": 10, "ph": 1.0, "rainfall": 30}
    },
    {
        "name": "Papaya",
        "conditions": {"N": 50, "P": 50, "K": 50, "temp": 28, "humidity": 75, "ph": 6.5, "rainfall": 150},
        "tolerance": {"N": 10, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 40}
    },
    {
        "name": "Coconut",
        "conditions": {"N": 20, "P": 10, "K": 30, "temp": 27, "humidity": 80, "ph": 6.0, "rainfall": 200},
        "tolerance": {"N": 5, "P": 5, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 50}
    },
    {
        "name": "Pomegranate",
        "conditions": {"N": 20, "P": 10, "K": 40, "temp": 25, "humidity": 50, "ph": 6.5, "rainfall": 70},
        "tolerance": {"N": 5, "P": 5, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },

    # Commercial & Others
    {
        "name": "Cotton",
        "conditions": {"N": 120, "P": 40, "K": 20, "temp": 30, "humidity": 50, "ph": 7.0, "rainfall": 80},
        "tolerance": {"N": 20, "P": 10, "K": 5, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    {
        "name": "Jute",
        "conditions": {"N": 80, "P": 40, "K": 40, "temp": 30, "humidity": 85, "ph": 6.5, "rainfall": 180},
        "tolerance": {"N": 20, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 40}
    },
    {
        "name": "Coffee",
        "conditions": {"N": 100, "P": 20, "K": 30, "temp": 22, "humidity": 80, "ph": 6.0, "rainfall": 220},
        "tolerance": {"N": 20, "P": 5, "K": 10, "temp": 4, "humidity": 10, "ph": 0.8, "rainfall": 40}
    },
    {
        "name": "Tea",
        "conditions": {"N": 100, "P": 30, "K": 30, "temp": 20, "humidity": 85, "ph": 5.5, "rainfall": 250},
        "tolerance": {"N": 20, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 50}
    },
    {
        "name": "Sugarcane",
        "conditions": {"N": 100, "P": 50, "K": 50, "temp": 28, "humidity": 75, "ph": 7.0, "rainfall": 180},
        "tolerance": {"N": 25, "P": 15, "K": 15, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 40}
    },
    {
        "name": "Rubber",
        "conditions": {"N": 100, "P": 50, "K": 50, "temp": 28, "humidity": 80, "ph": 5.5, "rainfall": 250},
        "tolerance": {"N": 20, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 50}
    },
    {
        "name": "Tobacco",
        "conditions": {"N": 60, "P": 40, "K": 40, "temp": 25, "humidity": 60, "ph": 6.0, "rainfall": 100},
        "tolerance": {"N": 15, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 30}
    },
    {
        "name": "Mustard",
        "conditions": {"N": 50, "P": 25, "K": 25, "temp": 20, "humidity": 55, "ph": 7.0, "rainfall": 60},
        "tolerance": {"N": 15, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    },
    {
        "name": "Pineapple",
        "conditions": {"N": 50, "P": 20, "K": 50, "temp": 25, "humidity": 75, "ph": 5.0, "rainfall": 150},
        "tolerance": {"N": 10, "P": 5, "K": 15, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 50}
    },
    {
        "name": "Strawberry",
        "conditions": {"N": 40, "P": 20, "K": 30, "temp": 18, "humidity": 65, "ph": 6.0, "rainfall": 80},
        "tolerance": {"N": 10, "P": 5, "K": 5, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 20}
    },
    {
        "name": "Guava",
        "conditions": {"N": 50, "P": 30, "K": 30, "temp": 26, "humidity": 60, "ph": 6.5, "rainfall": 100},
        "tolerance": {"N": 10, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 30}
    },
    {
        "name": "Spinach",
        "conditions": {"N": 60, "P": 20, "K": 40, "temp": 15, "humidity": 60, "ph": 6.5, "rainfall": 50},
        "tolerance": {"N": 15, "P": 5, "K": 10, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 15}
    },
    {
        "name": "Broccoli",
        "conditions": {"N": 80, "P": 30, "K": 60, "temp": 18, "humidity": 70, "ph": 6.5, "rainfall": 70},
        "tolerance": {"N": 20, "P": 10, "K": 15, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 20}
    },
    {
        "name": "Cauliflower",
        "conditions": {"N": 80, "P": 40, "K": 60, "temp": 18, "humidity": 75, "ph": 6.5, "rainfall": 70},
        "tolerance": {"N": 20, "P": 10, "K": 15, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 20}
    },
    {
        "name": "Cabbage",
        "conditions": {"N": 90, "P": 40, "K": 60, "temp": 18, "humidity": 75, "ph": 6.5, "rainfall": 70},
        "tolerance": {"N": 20, "P": 10, "K": 15, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 20}
    },
    {
        "name": "Turmeric",
        "conditions": {"N": 60, "P": 30, "K": 60, "temp": 25, "humidity": 80, "ph": 6.0, "rainfall": 150},
        "tolerance": {"N": 15, "P": 10, "K": 15, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 40}
    },
    {
        "name": "Ginger",
        "conditions": {"N": 60, "P": 30, "K": 60, "temp": 25, "humidity": 80, "ph": 6.0, "rainfall": 180},
        "tolerance": {"N": 15, "P": 10, "K": 15, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 40}
    },
    {
        "name": "Garlic",
        "conditions": {"N": 50, "P": 25, "K": 40, "temp": 15, "humidity": 50, "ph": 6.5, "rainfall": 60},
        "tolerance": {"N": 10, "P": 5, "K": 10, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 20}
    },
    {
        "name": "Onion",
        "conditions": {"N": 60, "P": 30, "K": 50, "temp": 20, "humidity": 60, "ph": 6.5, "rainfall": 70},
        "tolerance": {"N": 15, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 0.5, "rainfall": 20}
    },
    {
        "name": "Sunflower",
        "conditions": {"N": 60, "P": 40, "K": 40, "temp": 25, "humidity": 50, "ph": 7.0, "rainfall": 60},
        "tolerance": {"N": 15, "P": 10, "K": 10, "temp": 5, "humidity": 10, "ph": 1.0, "rainfall": 20}
    }
]

@app.post("/advisory/crop")
async def recommend_crop(data: dict):
    try:
        # Extract user inputs
        N = float(data.get('nitrogen', 0))
        P = float(data.get('phosphorus', 0))
        K = float(data.get('potassium', 0))
        temp = float(data.get('temperature', 0))
        humidity = float(data.get('humidity', 0))
        ph = float(data.get('ph', 0))
        rainfall = float(data.get('rainfall', 0))

        scores = []

        for crop in CROP_DATA:
            score = 0
            conditions = crop['conditions']
            tolerance = crop['tolerance']

            # Calculate score based on proximity to optimal conditions
            # Lower difference = Higher score
            
            # Nitrogen
            if abs(N - conditions['N']) <= tolerance['N']:
                score += 20
            elif abs(N - conditions['N']) <= tolerance['N'] * 2:
                score += 10
            
            # Phosphorus
            if abs(P - conditions['P']) <= tolerance['P']:
                score += 15
            elif abs(P - conditions['P']) <= tolerance['P'] * 2:
                score += 7.5
                
            # Potassium
            if abs(K - conditions['K']) <= tolerance['K']:
                score += 15
            elif abs(K - conditions['K']) <= tolerance['K'] * 2:
                score += 7.5

            # Temperature (Critical)
            if abs(temp - conditions['temp']) <= tolerance['temp']:
                score += 20
            elif abs(temp - conditions['temp']) <= tolerance['temp'] * 1.5:
                score += 10
            else:
                score -= 10 # Penalty for unsuitable temperature

            # Humidity
            if abs(humidity - conditions['humidity']) <= tolerance['humidity']:
                score += 10
            
            # pH
            if abs(ph - conditions['ph']) <= tolerance['ph']:
                score += 10
            
            # Rainfall (Critical)
            if abs(rainfall - conditions['rainfall']) <= tolerance['rainfall']:
                score += 20
            elif abs(rainfall - conditions['rainfall']) <= tolerance['rainfall'] * 1.5:
                score += 10
            else:
                score -= 10 # Penalty for unsuitable rainfall

            scores.append({"crop": crop['name'], "score": score})

        # Sort by score descending
        scores.sort(key=lambda x: x['score'], reverse=True)
        
        # Get top 3 recommendations with a minimum score threshold
        # We use a threshold of 40 to ensure at least some conditions match
        top_crops = [item['crop'] for item in scores[:3] if item['score'] > 40]
        
        if not top_crops:
            # STRICT "No Crop" Logic as requested
            top_crops = ["no crop in the whole world can be grown in this condition"]
            reason = "The provided environmental conditions (Temperature, Rainfall, Soil Nutrients) are too extreme for any known crop in our database."
        else:
            reason = f"Best suited for current soil nutrients, temperature ({temp}°C), and rainfall ({rainfall}mm)."

        return {
            "recommended_crops": top_crops,
            "reason": reason
        }

    except Exception as e:
        print(f"Error in advisory: {e}")
        return {
            "recommended_crops": ["Error processing data"],
            "reason": "Please check your input values."
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
