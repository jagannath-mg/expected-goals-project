import { useState, useRef, useCallback, useEffect } from 'react';

const API = 'http://127.0.0.1:5000';

const selectStyle = {
  width: '100%', padding: '0.6rem 0.9rem',
  background: '#161b26', color: '#f1f5f9',
  border: '1px solid #252d3d', borderRadius: '8px',
  fontSize: '0.9rem', cursor: 'pointer', outline: 'none',
};
const labelStyle = {
  fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8',
  marginBottom: '0.5rem', display: 'block',
};

const POINT_LABELS = ['⚽ Shot Location', '🥅 Left Post', '🥅 Right Post'];
const POINT_COLORS = ['#ef4444', '#10b981', '#3b82f6'];

export default function VideoXGPage() {
  const [videoURL, setVideoURL]       = useState(null);
  const [dragOver, setDragOver]       = useState(false);

  const [activeFrame, setActiveFrame] = useState(null);
  const [shots, setShots]             = useState([]);
  const [points, setPoints]           = useState([]);
  const [imgSize, setImgSize]         = useState({ w: 1, h: 1 });
  const [form, setForm]               = useState({
    body_part: 'Right Foot', shot_type: 'Open Play', under_pressure: 0,
  });
  const [predicting, setPredicting]   = useState(false);

  const [paused, setPaused]           = useState(true);
  const [framePos, setFramePos]       = useState(0);
  const [timestamp, setTimestamp]     = useState('00:00');
  const [fps, setFps]                 = useState(30);

  const videoRef     = useRef(null);
  const canvasRef    = useRef(null);
  const imgRef       = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!videoURL) return;

    const handleKey = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const video = videoRef.current;
      if (!video) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (activeFrame && !activeFrame.result) return;
        if (video.paused) { video.play(); setPaused(false); }
        else              { video.pause(); setPaused(true); }
      }

      if (e.code === 'ArrowRight' && !activeFrame) {
        e.preventDefault();
        video.pause(); setPaused(true);
        video.currentTime += 1 / fps;
      }

      if (e.code === 'ArrowLeft' && !activeFrame) {
        e.preventDefault();
        video.pause(); setPaused(true);
        video.currentTime = Math.max(0, video.currentTime - 1 / fps);
      }

      if (e.code === 'KeyS' && !activeFrame) {
        e.preventDefault();
        captureFrame();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [videoURL, fps, activeFrame]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const fn = () => {
      setFramePos(Math.round(video.currentTime * fps));
      const m = Math.floor(video.currentTime / 60);
      const s = Math.floor(video.currentTime % 60);
      setTimestamp(`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    video.addEventListener('timeupdate', fn);
    return () => video.removeEventListener('timeupdate', fn);
  }, [fps]);

  const onVideoLoaded = () => setFps(30);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('video/')) {
      alert('Please upload a valid video file'); return;
    }
    setVideoURL(URL.createObjectURL(file));
    setShots([]); setActiveFrame(null);
    setPoints([]); setFramePos(0); setTimestamp('00:00');
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const captureFrame = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    video.pause(); setPaused(true);

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const m = Math.floor(video.currentTime / 60);
    const s = Math.floor(video.currentTime % 60);

    setActiveFrame({
      id:      Date.now(),
      dataURL: canvas.toDataURL('image/jpeg', 0.92),
      label:   `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`,
      frame:   Math.round(video.currentTime * fps),
      result:  null,
    });
    setPoints([]);
    setForm({ body_part: 'Right Foot', shot_type: 'Open Play', under_pressure: 0 });
    setImgSize({ w: 1, h: 1 });
  };

  const handleImageClick = useCallback((e) => {
    if (!activeFrame || activeFrame.result) return;
    if (points.length >= 3) return;
    const rect   = imgRef.current.getBoundingClientRect();
    const scaleX = imgSize.w / rect.width;
    const scaleY = imgSize.h / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top)  * scaleY;
    setPoints(prev => [...prev, { x: Math.round(px), y: Math.round(py) }]);
  }, [activeFrame, points, imgSize]);

  const predict = async () => {
    setPredicting(true);
    try {
      const res = await fetch(`${API}/video/predict-frame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          point1: points[0], point2: points[1], point3: points[2], ...form,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const completed = { ...activeFrame, points, form, result: data };
      setActiveFrame(completed);
      setShots(prev => [...prev, completed]);
    } catch (e) {
      alert(`Prediction failed: ${e.message}`);
    }
    setPredicting(false);
  };

  const continueVideo = () => {
    setActiveFrame(null);
    setPoints([]);
    videoRef.current?.play();
    setPaused(false);
  };

  const discardFrame = () => {
    setActiveFrame(null);
    setPoints([]);
    videoRef.current?.play();
    setPaused(false);
  };

  const resetAll = () => {
    setVideoURL(null); setShots([]);
    setActiveFrame(null); setPoints([]);
    setFramePos(0); setTimestamp('00:00');
  };

  const xgColor = (xg) =>
    xg >= 0.3 ? '#10b981' : xg >= 0.1 ? '#f59e0b' : '#ef4444';

  return (
    <div className="page-enter" style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            COMPUTER VISION • FRAME CAPTURE • LOGISTIC REGRESSION
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Video xG Analysis
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            {!videoURL
              ? 'Upload a match video to get started'
              : activeFrame && !activeFrame.result
              ? '👆 Mark 3 points on the frame'
              : activeFrame && activeFrame.result
              ? '✅ xG calculated — continue video for next shot'
              : `${shots.length} shot${shots.length !== 1 ? 's' : ''} captured · Press S to capture a shot frame`}
          </p>
        </div>
        {videoURL && (
          <button onClick={resetAll} style={{
            padding: '0.5rem 1rem', borderRadius: '8px',
            border: '1px solid #252d3d', background: 'transparent',
            color: '#64748b', fontSize: '0.8rem', cursor: 'pointer',
          }}>✕ New Video</button>
        )}
      </div>

      {/* ── UPLOAD ── */}
      {!videoURL && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current.click()}
          style={{
            background: dragOver ? '#1e2535' : '#161b26',
            border: `2px dashed ${dragOver ? '#a855f7' : '#252d3d'}`,
            borderRadius: '16px', padding: '5rem 2rem',
            textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          <input ref={fileInputRef} type="file" accept="video/*"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎬</div>
          <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Drop your video here or click to browse
          </div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Supports MP4, MOV, AVI</div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* ── VIDEO PLAYER ── */}
      {videoURL && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div style={{
            background: '#161b26', border: '1px solid #252d3d',
            borderRadius: '16px', overflow: 'hidden',
            display: activeFrame ? 'none' : 'block',
          }}>
            <video
              ref={videoRef}
              src={videoURL}
              onLoadedMetadata={onVideoLoaded}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              style={{ width: '100%', display: 'block', maxHeight: '460px', background: '#000' }}
            />
            <div style={{
              padding: '0.75rem 1.25rem', background: '#0d0f14',
              borderTop: '1px solid #252d3d',
              display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
            }}>
              <div style={{
                fontFamily: 'monospace', fontSize: '0.85rem',
                color: '#a855f7', fontWeight: 700,
                background: '#1e2535', padding: '0.3rem 0.75rem',
                borderRadius: '6px', border: '1px solid #252d3d',
                minWidth: '160px',
              }}>
                Frame: {framePos} &nbsp;|&nbsp; {timestamp}
              </div>

              <div style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: paused ? '#f59e0b' : '#10b981',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: paused ? '#f59e0b' : '#10b981', display: 'inline-block',
                }} />
                {paused ? 'PAUSED' : 'PLAYING'}
              </div>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { key: 'Space', label: paused ? '▶ Play' : '⏸ Pause' },
                  { key: '←',    label: 'Prev frame' },
                  { key: '→',    label: 'Next frame' },
                  { key: 'S',    label: '📸 Capture shot' },
                ].map(({ key, label }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <kbd style={{
                      padding: '0.15rem 0.45rem', borderRadius: '4px',
                      background: '#1e2535', border: '1px solid #334155',
                      fontSize: '0.72rem', color: '#94a3b8',
                      fontFamily: 'monospace', fontWeight: 700,
                    }}>{key}</kbd>
                    <span style={{ fontSize: '0.72rem', color: '#475569' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── ACTIVE FRAME ── */}
          {activeFrame && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div style={{
                background: '#161b26', border: '1px solid #252d3d',
                borderRadius: '16px', padding: '1rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    fontFamily: 'monospace', fontSize: '0.85rem', color: '#a855f7', fontWeight: 700,
                    background: '#1e2535', padding: '0.3rem 0.75rem',
                    borderRadius: '6px', border: '1px solid #252d3d',
                  }}>
                    Frame: {activeFrame.frame} &nbsp;|&nbsp; {activeFrame.label}
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Shot #{shots.length + (activeFrame.result ? 0 : 1)}
                  </span>
                </div>
                {!activeFrame.result && (
                  <button onClick={discardFrame} style={{
                    padding: '0.3rem 0.9rem', borderRadius: '6px',
                    border: '1px solid #252d3d', background: 'transparent',
                    color: '#64748b', fontSize: '0.8rem', cursor: 'pointer',
                  }}>✕ Discard</button>
                )}
              </div>

              <div style={{ background: '#161b26', border: '1px solid #252d3d', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {POINT_LABELS.map((label, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.3rem 0.75rem', borderRadius: '999px',
                      background: points.length > i ? `${POINT_COLORS[i]}20` : '#1e2535',
                      border: `1px solid ${points.length > i ? POINT_COLORS[i] : '#252d3d'}`,
                      fontSize: '0.78rem', fontWeight: 600,
                      color: points.length > i ? POINT_COLORS[i] : '#64748b',
                      transition: 'all 0.2s ease',
                    }}>
                      <span>{points.length > i ? '✓' : `${i + 1}`}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                  {points.length < 3 && !activeFrame.result && (
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      👆 Click point {points.length + 1}
                    </span>
                  )}
                  {points.length > 0 && !activeFrame.result && (
                    <button onClick={() => setPoints([])} style={{
                      marginLeft: 'auto', padding: '0.3rem 0.75rem', borderRadius: '999px',
                      border: '1px solid #ef444440', background: '#ef444410',
                      color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                    }}>↺ Reset</button>
                  )}
                </div>

                <div style={{
                  position: 'relative', display: 'inline-block', width: '100%',
                  cursor: points.length < 3 && !activeFrame.result ? 'crosshair' : 'default',
                }}>
                  <img
                    ref={imgRef}
                    src={activeFrame.dataURL}
                    alt="Shot frame"
                    onClick={handleImageClick}
                    onLoad={e => setImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
                    style={{ width: '100%', borderRadius: '8px', display: 'block' }}
                  />
                  <svg style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', pointerEvents: 'none',
                  }}>
                    {points.length >= 2 && (
                      <line
                        x1={`${(points[1].x / imgSize.w) * 100}%`}
                        y1={`${(points[1].y / imgSize.h) * 100}%`}
                        x2={points.length >= 3 ? `${(points[2].x / imgSize.w) * 100}%` : `${(points[1].x / imgSize.w) * 100}%`}
                        y2={points.length >= 3 ? `${(points[2].y / imgSize.h) * 100}%` : `${(points[1].y / imgSize.h) * 100}%`}
                        stroke="white" strokeWidth="2" strokeDasharray="4 2" opacity="0.7"
                      />
                    )}
                    {points.length === 3 && (
                      <line
                        x1={`${(points[0].x / imgSize.w) * 100}%`}
                        y1={`${(points[0].y / imgSize.h) * 100}%`}
                        x2={`${(((points[1].x + points[2].x) / 2) / imgSize.w) * 100}%`}
                        y2={`${(((points[1].y + points[2].y) / 2) / imgSize.h) * 100}%`}
                        stroke="#a855f7" strokeWidth="2" strokeDasharray="6 3" opacity="0.85"
                      />
                    )}
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle
                          cx={`${(p.x / imgSize.w) * 100}%`}
                          cy={`${(p.y / imgSize.h) * 100}%`}
                          r="10" fill={POINT_COLORS[i]} opacity="0.9"
                        />
                        <text
                          x={`${(p.x / imgSize.w) * 100}%`}
                          y={`${(p.y / imgSize.h) * 100}%`}
                          textAnchor="middle" dominantBaseline="central"
                          fontSize="10" fontWeight="bold" fill="white"
                        >{i + 1}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {points.length === 3 && !activeFrame.result && (
                <div style={{ background: '#161b26', border: '1px solid #252d3d', borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ marginBottom: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}>Shot Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={labelStyle}>Body Part</label>
                      <select value={form.body_part}
                        onChange={e => setForm(f => ({ ...f, body_part: e.target.value }))}
                        style={selectStyle}>
                        {['Right Foot', 'Left Foot', 'Head', 'Other'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Shot Type</label>
                      <select value={form.shot_type}
                        onChange={e => setForm(f => ({ ...f, shot_type: e.target.value }))}
                        style={selectStyle}>
                        {['Open Play', 'Penalty', 'Free Kick'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.4rem' }}>
                      <input type="checkbox" id="vid-pressure"
                        checked={form.under_pressure === 1}
                        onChange={e => setForm(f => ({ ...f, under_pressure: e.target.checked ? 1 : 0 }))}
                        style={{ width: '16px', height: '16px', accentColor: '#a855f7', cursor: 'pointer' }}
                      />
                      <label htmlFor="vid-pressure" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8', cursor: 'pointer' }}>
                        Under Pressure
                      </label>
                    </div>
                  </div>
                  <button onClick={predict} disabled={predicting} style={{
                    width: '100%', padding: '0.9rem', borderRadius: '10px', border: 'none',
                    background: predicting ? '#1e2535' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    color: predicting ? '#64748b' : 'white',
                    fontWeight: 700, fontSize: '1rem',
                    cursor: predicting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: predicting ? 'none' : '0 8px 24px rgba(168,85,247,0.3)',
                  }}>
                    {predicting ? '⏳ Predicting...' : '🎯 Predict xG'}
                  </button>
                </div>
              )}

              {activeFrame.result && (
                <div style={{
                  background: '#161b26',
                  border: `1px solid ${xgColor(activeFrame.result.xg)}40`,
                  borderRadius: '16px', padding: '1.75rem 2rem',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
                      PREDICTED xG — Shot #{shots.length}
                    </div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: xgColor(activeFrame.result.xg), lineHeight: 1, letterSpacing: '-0.03em' }}>
                      {activeFrame.result.xg.toFixed(4)}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                      Likelihood of this shot being a goal
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        📏 <strong style={{ color: '#f1f5f9' }}>{activeFrame.result.distance_meters}m</strong>
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        📐 <strong style={{ color: '#f1f5f9' }}>{activeFrame.result.angle_deg}°</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{
                    width: '90px', height: '90px', borderRadius: '50%',
                    background: `conic-gradient(${xgColor(activeFrame.result.xg)} ${activeFrame.result.xg * 360}deg, #1e2535 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '68px', height: '68px', borderRadius: '50%', background: '#161b26',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 800, color: xgColor(activeFrame.result.xg),
                    }}>
                      {(activeFrame.result.xg * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div style={{ width: '100%' }}>
                    <button onClick={continueVideo} style={{
                      padding: '0.75rem 2rem', borderRadius: '10px', border: 'none',
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      color: 'white', fontWeight: 700, fontSize: '1rem',
                      cursor: 'pointer', boxShadow: '0 6px 20px rgba(168,85,247,0.3)',
                    }}>
                      ▶ Continue Video
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SUMMARY TABLE ── */}
          {shots.length > 0 && !activeFrame && (
            <div style={{ background: '#161b26', border: '1px solid #252d3d', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', fontSize: '1rem' }}>
                📊 Shot Summary
                <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                  {shots.length} shot{shots.length !== 1 ? 's' : ''} analysed
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #252d3d' }}>
                    {['Shot', 'Frame', 'Time', 'Distance', 'Angle', 'Body Part', 'Type', 'Pressure', 'xG'].map(h => (
                      <th key={h} style={{ padding: '0.5rem 0.75rem', color: '#64748b', fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shots.map((shot, idx) => (
                    <tr key={shot.id} style={{
                      borderBottom: '1px solid #1e2535',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e2535'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={shot.dataURL} alt=""
                            style={{ width: '48px', height: '27px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #252d3d' }}
                          />
                          <span style={{ color: '#94a3b8', fontWeight: 600 }}>#{idx + 1}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#64748b', fontFamily: 'monospace', fontSize: '0.8rem' }}>f{shot.frame}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f1f5f9' }}>{shot.label}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f1f5f9' }}>{shot.result.distance_meters}m</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f1f5f9' }}>{shot.result.angle_deg}°</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f1f5f9' }}>{shot.form.body_part}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f1f5f9' }}>{shot.form.shot_type}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: shot.form.under_pressure ? '#f59e0b' : '#475569', fontWeight: 600 }}>
                        {shot.form.under_pressure ? 'Yes' : 'No'}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: xgColor(shot.result.xg) }}>
                        {shot.result.xg.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {shots.length > 1 && (
                  <tfoot>
                    <tr style={{ borderTop: '1px solid #252d3d' }}>
                      <td colSpan={8} style={{ padding: '0.6rem 0.75rem', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>
                        Total xG
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 900, fontSize: '1rem', color: '#a855f7' }}>
                        {shots.reduce((s, c) => s + c.result.xg, 0).toFixed(3)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
