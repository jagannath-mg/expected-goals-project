import csv

shots = [
    ["shot_frame_280.png",1088,627,639.93,11.54],
    ["shot_frame_485.png",621,541,638.44,32.07],
    ["shot_frame_991.png",654,466,557.49,33.29],
    ["shot_frame_1522.png",1052,673,679.26,7.78],
    ["shot_frame_1532.jpg",266,173,181.23,17.34]
]

with open("shots_features.csv","w",newline="") as file:
    writer = csv.writer(file)

    writer.writerow(["image","x","y","distance","angle"])

    writer.writerows(shots)

print("CSV file created successfully")