import { useState } from "react";

export default function XGCalculator() {
  const [distance, setDistance] = useState("");
  const [angle, setAngle] = useState("");
  const [result, setResult] = useState(null);

  const calculateXG = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          distance: Number(distance),
          angle: Number(angle),
        }),
      });

      const data = await response.json();
      setResult(data.xg);
    } catch (err) {
      console.error(err);
      alert("Backend connection failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>xG Calculator</h2>

      <input
        placeholder="Shot Distance"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />

      <input
        placeholder="Shot Angle"
        value={angle}
        onChange={(e) => setAngle(e.target.value)}
      />

      <button onClick={calculateXG}>
        Predict xG
      </button>

      {result !== null && (
        <h3>Predicted xG: {result}</h3>
      )}
    </div>
  );
}