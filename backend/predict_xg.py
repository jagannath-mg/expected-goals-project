import cv2
import math
import pandas as pd
import joblib

# load trained xG model
model = joblib.load("XG_Model.pkl")
model_columns = joblib.load("model_columns.pkl")

image_path = "shot_frame.jpg"
img = cv2.imread(image_path)

points = []

def click_event(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        points.append((x,y))
        print("Point:",x,y)

cv2.imshow("Click SHOT first, then GOAL center", img)
cv2.setMouseCallback("Click SHOT first, then GOAL center", click_event)

cv2.waitKey(0)
cv2.destroyAllWindows()

shot_x, shot_y = points[0]
goal_x, goal_y = points[1]

# pixel distance
dx = goal_x - shot_x
dy = goal_y - shot_y
pixel_distance = math.sqrt(dx**2 + dy**2)

# approximate pixel→meter conversion
pixel_to_meter = 0.08
distance_meters = pixel_distance * pixel_to_meter

angle = math.degrees(math.atan2(abs(dy), abs(dx)))

print("\nEnter additional shot info")

body_part = input("body part (foot/head): ")
pressure = int(input("under defensive pressure? (1=yes 0=no): "))
shot_type = "open_play"

data = pd.DataFrame([{
    "distance_to_goal": distance_meters,
    "angle_to_goal": angle,
    "body_part": body_part,
    "shot_type": shot_type,
    "under_pressure": pressure
}])

data = pd.get_dummies(data)
data = data.reindex(columns=model_columns, fill_value=0)

xg = model.predict_proba(data)[0][1]

print("\nExpected Goals (xG):", round(xg,3))