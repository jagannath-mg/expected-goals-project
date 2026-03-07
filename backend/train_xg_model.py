import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib

df = pd.read_csv("master_shots_clean_features.csv")

features = [
    "distance_to_goal",
    "angle_to_goal",
    "body_part",
    "shot_type",
    "under_pressure"
]

X = df[features]
y = df["is_goal"]   # corrected column name

X = pd.get_dummies(X)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

joblib.dump(model, "XG_Model.pkl")
joblib.dump(X.columns.tolist(), "model_columns.pkl")

print("Model trained successfully")