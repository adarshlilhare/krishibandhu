from flask import Flask, request, jsonify
import pickle
import pandas as pd

import os

app = Flask(__name__)

# ---------------- LOAD FILES ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
try:
    model = pickle.load(open(os.path.join(BASE_DIR, "model.pkl"), "rb"))
    data = pd.read_csv(os.path.join(BASE_DIR, "merged.csv"))
    print("Model and data loaded successfully")
except Exception as e:
    print("Error loading files:", e)

# ---------------- HOME ROUTE ----------------
@app.route("/")
def home():
    return "Agri API Running Successfully"

# ---------------- PREDICT PRICE ----------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        input_data = request.json

        features = [
            input_data["temperature"],
            input_data["humidity"],
            input_data["wind_speed"],
            input_data["meanpressure"],
            input_data["month"]
        ]

        prediction = model.predict([features])

        return jsonify({
            "predicted_price": float(prediction[0]),
            "status": "success"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "failed"
        })

# ---------------- TOP CROPS ----------------
@app.route("/top-crops", methods=["GET"])
def top_crops():
    try:
        result = data.groupby("crop")["price"].mean().sort_values(ascending=False)

        return jsonify({
            "top_crops": result.head(10).to_dict(),
            "status": "success"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "failed"
        })

# ---------------- INSIGHTS ----------------
@app.route("/insights", methods=["GET"])
def insights():
    try:
        result = data.groupby("crop")["price"].mean().sort_values(ascending=False)

        best_crop = result.index[0]
        worst_crop = result.index[-1]

        return jsonify({
            "best_crop": best_crop,
            "worst_crop": worst_crop,
            "message": f"{best_crop} is currently the most profitable crop",
            "status": "success"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "failed"
        })

# ---------------- HEALTH CHECK ----------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "API is running fine"
    })

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(debug=True)