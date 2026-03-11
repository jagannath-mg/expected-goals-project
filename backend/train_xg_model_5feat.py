import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
from sklearn.metrics import roc_auc_score, accuracy_score, precision_recall_fscore_support
import joblib
import matplotlib.pyplot as plt
import os

print("XGBoost version check...")
import xgboost
print(f"✅ XGBoost {xgboost.__version__} detected")

# Optional seaborn
try:
    import seaborn as sns
    SEABORN_AVAILABLE = True
except ImportError:
    SEABORN_AVAILABLE = False

# Load dataset
csv_path = 'master_shots_clean_features.csv'
df = pd.read_csv(csv_path)

print("Dataset shape:", df.shape)
print("Dataset columns:", df.columns.tolist())
print("\nFirst few rows:")
print(df.head())

# **EXACT MATCH** to your columns
feature_cols = ['distance_to_goal', 'angle_to_goal', 'body_part', 'under_pressure', 'shot_type']
target_col = 'is_goal'

print(f"\n✅ Using columns: {feature_cols + [target_col]}")
print("\nTarget distribution:")
print(df[target_col].value_counts(normalize=True))

df_model = df[feature_cols + [target_col]].copy()

# Encode categoricals
categorical_cols = ['body_part', 'shot_type', 'under_pressure']
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df_model[col] = le.fit_transform(df_model[col].astype(str))
    label_encoders[col] = le
    print(f"Encoded {col}: {df_model[col].nunique()} values")

# Prepare data
X = df_model[feature_cols]
y = df_model[target_col]

print("\nFeatures shape:", X.shape)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Train: {X_train.shape[0]} | Test: {X_test.shape[0]}")

# **SIMPLEST WORKING VERSION** - No early stopping arguments in fit()
model = xgb.XGBClassifier(
    n_estimators=200,  # Fixed number
    learning_rate=0.1,
    max_depth=4,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric='logloss',
    scale_pos_weight=(len(y_train) - sum(y_train)) / sum(y_train)
)

# **COMPATIBLE WITH ALL VERSIONS** - eval_set works everywhere
model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False
)

print("✅ Model trained successfully!")

# Predictions
y_pred_proba = model.predict_proba(X_test)[:, 1]
y_pred = (y_pred_proba >= 0.5).astype(int)

# Metrics
auc = roc_auc_score(y_test, y_pred_proba)
accuracy = accuracy_score(y_test, y_pred)
precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')

print("\n" + "="*60)
print("🎯 EXPECTED GOALS (xG) MODEL RESULTS")
print("="*60)
print(f"Dataset: {len(df):,} shots | {sum(y):,} goals ({sum(y)/len(y)*100:.1f}%)")
print(f"AUC ROC:     {auc:.4f}")
print(f"Accuracy:    {accuracy:.4f}")
print(f"Precision:   {precision:.4f}")
print(f"Recall:      {recall:.4f}")
print(f"F1 Score:    {f1:.4f}")
print("="*60)

# Feature importance
importance_df = pd.DataFrame({
    'feature': feature_cols,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n📈 Feature Importance:")
print(importance_df.round(4))

# Plot
plt.figure(figsize=(10, 6))
if SEABORN_AVAILABLE:
    sns.barplot(data=importance_df, x='importance', y='feature', palette='rocket')
else:
    bars = plt.barh(range(len(importance_df)), importance_df['importance'])
    plt.yticks(range(len(importance_df)), importance_df['feature'])
    plt.gca().invert_yaxis()
    for bar, imp in zip(bars, importance_df['importance']):
        plt.text(imp + 0.001, bar.get_y() + bar.get_height()/2, f'{imp:.3f}')

plt.title('xG Model Feature Importance (5 Features)', fontweight='bold')
plt.xlabel('Importance')
plt.tight_layout()
plt.savefig('xg_feature_importance.png', dpi=300, bbox_inches='tight')
plt.show()

# Save artifacts
joblib.dump(model, 'xg_model_5feat.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')
joblib.dump(feature_cols, 'feature_columns.pkl')

print("\n" + "="*60)
print("✅ SUCCESS! FILES SAVED")
print("="*60)
print("• xg_model_5feat.pkl")
print("• label_encoders.pkl") 
print("• feature_columns.pkl")
print("• xg_feature_importance.png")
print("="*60)
print("🎉 Production-ready xG model complete!")

