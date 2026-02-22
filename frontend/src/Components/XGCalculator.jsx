import { useState } from "react";

// Updated styles to handle the extra slider
const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .xg-app-container { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    min-height: 100vh; padding: 20px; display: flex; flex-direction: column; align-items: center;
  }
  .xg-header { text-align: center; margin-bottom: 40px; color: white; }
  .xg-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 8px; text-shadow: 0 4px 8px rgba(0,0,0,0.3); }
  .xg-header p { font-size: 1.1rem; opacity: 0.9; font-weight: 500; }
  .xg-container { 
    background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 24px; 
    padding: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); max-width: 800px; width: 100%; 
    border: 1px solid rgba(255,255,255,0.2);
  }
  .xg-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px; }
  .input-group { display: flex; flex-direction: column; gap: 8px; }
  .input-group label { font-weight: 600; color: #2d3748; font-size: 0.95rem; display: flex; align-items: center; gap: 6px; }
  .input-group label span { font-size: 0.85rem; color: #718096; font-weight: 500; }
  .input-group input[type="range"] { width: 100%; height: 8px; border-radius: 10px; background: #e2e8f0; outline: none; }
  .input-group select { width: 100%; padding: 14px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; background: white; }
  .predict-btn { 
    width: 100%; padding: 18px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
    color: white; border: none; border-radius: 16px; font-size: 1.2rem; font-weight: 700; 
    cursor: pointer; box-shadow: 0 10px 30px rgba(102,126,234,0.4);
  }
  .result-card { 
    padding: 32px; border-radius: 20px; text-align: center; margin-top: 20px;
  }
  .low-xg-card { 
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%); color: white; 
  }
  .high-xg-card { 
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; 
  }
  .reasons { 
    margin-top: 16px; font-size: 1.1rem; font-weight: 600; 
    background: rgba(255,255,255,0.2); padding: 12px; border-radius: 12px;
  }
`;

export default function XGCalculator() {
  const [form, setForm] = useState({
    minute: 34, 
    x: 102, 
    y: 40,
    distance_to_goal: 12.5, 
    angle_to_goal: 0.8,
    body_part: "Right Foot", 
    shot_type: "Open Play", 
    under_pressure: 1
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateXG = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          minute: Number(form.minute), 
          x: Number(form.x), 
          y: Number(form.y), 
          distance_to_goal: Number(form.distance_to_goal), 
          angle_to_goal: Number(form.angle_to_goal),
          under_pressure: Number(form.under_pressure)
        }),
      });
      const data = await response.json();
      setResult(data);  // Now {xg, reasons}
    } catch (err) {
      alert("Backend connection failed - Is server.py running on port 5000?");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="xg-app-container">
        <header className="xg-header">
          <h1>⚽ Advanced xG Calculator</h1>
          <p>AUC 0.75 | LogLoss 0.31 | Powered by XGBoost</p>
        </header>

        <div className="xg-container">
          <div className="xg-grid">
            {/* Minute Slider */}
            <div className="input-group">
              <label>Minute <span>(0-90)</span></label>
              <input type="range" min="0" max="90" value={form.minute} onChange={e => setForm({...form, minute: e.target.value})} />
              <span>{form.minute}</span>
            </div>

            {/* X Position Slider */}
            <div className="input-group">
              <label>X Position <span>(Goal is at 120)</span></label>
              <input type="range" min="0" max="120" value={form.x} onChange={e => setForm({...form, x: e.target.value})} />
              <span>{form.x}</span>
            </div>

            {/* Y Position Slider */}
            <div className="input-group">
              <label>Y Position <span>(Center is 40)</span></label>
              <input type="range" min="0" max="80" value={form.y} onChange={e => setForm({...form, y: e.target.value})} />
              <span>{form.y}</span>
            </div>

            {/* Distance Slider */}
            <div className="input-group">
              <label>Distance to Goal (m)</label>
              <input type="range" min="0" max="50" step="0.5" value={form.distance_to_goal} onChange={e => setForm({...form, distance_to_goal: e.target.value})} />
              <span>{form.distance_to_goal}m</span>
            </div>

            {/* Angle Slider */}
            <div className="input-group">
              <label>Angle to Goal <span>(0-1)</span></label>
              <input type="range" min="0" max="1" step="0.01" value={form.angle_to_goal} onChange={e => setForm({...form, angle_to_goal: e.target.value})} />
              <span>{(form.angle_to_goal * 100).toFixed(0)}%</span>
            </div>

            {/* Body Part Dropdown */}
            <div className="input-group">
              <label>Body Part</label>
              <select value={form.body_part} onChange={e => setForm({...form, body_part: e.target.value})}>
                <option>Right Foot</option>
                <option>Left Foot</option>
                <option>Head</option>
                <option>Other</option>
              </select>
            </div>

            {/* Shot Type Dropdown */}
            <div className="input-group">
              <label>Shot Type</label>
              <select value={form.shot_type} onChange={e => setForm({...form, shot_type: e.target.value})}>
                <option>Open Play</option>
                <option>Penalty</option>
                <option>Free Kick</option>
              </select>
            </div>

            {/* Pressure Checkbox */}
            <div className="input-group checkbox" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
              <label>Under Pressure</label>
              <input type="checkbox" checked={form.under_pressure === 1} onChange={e => setForm({...form, under_pressure: e.target.checked ? 1 : 0})} />
            </div>
          </div>

          <button className="predict-btn" onClick={calculateXG} disabled={loading}>
            {loading ? "Calculating..." : "Predict xG"}
          </button>

          {result && (
            <div className={`result-card ${result.xg < 0.1 ? 'low-xg-card' : 'high-xg-card'}`}>
              <h2>🎯 Predicted xG: <span>{result.xg.toFixed(4)}</span></h2>
              <p>Likelihood of this shot being a goal</p>
              {result.reasons && result.reasons.length > 0 && (
                <div className="reasons">
                  📉 Low xG due to: <strong>{result.reasons.join(', ')}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
