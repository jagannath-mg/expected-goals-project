import { useState } from 'react';

export default function XGCalculator() {
  const [form, setForm] = useState({
    minute: 34, x: 102, y: 40,
    distance_to_goal: 12.5, angle_to_goal: 45,
    body_part: 'Right Foot', shot_type: 'Open Play', under_pressure: 1,
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calculateXG = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, minute: Number(form.minute), x: Number(form.x),
          y: Number(form.y), distance_to_goal: Number(form.distance_to_goal),
          angle_to_goal: Number(form.angle_to_goal), under_pressure: Number(form.under_pressure),
        }),
      });
      setResult(await res.json());
    } catch {
      alert('Backend not reachable — is server.py running on port 5000?');
    }
    setLoading(false);
  };

  const sliders = [
    { key: 'minute',           label: 'Minute',            hint: '0 – 90',         min: 0,   max: 90,  step: 1,   unit: '' },
    { key: 'x',                label: 'X Position',        hint: 'Goal is at 120', min: 0,   max: 120, step: 1,   unit: '' },
    { key: 'y',                label: 'Y Position',        hint: 'Centre is 40',   min: 0,   max: 80,  step: 1,   unit: '' },
    { key: 'distance_to_goal', label: 'Distance to Goal',  hint: 'metres',         min: 0,   max: 50,  step: 0.5, unit: 'm' },
    { key: 'angle_to_goal',    label: 'Angle to Goal',     hint: 'degrees',        min: 0,   max: 180, step: 1,   unit: '°' },
  ];

  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' };
  const selectStyle = {
    width: '100%', padding: '0.6rem 0.9rem',
    background: '#161b26', color: '#f1f5f9',
    border: '1px solid #252d3d', borderRadius: '8px',
    fontSize: '0.9rem', cursor: 'pointer', outline: 'none',
  };
  const xgColor = result
    ? result.xg >= 0.3 ? '#10b981' : result.xg >= 0.1 ? '#f59e0b' : '#ef4444'
    : '#3b82f6';

  return (
    <div className="page-enter" style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
          ML MODEL • AUC 0.75 • LOGLOSS 0.31
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          xG Calculator
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.3rem' }}>
          Adjust shot parameters to predict Expected Goals
        </p>
      </div>

      <div style={{
        background: '#161b26', border: '1px solid #252d3d',
        borderRadius: '16px', padding: '2rem',
      }}>
        {/* Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {sliders.map(({ key, label, hint, min, max, step, unit }) => (
            <div key={key}>
              <div style={labelStyle}>
                <span>{label} <span style={{ color: '#475569', fontWeight: 400 }}>({hint})</span></span>
                <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{form[key]}{unit}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={form[key]}
                onChange={e => set(key, e.target.value)}
                style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>

        {/* Dropdowns + checkbox */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={labelStyle}><span>Body Part</span></div>
            <select value={form.body_part} onChange={e => set('body_part', e.target.value)} style={selectStyle}>
              {['Right Foot', 'Left Foot', 'Head', 'Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div style={labelStyle}><span>Shot Type</span></div>
            <select value={form.shot_type} onChange={e => set('shot_type', e.target.value)} style={selectStyle}>
              {['Open Play', 'Penalty', 'Free Kick'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.4rem' }}>
            <input type="checkbox" id="pressure" checked={form.under_pressure === 1}
              onChange={e => set('under_pressure', e.target.checked ? 1 : 0)}
              style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }}
            />
            <label htmlFor="pressure" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8', cursor: 'pointer' }}>
              Under Pressure
            </label>
          </div>
        </div>

        {/* Predict button */}
        <button onClick={calculateXG} disabled={loading} style={{
          width: '100%', padding: '0.9rem', borderRadius: '10px', border: 'none',
          background: loading ? '#1e2535' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          color: loading ? '#64748b' : 'white', fontWeight: 700, fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: loading ? 'none' : '0 8px 24px rgba(59,130,246,0.3)',
        }}>
          {loading ? '⏳ Calculating...' : 'Predict xG'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{
          marginTop: '1.25rem', background: '#161b26',
          border: `1px solid ${xgColor}40`, borderRadius: '16px', padding: '1.75rem 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
              PREDICTED xG
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: xgColor, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {result.xg.toFixed(4)}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              Likelihood of this shot being a goal
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: `conic-gradient(${xgColor} ${result.xg * 360}deg, #1e2535 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', background: '#161b26',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800, color: xgColor,
              }}>
                {(result.xg * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          {result.reasons?.length > 0 && (
            <div style={{
              width: '100%', background: '#1e2535', borderRadius: '8px',
              padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8',
            }}>
              📉 Low xG due to: <strong style={{ color: '#f1f5f9' }}>{result.reasons.join(', ')}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
