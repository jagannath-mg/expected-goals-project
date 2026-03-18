'''
import cv2

cap = cv2.VideoCapture("shot.mp4")

if not cap.isOpened():
    print("Error opening video")
    exit()

paused = False

while True:
    # Get current frame position
    frame_pos = int(cap.get(cv2.CAP_PROP_POS_FRAMES))

    if not paused:
        ret, frame = cap.read()
        if not ret:
            break

    cv2.imshow("Video", frame)

    key = cv2.waitKey(0 if paused else 30) & 0xFF

    # SPACE → pause/resume
    if key == 32:
        paused = not paused

    # NEXT frame
    elif key == ord('n') and paused:
        ret, frame = cap.read()

    # PREVIOUS frame
    elif key == ord('b') and paused:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_pos - 2)
        ret, frame = cap.read()

    # SAVE frame
    elif key == ord('s'):
        filename = f"shot_frame_{frame_pos}.jpg"
        cv2.imwrite(filename, frame)
        print("Saved:", filename)

    # QUIT
    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
'''

import cv2

cap = cv2.VideoCapture("shot.mp4")

if not cap.isOpened():
    print("Error opening video")
    exit()

# Create a resizable window to avoid quality scaling
cv2.namedWindow("Video", cv2.WINDOW_NORMAL)

paused = False
frame = None

while True:
    # Get current frame position
    frame_pos = int(cap.get(cv2.CAP_PROP_POS_FRAMES))

    if not paused:
        ret, frame = cap.read()
        if not ret:
            break

    if frame is not None:
        cv2.imshow("Video", frame)

    key = cv2.waitKey(0 if paused else 30) & 0xFF

    # SPACE → pause / resume
    if key == 32:
        paused = not paused

    # NEXT frame
    elif key == ord('n') and paused:
        ret, frame = cap.read()

    # PREVIOUS frame
    elif key == ord('b') and paused:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_pos - 2)
        ret, frame = cap.read()

    # SAVE frame (lossless PNG)
    elif key == ord('s') and frame is not None:
        filename = f"shot_frame_{frame_pos}.png"
        cv2.imwrite(filename, frame)
        print("Saved:", filename)

    # QUIT
    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()