import cv2
import math
import numpy as np
import joblib
import pickle
import pandas as pd

print("Loading production xG model...")
# Load your NEW trained model & preprocessors
model = joblib.load("xg_model_5feat.pkl")
label_encoders = joblib.load("label_encoders.pkl")
feature_columns = joblib.load("feature_columns.pkl")
print("✅ Model loaded! Features:", feature_columns)

# List of frames to process
frames = [
    "shot_frame_280.png",
    "shot_frame_485.png", 
    "shot_frame_991.png",
    "shot_frame_1522.png",
    "shot_frame_1532.jpg"
]

results = []

for frame in frames:
    img = cv2.imread(frame)
    if img is None:
        print("❌ Error loading:", frame)
        continue

    points = []

    def click_event(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN and len(points) < 3:
            points.append((x, y))
            cv2.circle(img, (x, y), 8, (0, 255, 0), -1)
            cv2.imshow("Frame - Click Points", img)
            print("✅ Point captured:", x, y)

    print(f"\n🎯 Processing: {frame}")
    print("👆 Click 3 points:")
    print("1. Shot location (RED)")
    print("2. Left goalpost (GREEN)") 
    print("3. Right goalpost (BLUE)")
    print("Press any key when done")

    cv2.namedWindow("Frame - Click Points")
    cv2.imshow("Frame - Click Points", img)
    cv2.setMouseCallback("Frame - Click Points", click_event)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    if len(points) < 3:
        print("❌ Need 3 points, skipping...")
        continue

    # Extract coordinates
    shot_x, shot_y = points[0]
    left_x, left_y = points[1] 
    right_x, right_y = points[2]

    # Visualize points
    cv2.circle(img, points[0], 12, (0, 0, 255), 3)  # Shot RED
    cv2.circle(img, points[1], 10, (0, 255, 0), 3)  # Left GREEN
    cv2.circle(img, points[2], 10, (255, 0, 0), 3)  # Right BLUE

    # Goal center
    goal_x = (left_x + right_x) / 2
    goal_y = (left_y + right_y) / 2
    cv2.circle(img, (int(goal_x), int(goal_y)), 6, (255, 255, 0), -1)

    # Goal line
    cv2.line(img, (left_x, left_y), (right_x, right_y), (255, 255, 255), 3)

    # Distance line
    cv2.line(img, (shot_x, shot_y), (int(goal_x), int(goal_y)), (0, 255, 255), 2)

    cv2.imshow("Shot Analysis - Press any key", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # Calculate distance (pixels → meters)
    goal_width_pixels = math.sqrt((right_x - left_x)**2 + (right_y - left_y)**2)
    pixel_to_meter = 7.32 / goal_width_pixels  # Standard goal width
    distance_meters = math.sqrt((goal_x - shot_x)**2 + (goal_y - shot_y)**2) * pixel_to_meter

    # Calculate angle using law of cosines
    d1 = math.sqrt((shot_x - left_x)**2 + (shot_y - left_y)**2) * pixel_to_meter
    d2 = math.sqrt((shot_x - right_x)**2 + (shot_y - right_y)**2) * pixel_to_meter
    cos_angle = (d1**2 + d2**2 - 7.32**2) / (2 * d1 * d2)
    cos_angle = max(-1.0, min(1.0, cos_angle))
    angle_rad = math.acos(cos_angle)
    angle_deg = math.degrees(angle_rad)

    # User input (match your training data)
    print(f"\n📏 Shot Analysis:")
    print(f"Distance: {distance_meters:.1f}m")
    print(f"Angle: {angle_deg:.1f}°")
    
    body_input = input("Body part? (Right Foot/Left Foot/Head/Other): ").strip()
    pressure_input = input("Under pressure? (True/False): ").strip().title()
    shot_type_input = input("Shot type? (Open Play/Free Kick/Penalty): ").strip()

    # Create feature DataFrame (exact match to training)
    shot_features = pd.DataFrame({
        'distance_to_goal': [distance_meters],
        'angle_to_goal': [angle_deg / 180.0],  # Normalize 0-1
        'body_part': [body_input],
        'under_pressure': [pressure_input],
        'shot_type': [shot_type_input]
    })

    # **CRITICAL: Apply SAME encoding as training**
    for col in ['body_part', 'under_pressure', 'shot_type']:
        try:
            shot_features[col] = label_encoders[col].transform(shot_features[col].astype(str))
        except ValueError as e:
            print(f"⚠️ Warning: Unknown {col} value '{shot_features[col].iloc[0]}'")
            print(f"Available {col} values:", dict(zip(range(len(label_encoders[col].classes_)), label_encoders[col].classes_)))
            # Use most common (0) as fallback
            shot_features[col] = 0

    # Reorder to match training feature_columns
    shot_features = shot_features[feature_columns]

    print(f"\n🔮 Features prepared: {shot_features.values.flatten().round(3)}")

    # Predict xG
    xg_proba = model.predict_proba(shot_features)[0][1]
    
    results.append((frame, distance_meters, angle_deg, xg_proba))
    
    print(f"🎲 xG Prediction: **{xg_proba:.3f}**")
    print("-" * 50)

# Final results table
print("\n" + "="*80)
print("🏆 FINAL xG RESULTS")
print("="*80)
print(f"{'Frame':<20} {'Distance':<10} {'Angle':<8} {'xG':<6}")
print("-"*80)
for frame, dist, angle, xg in results:
    print(f"{frame:<20} {dist:<10.1f} {angle:<8.1f} {xg:<6.3f}")
print("="*80)

# Save results
results_df = pd.DataFrame(results, columns=['frame', 'distance_m', 'angle_deg', 'xg'])
results_df.to_csv('xg_predictions.csv', index=False)
print("💾 Results saved: xg_predictions.csv")
