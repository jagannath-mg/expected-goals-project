import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

const API = 'http://localhost:5000';

const leagueAccent = { epl: '#3b82f6', laliga: '#ef4444', bundesliga: '#f59e0b' };

/* ── Shot Map ───────────────────────────────────────── */
const ShotMap = ({ shots, label, color, pitchW = 480, pitchH = 320 }) => (
  <div style={{ flex: 1, minWidth: 280 }}>
    <div style={{ fontSize: '0.85rem', fontWeight: 700, color, marginBottom: '0.5rem', textAlign: 'center' }}>{label}</div>
    <svg width="100%" viewBox={`0 0 ${pitchW} ${pitchH}`}
      style={{ borderRadius: 10, border: '1px solid #252d3d', display: 'block' }}>
      {/* Pitch */}
      <rect width={pitchW} height={pitchH} fill="#0d2e22" rx={10} />
      <rect x={pitchW*0.04} y={pitchH*0.05} width={pitchW*0.92} height={pitchH*0.9} fill="none" stroke="#1a4a30" strokeWidth={1.5} rx={4} />
      <line x1={pitchW/2} y1={pitchH*0.05} x2={pitchW/2} y2={pitchH*0.95} stroke="#1a4a30" strokeWidth={1} />
      <circle cx={pitchW/2} cy={pitchH/2} r={pitchH*0.12} fill="none" stroke="#1a4a30" strokeWidth={1} />
      {/* Penalty boxes */}
      <rect x={0} y={pitchH*0.22} width={pitchW*0.14} height={pitchH*0.56} fill="none" stroke="#1a4a30" strokeWidth={1} />
      <rect x={pitchW*0.86} y={pitchH*0.22} width={pitchW*0.14} height={pitchH*0.56} fill="none" stroke="#1a4a30" strokeWidth={1} />
      {/* Goals */}
      <rect x={0} y={pitchH*0.39} width={5} height={pitchH*0.22} fill="none" stroke="#4ade80" strokeWidth={2} />
      <rect x={pitchW-5} y={pitchH*0.39} width={5} height={pitchH*0.22} fill="none" stroke="#4ade80" strokeWidth={2} />
      {/* Shots */}
      {shots.map((s, i) => {
        const cx = (s.x / 120) * pitchW;
        const cy = (s.y / 80) * pitchH;
        const r  = 4 + s.model_xg * 18;
        const c  = s.is_goal ? '#10b981' : s.model_xg > 0.3 ? '#f59e0b' : '#3b82f6';
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill={c} fillOpacity={0.75} stroke="white" strokeWidth={0.8}>
            <title>{s.player} | xG: {s.model_xg} | {s.outcome}</title>
          </circle>
        );
      })}
    </svg>
    {/* Legend */}
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.6rem', fontSize: '0.72rem', color: '#64748b' }}>
      <span><span style={{ color: '#10b981' }}>●</span> Goal</span>
      <span><span style={{ color: '#f59e0b' }}>●</span> xG &gt; 0.3</span>
      <span><span style={{ color: '#3b82f6' }}>●</span> Low xG</span>
      <span>Size = xG</span>
    </div>
  </div>
);

