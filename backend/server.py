from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load model + columns
model = joblib.load("XG_Model.pkl")
columns = joblib.load("model_columns.pkl")

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    sample = pd.DataFrame([data])
    sample = pd.get_dummies(sample)
    sample = sample.reindex(columns=columns, fill_value=0)

    xg = model.predict_proba(sample)[0][1]

    return jsonify({"xg": float(xg)})

if __name__ == "__main__":
    app.run(debug=True)