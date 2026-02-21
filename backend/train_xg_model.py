import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, roc_auc_score

# Load dataset
df = pd.read_csv("master_shots_clean_features.csv")

# Select features
X = df[[
    "distance_to_goal",
    "angle_to_goal",
    "body_part",
    "shot_type",
    "under_pressure"
]]

y = df["is_goal"]

# Convert categorical to numeric
X = pd.get_dummies(X, drop_first=True)

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# Train model
model = LogisticRegression(max_iter=2000)
model.fit(X_train, y_train)

# Evaluate
pred = model.predict(X_test)
prob = model.predict_proba(X_test)[:,1]

print("Accuracy:", accuracy_score(y_test, pred))
print("ROC-AUC:", roc_auc_score(y_test, prob))

# Save model + columns
joblib.dump(model, "XG_Model.pkl")
joblib.dump(X.columns, "model_columns.pkl")

print("Model and columns saved successfully!")