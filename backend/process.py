import cv2
import math

# List of your frames
images = [
    "shot_frame_280.png",
    "shot_frame_485.png",
    "shot_frame_991.png",
    "shot_frame_1522.png",
    "shot_frame_1532.jpg"
]

results = []

for img_path in images:

    img = cv2.imread(img_path)

    if img is None:
        print(f"Could not load {img_path}")
        continue

    height, width, _ = img.shape

    # Goal center (top middle of image)
    goal_x = width / 2
    goal_y = 0

    clicked = []

    def click_event(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:

            shot_x = x
            shot_y = y

            # Distance calculation
            distance = math.sqrt((shot_x - goal_x)**2 + (shot_y - goal_y)**2)

            # Angle calculation
            angle = math.degrees(math.atan2(abs(shot_x - goal_x), shot_y))

            results.append({
                "image": img_path,
                "x": shot_x,
                "y": shot_y,
                "distance": distance,
                "angle": angle
            })

            cv2.circle(img, (x, y), 6, (0,0,255), -1)
            cv2.imshow(img_path, img)

            print(f"\n{img_path}")
            print(f"Coordinates: ({shot_x}, {shot_y})")
            print(f"Distance: {distance:.2f}")
            print(f"Angle: {angle:.2f}")

    cv2.imshow(img_path, img)
    cv2.setMouseCallback(img_path, click_event)

    print(f"\nClick the shot location in {img_path}")
    cv2.waitKey(0)
    cv2.destroyAllWindows()

print("\n----- FINAL RESULTS -----")
for r in results:
    print(r)