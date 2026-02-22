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
//Without feature importance and reasons 
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import xgboost as xgb

app = Flask(__name__)
CORS(app)

# Load model (skip columns.pkl)
model = joblib.load("XG_Model.pkl")

# Extract feature names from model
try:
    feature_names = model.feature_names_in_
except:
    feature_names = list(model.get_booster().feature_names)
print(f"Model features: {feature_names}")  # Debug: lists expected inputs

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
    return jsonify({"xg": float(xg)})

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)

'''
'''
#NEWWWWWWWWWWWWW
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# 1. Load the model (which is actually a Pipeline)
# Ensure the .pkl file is in the same folder as this script
model = joblib.load("XG_Model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        
        # 2. Convert incoming JSON to a DataFrame
        # We use the raw labels ("Right Foot", "Open Play") because 
        # the Pipeline handles the encoding internally.
        sample_shot = pd.DataFrame([{
            "minute": int(data.get('minute', 0)),
            "x": float(data.get('x', 0)),
            "y": float(data.get('y', 40)), # Default to center width if missing
            "distance_to_goal": float(data.get('distance_to_goal', 0)),
            "angle_to_goal": float(data.get('angle_to_goal', 0)),
            "body_part": data.get('body_part', 'Right Foot'),
            "shot_type": data.get('shot_type', 'Open Play'),
            "under_pressure": int(data.get('under_pressure', 0))
        }])

        # 3. Predict using predict_proba
        # [:, 1] gets the probability of the "Goal" class (1)
        xg_probability = model.predict_proba(sample_shot)[:, 1][0]
        
        return jsonify({
            "xg": float(xg_probability),
            "status": "success"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    # Running on 5000 to match your React fetch calls
    app.run(host='127.0.0.1', port=5000, debug=True)
    '''