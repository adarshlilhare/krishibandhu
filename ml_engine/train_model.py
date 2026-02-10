import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Crop Dataset with optimal conditions (Copied from main.py)
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

def generate_synthetic_data(num_samples_per_crop=1000):
    print("Generating synthetic dataset...")
    data = []
    labels = []

    for crop in CROP_DATA:
        name = crop['name']
        cond = crop['conditions']
        tol = crop['tolerance']

        for _ in range(num_samples_per_crop):
            # Generate random variations within tolerance
            # We add some Gaussian noise to make it more realistic
            
            # Nitrogen
            n_val = np.random.normal(cond['N'], tol['N'] / 2)
            # Phosphorus
            p_val = np.random.normal(cond['P'], tol['P'] / 2)
            # Potassium
            k_val = np.random.normal(cond['K'], tol['K'] / 2)
            # Temperature
            temp_val = np.random.normal(cond['temp'], tol['temp'] / 2)
            # Humidity
            humidity_val = np.random.normal(cond['humidity'], tol['humidity'] / 2)
            # pH
            ph_val = np.random.normal(cond['ph'], tol['ph'] / 2)
            # Rainfall
            rainfall_val = np.random.normal(cond['rainfall'], tol['rainfall'] / 2)

            # Ensure values are non-negative where appropriate
            n_val = max(0, n_val)
            p_val = max(0, p_val)
            k_val = max(0, k_val)
            humidity_val = max(0, min(100, humidity_val)) # 0-100%
            ph_val = max(0, min(14, ph_val)) # 0-14 pH scale
            rainfall_val = max(0, rainfall_val)

            data.append([n_val, p_val, k_val, temp_val, humidity_val, ph_val, rainfall_val])
            labels.append(name)

    df = pd.DataFrame(data, columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
    df['crop'] = labels
    return df

def train_model():
    # 1. Generate Data
    df = generate_synthetic_data()
    print(f"Generated {len(df)} samples.")

    # 2. Split Data
    X = df.drop('crop', axis=1)
    y = df['crop']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 3. Train Model
    print("Training Random Forest Classifier...")
    # Reduced n_estimators and added max_depth to keep model size small (<100MB) for GitHub
    model = RandomForestClassifier(n_estimators=30, max_depth=15, random_state=42)
    model.fit(X_train, y_train)

    # 4. Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")

    # 5. Save Model
    # Use compression to further reduce file size
    joblib.dump(model, 'crop_recommender.pkl', compress=3)
    print("Model saved as 'crop_recommender.pkl'")

if __name__ == "__main__":
    train_model()
