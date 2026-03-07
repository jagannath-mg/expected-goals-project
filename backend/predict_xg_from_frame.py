import cv2
import math
import numpy as np
import joblib  # to load your trained logistic regression model

# Load your trained model
model = joblib.load("XG_Model.pkl")  # updated model name

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
        print("Error loading:", frame)
        continue

    points = []

    def click_event(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN and len(points) < 3:
            points.append((x, y))
            print("Point:", x, y)

    print("\nProcessing:", frame)
    print("Click in order:")
    print("1 → Shot location")
    print("2 → Left goalpost")
    print("3 → Right goalpost")

    cv2.imshow("Frame", img)
    cv2.setMouseCallback("Frame", click_event)

    cv2.waitKey(0)
    cv2.destroyAllWindows()

    if len(points) < 3:
        print("Not enough points clicked, skipping frame.")
        continue

    shot_x, shot_y = points[0]
    left_x, left_y = points[1]
    right_x, right_y = points[2]

    # Compute goal center
    goal_x = (left_x + right_x) / 2
    goal_y = (left_y + right_y) / 2

    # Distance from shot to goal (pixels)
    dx = goal_x - shot_x
    dy = goal_y - shot_y
    pixel_distance = math.sqrt(dx**2 + dy**2)

    # Goal width in pixels
    goal_width_pixels = math.sqrt((right_x - left_x)**2 + (right_y - left_y)**2)

    # Convert pixels to meters (goal width = 7.32 m)
    pixel_to_meter = 7.32 / goal_width_pixels
    distance_meters = pixel_distance * pixel_to_meter

    # Distance from shot to left and right posts
    d1 = math.sqrt((shot_x - left_x)**2 + (shot_y - left_y)**2)
    d2 = math.sqrt((shot_x - right_x)**2 + (shot_y - right_y)**2)

    # Angle to goal in degrees
    cos_angle = (d1**2 + d2**2 - goal_width_pixels**2) / (2 * d1 * d2)
    cos_angle = max(-1, min(1, cos_angle))
    angle_deg = math.degrees(math.acos(cos_angle))

    # Get shot info from user
    body = input("Body part (foot/head): ").strip().lower()
    pressure = int(input("Under pressure? (1=yes / 0=no): "))
    penalty = int(input("Penalty shot? (1=yes / 0=no): "))

    # Convert body part to numeric
    body_num = 1 if body == "head" else 0
    # Normalize angle (0-1) if your model expects it
    angle_norm = angle_deg / 180

    # Feature vector: [distance_meters, angle_norm, body_num, pressure, penalty]
    features = np.array([[distance_meters, angle_norm, body_num, pressure, penalty]])

    # Predict xG using trained model
    xg = model.predict_proba(features)[0][1]  # probability of goal

    results.append((frame, round(xg, 3)))

# Display final xG results
print("\n====== FINAL XG RESULTS ======")
for r in results:
    print(r[0], "→ xG:", r[1])