/* ── Shot Table ─────────────────────────────────────── */
const ShotTable = ({ shots, label, color }) => {
  const th = { padding: '0.55rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' };
  const td = { padding: '0.55rem 0.75rem', fontSize: '0.85rem', color: '#f1f5f9' };

  return (
    <div style={{ flex: 1, minWidth: 280 }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color, marginBottom: '0.6rem' }}>{label}</div>
      <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #252d3d' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ background: '#161b26' }}>
            <tr>
              <th style={th}>Min</th>
              <th style={th}>Player</th>
              <th style={th}>Body</th>
              <th style={th}>Model xG</th>
              <th style={th}>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {shots.map((s, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#0d0f14' : '#161b26', borderTop: '1px solid #1e2535' }}>
                <td style={{ ...td, color: '#64748b' }}>{s.minute}'</td>
                <td style={td}>{s.player}</td>
                <td style={{ ...td, color: '#94a3b8' }}>{s.body_part}</td>
                <td style={{ ...td, fontWeight: 700,
                  color: s.model_xg > 0.3 ? '#f59e0b' : s.model_xg > 0.15 ? '#10b981' : '#64748b'
                }}>{s.model_xg}</td>
                <td style={{ ...td, fontWeight: s.is_goal ? 700 : 400, color: s.is_goal ? '#10b981' : '#475569' }}>
                  {s.is_goal ? '⚽ Goal' : s.outcome}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── xG Bar ─────────────────────────────────────────── */
const XGBar = ({ homeXg, awayXg, homeTeam, awayTeam, accent }) => {
  const total = homeXg + awayXg || 1;
  const homePct = (homeXg / total) * 100;

  return (
    <div style={{
      background: '#161b26', border: '1px solid #252d3d', borderRadius: '12px',
      padding: '1.25rem 1.5rem', marginBottom: '1.5rem'
    }}>
      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em', textAlign: 'center', marginBottom: '0.75rem' }}>
        EXPECTED GOALS (MODEL)
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{ fontWeight: 800, fontSize: '2rem', color: accent }}>{homeXg}</span>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>xG</span>
        <span style={{ fontWeight: 800, fontSize: '2rem', color: '#f59e0b' }}>{awayXg}</span>
      </div>
      {/* Bar */}
      <div style={{ height: '6px', background: '#1e2535', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${homePct}%`, background: accent, borderRadius: '3px', transition: 'width 0.8s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{homeTeam}</span>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{awayTeam}</span>
      </div>
    </div>
  );
};

/* ── Skeleton ───────────────────────────────────────── */
const MatchSkeleton = () => (
  <div>
    <div className="skeleton" style={{ height: '90px', borderRadius: '12px', marginBottom: '1rem' }} />
    <div className="skeleton" style={{ height: '60px', borderRadius: '10px', marginBottom: '0.5rem' }} />
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
      <div className="skeleton" style={{ flex: 1, height: '300px', borderRadius: '10px' }} />
      <div className="skeleton" style={{ flex: 1, height: '300px', borderRadius: '10px' }} />
    </div>
  </div>
);

/* ── Main Component ─────────────────────────────────── */
const MatchDetails = () => {
  const { league, match_id } = useParams();
  const location = useLocation();
  const fixture  = location.state;
  const season_id = fixture?.season_id;
  const accent    = leagueAccent[league] || '#3b82f6';

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tab,     setTab]     = useState('table');

  useEffect(() => {
    if (!season_id) { setError('Season ID missing — go back and select a match.'); setLoading(false); return; }
    fetch(`${API}/league/${league}/match/${match_id}?season_id=${season_id}`)
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [league, match_id, season_id]);

  return (
    <div className="page-enter" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Back */}
      <Link to={`/${league}/fixtures`} style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        color: '#64748b', textDecoration: 'none', fontSize: '0.85rem',
        padding: '0.4rem 0.8rem', borderRadius: '6px',
        background: '#161b26', border: '1px solid #252d3d',
        marginBottom: '1.5rem',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
      onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
      >
        ← Fixtures
      </Link>

      {/* Match header */}
      {fixture && (
        <div style={{
          background: '#161b26', border: '1px solid #252d3d', borderRadius: '14px',
          padding: '1.5rem 2rem', marginBottom: '1.5rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.06em' }}>
            {fixture.date} • MATCHWEEK {fixture.matchweek}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', flex: 1, textAlign: 'right', minWidth: 120 }}>
              {fixture.home}
            </span>
            <div style={{
              background: '#0d0f14', border: '1px solid #252d3d',
              padding: '0.5rem 1.25rem', borderRadius: '10px',
              fontSize: '1.8rem', fontWeight: 900, color: '#10b981', letterSpacing: '0.05em'
            }}>
              {fixture.home_score} – {fixture.away_score}
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', flex: 1, minWidth: 120 }}>
              {fixture.away}
            </span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div>
          <div style={{
            background: '#161b26', border: '1px solid #252d3d', borderRadius: '12px',
            padding: '2rem', textAlign: 'center', marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⚽</div>
            <div style={{ color: '#94a3b8', fontWeight: 600, marginBottom: '0.3rem' }}>Calculating xG for all shots...</div>
            <div style={{ color: '#475569', fontSize: '0.8rem' }}>Running your ML model on every shot. First load ~15–30s.</div>
          </div>
          <MatchSkeleton />
        </div>
      )}

      {error && (
        <div style={{
          background: '#1e2535', border: '1px solid #ef444440', borderRadius: '10px',
          padding: '1rem 1.25rem', color: '#ef4444', fontSize: '0.9rem'
        }}>❌ {error}</div>
      )}

      {data && (
        <>
          {/* xG Bar */}
          <XGBar
            homeXg={data.home_xg} awayXg={data.away_xg}
            homeTeam={data.home_team} awayTeam={data.away_team}
            accent={accent}
          />

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '0.4rem', marginBottom: '1.5rem',
            background: '#161b26', border: '1px solid #252d3d',
            borderRadius: '10px', padding: '0.3rem', width: 'fit-content'
          }}>
            {[['table', '📋 Shot Table'], ['map', '🗺️ Shot Map']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding: '0.45rem 1.1rem', borderRadius: '7px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: tab === key ? accent : 'transparent',
                color:      tab === key ? 'white' : '#64748b',
                transition: 'all 0.2s ease',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {tab === 'table' && (
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <ShotTable shots={data.home_shots} label={data.home_team} color={accent} />
              <ShotTable shots={data.away_shots} label={data.away_team} color="#f59e0b" />
            </div>
          )}
          {tab === 'map' && (
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <ShotMap shots={data.home_shots} label={data.home_team} color={accent} />
              <ShotMap shots={data.away_shots} label={data.away_team} color="#f59e0b" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MatchDetails;
