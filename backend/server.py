'''
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import xgboost as xgb

app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load("XG_Model.pkl")

# Extract feature names from model
try:
    feature_names = model.feature_names_in_
except:
    feature_names = list(model.get_booster().feature_names)
print(f"Model features: {feature_names}")  # Debug

@app.route('/features', methods=['GET'])
def get_features():
    return jsonify({
        'numeric': ['minute', 'x', 'y', 'distance_to_goal', 'angle_to_goal'],
        'categorical': ['body_part', 'shot_type'], 
        'binary': ['under_pressure'],
        'all_features': feature_names,
        'importance': {name: float(val) for name, val in zip(feature_names, model.feature_importances_)}
    })

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    sample = pd.DataFrame([data])
    sample = pd.get_dummies(sample)  # Handle categoricals
    sample = sample.reindex(columns=feature_names, fill_value=0)  # Match model order
    
    xg = model.predict_proba(sample)[0][1]
    
    # NEW: Rule-based reasons for low xG (< 0.1)
    reasons = []
    if xg < 0.1:
        dist = data.get('distance_to_goal', 0)
        angle = data.get('angle_to_goal', 0)
        body = data.get('body_part', '').lower()
        pressure = data.get('under_pressure', 0)
        
        if dist > 25:
            reasons.append("long distance")
        if angle < 0.5 or angle > 0.9:  # Difficult angles on 0-1 scale
            reasons.append("difficult angle")
        if 'left foot' in body:  # Weak foot example (customize if needed)
            reasons.append("weak foot")
        if 'head' in body:
            reasons.append("header used")
        if pressure == 1:
            reasons.append("under pressure")
    
    return jsonify({
        "xg": float(xg),
        "reasons": reasons if reasons else None
    })

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
'''

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import xgboost as xgb
import math  # ADDED for degrees to radians conversion

app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load("XG_Model.pkl")

# Extract feature names from model
try:
    feature_names = model.feature_names_in_
except:
    feature_names = list(model.get_booster().feature_names)
print(f"Model features: {feature_names}")  # Debug

@app.route('/features', methods=['GET'])
def get_features():
    return jsonify({
        'numeric': ['minute', 'x', 'y', 'distance_to_goal', 'angle_to_goal'],
        'categorical': ['body_part', 'shot_type'], 
        'binary': ['under_pressure'],
        'all_features': feature_names,
        'importance': {name: float(val) for name, val in zip(feature_names, model.feature_importances_)}
    })

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    
    # CONVERT USER DEGREES TO RADIANS (model expects radians)
    angle_deg = float(data.get('angle_to_goal', 0))
    angle_rad = math.radians(angle_deg)  # e.g., 45° → 0.785 rad
    
    # Build sample with radians for model
    sample = pd.DataFrame([{
        'minute': int(data.get('minute', 0)),
        'x': float(data.get('x', 0)),
        'y': float(data.get('y', 40)),
        'distance_to_goal': float(data.get('distance_to_goal', 0)),
        'angle_to_goal': angle_rad,  # RADIANS for model
        'body_part': data.get('body_part', 'Right Foot'),
        'shot_type': data.get('shot_type', 'Open Play'),
        'under_pressure': int(data.get('under_pressure', 0))
    }])
    
    sample = pd.get_dummies(sample)  # Handle categoricals
    sample = sample.reindex(columns=feature_names, fill_value=0)  # Match model order
    
    xg = model.predict_proba(sample)[0][1]
    
    # Rule-based reasons for low xG (< 0.1) - using DEGREES (user-friendly)
    reasons = []
    if xg < 0.1:
        dist = data.get('distance_to_goal', 0)
        body = data.get('body_part', '').lower()
        pressure = data.get('under_pressure', 0)
        
        if dist > 25:
            reasons.append("long distance")
        if angle_deg < 30 or angle_deg > 150:  # Difficult angles in degrees
            reasons.append("difficult angle")
        if 'left foot' in body:
            reasons.append("weak foot")
        if 'head' in body:
            reasons.append("header used")
        if pressure == 1:
            reasons.append("under pressure")
    
    return jsonify({
        "xg": float(xg),
        "reasons": reasons if reasons else None
    })

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
