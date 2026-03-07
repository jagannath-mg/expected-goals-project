import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# -----------------------------
# 1. Load your StatsBomb dataset
# -----------------------------
# Replace 'statsbomb_shots.csv' with your CSV file containing shots data
df = pd.read_csv("master_shots_clean_features.csv")

# -----------------------------
# 2. Select only features we can compute from video frames
# -----------------------------
# Required columns in your CSV: distance (meters), angle (degrees), body_part (foot/head),
# pressure (0/1), penalty (0/1), goal (1/0)
df = df[['distance', 'angle', 'body_part', 'pressure', 'penalty', 'goal']]

# Convert categorical body_part to numeric: foot=0, head=1
df['body_part'] = df['body_part'].apply(lambda x: 1 if x.lower()=='head' else 0)

# Normalize angle (0-180 degrees → 0-1)
df['angle_norm'] = df['angle'] / 180

# Final features and target
X = df[['distance', 'angle_norm', 'body_part', 'pressure', 'penalty']]
y = df['goal']

# -----------------------------
# 3. Split into train/test
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Optional: scale features (distance and angle)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -----------------------------
# 4. Train logistic regression model
# -----------------------------
model_5feat = LogisticRegression(max_iter=1000)
model_5feat.fit(X_train_scaled, y_train)

# Evaluate
score = model_5feat.score(X_test_scaled, y_test)
print(f"Accuracy on test set: {score:.3f}")

# -----------------------------
# 5. Save model and scaler
# -----------------------------
joblib.dump(model_5feat, "XG_Model_5feat.pkl")
joblib.dump(scaler, "XG_Scaler_5feat.pkl")
print("New 5-feature model saved as XG_Model_5feat.pkl")