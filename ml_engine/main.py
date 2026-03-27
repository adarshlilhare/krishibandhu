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
import os

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load disease dataset
try:
    with open(os.path.join(BASE_DIR, 'diseases.json'), 'r') as f:
        DISEASE_DATASET = json.load(f)
except FileNotFoundError:
    print("Error: diseases.json not found.")
    DISEASE_DATASET = []

# Load class indices mapping
try:
    with open(os.path.join(BASE_DIR, 'class_indices.json'), 'r') as f:
        CLASS_MAPPING = json.load(f)
    print("Class mapping loaded successfully")
except FileNotFoundError:
    print("Error: class_indices.json not found.")
    CLASS_MAPPING = {}

import io
from PIL import Image
import numpy as np
import pandas as pd
import joblib


# Load Models
try:
    crop_model = joblib.load(os.path.join(BASE_DIR, 'crop_recommender.pkl'))
    print("Crop Advisory Model Loaded Successfully")
except Exception as e:
    print(f"Error loading crop model: {e}")
    crop_model = None

try:
    import tensorflow as tf
    disease_model = tf.keras.models.load_model(os.path.join(BASE_DIR, 'disease_model.h5'))
    print("Disease Detection Model Loaded Successfully")
except Exception as e:
    print(f"Error loading disease model: {e}")
    disease_model = None

def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))
    img_array = np.array(image)
    img_array = img_array / 255.0  # Normalize to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

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

    # 2. Disease Prediction
    if disease_model and CLASS_MAPPING:
        try:
            # Preprocess
            processed_image = preprocess_image(image)
            
            # Predict
            predictions = disease_model.predict(processed_image, verbose=0)
            predicted_class_index = str(np.argmax(predictions[0]))
            confidence = float(np.max(predictions[0]))
            
            # Map index to class name
            result_disease_name = CLASS_MAPPING.get(predicted_class_index)
            
            if result_disease_name:
                # Find the disease data in our dataset
                # Note: some classes in the model might not be in our diseases.json (if it's a "healthy" class)
                if "healthy" in result_disease_name.lower():
                    result = {
                        "disease": "Healthy Plant",
                        "crop": result_disease_name.split("_")[0],
                        "confidence": confidence,
                        "remedy": "The plant appears healthy. Continue regular care."
                    }
                else:
                    # Try to find a match in the dataset based on keyword or name
                    # Standardizing name for lookup
                    lookup_name = result_disease_name.replace("___", " ").replace("__", " ").replace("_", " ")
                    
                    found_result = next((item for item in DISEASE_DATASET if item["disease"].lower() in lookup_name.lower() or lookup_name.lower() in item["disease"].lower()), None)
                    
                    if found_result:
                        result = found_result.copy()
                        result['confidence'] = confidence
                    else:
                        result = {
                            "disease": lookup_name,
                            "crop": result_disease_name.split("_")[0],
                            "confidence": confidence,
                            "remedy": "No specific remedy found in database. Consult an expert."
                        }
        except Exception as e:
            print(f"Inference error: {e}")

    # FALLBACK / MOCK LOGIC (If model missing or inference failed)
    if 'result' not in locals():
        file_hash = hashlib.md5(content).hexdigest()
        index = int(file_hash, 16) % len(DISEASE_DATASET)
        result = DISEASE_DATASET[index].copy()
        result['confidence'] = float(result.get('confidence', 0.8))

    # Check for the 50-80% range logic (only for diseases, not for healthy)
    if 0.50 <= result['confidence'] <= 0.80 and "Healthy" not in result['disease']:
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
        # Extract user inputs with safe conversion
        try:
            N = float(data.get('nitrogen', 0) or 0)
            P = float(data.get('phosphorus', 0) or 0)
            K = float(data.get('potassium', 0) or 0)
            temp = float(data.get('temperature', 0) or 0)
            humidity = float(data.get('humidity', 0) or 0)
            ph = float(data.get('ph', 0) or 0)
            rainfall = float(data.get('rainfall', 0) or 0)
        except ValueError:
             return {
                "recommended_crops": ["Invalid Input Format"],
                "reason": "Please ensure all fields contain valid numbers."
            }

        # Sanity Check for Extreme Conditions
        if (temp > 50 or temp < -10 or 
            ph < 0 or ph > 14 or 
            humidity < 0 or humidity > 100 or 
            rainfall < 0):
             return {
                "recommended_crops": ["no crop in the whole world can be grown in this condition"],
                "reason": "The provided environmental conditions are too extreme for any known crop."
            }

        # Rule-Based Matching (Distance Algorithm)
        # Calculate compatibility score for each crop based on normalized difference
        scored_crops = []
        user_conditions = {'N': N, 'P': P, 'K': K, 'temp': temp, 'humidity': humidity, 'ph': ph, 'rainfall': rainfall}
        
        for crop in CROP_DATA:
            score = 0
            conditions = crop['conditions']
            
            # Calculate total normalized difference (lower is better match)
            # Use max(1, val) to avoid division by zero
            score += abs(N - conditions['N']) / max(1, conditions['N'])
            score += abs(P - conditions['P']) / max(1, conditions['P'])
            score += abs(K - conditions['K']) / max(1, conditions['K'])
            score += abs(temp - conditions['temp']) / max(1, conditions['temp'])
            score += abs(humidity - conditions['humidity']) / max(1, conditions['humidity'])
            score += abs(ph - conditions['ph']) / max(1, conditions['ph'])
            score += abs(rainfall - conditions['rainfall']) / max(1, conditions['rainfall'])
            
            scored_crops.append((crop['name'], score))
        
        # Sort by score (ascending: lower difference is better)
        scored_crops.sort(key=lambda x: x[1])
        
        # Get top 3
        top_crops = [name for name, score in scored_crops[:3]]
        
        # Determine reason based on best match
        best_crop = scored_crops[0][0]
        reason = f"Best suited for current soil nutrients and climate conditions, matching closely with {best_crop} requirements."
        
        return {
            "recommended_crops": top_crops,
            "reason": reason
        }

    except Exception as e:
        print(f"Error in advisory: {e}")
        return {
            "recommended_crops": ["Error processing data"],
            "reason": f"An unexpected error occurred: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
