import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const posColor = { GK: '#f59e0b', DF: '#3b82f6', MF: '#10b981', FW: '#ef4444' };

const DUMMY_PLAYER = {
  fullName: 'Erling Haaland', position: 'FW', shirtNumber: 9,
  photoUrl: '/player.webp', nationality: 'Norway',
  team: { name: 'Manchester City' },
  stats: { appearances: 28, goals: 22, assists: 5, minutes: 2240, shots: 98, foulsReceived: 34, yellowCards: 2, redCards: 0 },
  league: { matchesAsStarter: 24, matchesAsSub: 2, assists: 5, minutes: 2100, passes: 420 },
  ucl:    { matchesAsStarter: 8,  matchesAsSub: 0, assists: 2, minutes: 720,  passes: 140 },
  cup:    { matchesAsStarter: 2,  matchesAsSub: 1, assists: 0, minutes: 210,  passes: 40  },
};

const PlayerPage = () => {
  const { playerId } = useParams();
  const [player,     setPlayer]     = useState(null);
  const [season,     setSeason]     = useState('2025-2026');
  const [activeComp, setActiveComp] = useState('league');

  useEffect(() => { setPlayer(DUMMY_PLAYER); }, [playerId]);

  if (!player) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div className="skeleton" style={{ width: '200px', height: '20px' }} />
    </div>
  );

  const color     = posColor[player.position] || '#64748b';
  const compStats = player[activeComp] || {};

  const statBoxes = [
    { label: 'Appearances', value: player.stats.appearances },
    { label: 'Goals',        value: player.stats.goals       },
    { label: 'Assists',      value: player.stats.assists     },
    { label: 'Minutes',      value: player.stats.minutes     },
    { label: 'Shots',        value: player.stats.shots       },
    { label: 'Fouls Won',    value: player.stats.foulsReceived},
  ];

  const COMPS = [
    { key: 'league', label: 'League'           },
    { key: 'ucl',    label: 'Champions League' },
    { key: 'cup',    label: 'Cup'              },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/players" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
          color: '#64748b', textDecoration: 'none', fontSize: '0.85rem',
          padding: '0.4rem 0.8rem', borderRadius: '6px',
          background: '#161b26', border: '1px solid #252d3d',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          ← Squad
        </Link>
        <select value={season} onChange={e => setSeason(e.target.value)} style={{
          background: '#161b26', color: '#f1f5f9', border: '1px solid #252d3d',
          borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: 'pointer', outline: 'none',
        }}>
          <option value="2025-2026">2025–2026</option>
          <option value="2024-2025">2024–2025</option>
        </select>
      </div>

      {/* Hero */}
      <div style={{
        background: '#161b26', border: '1px solid #252d3d', borderRadius: '16px',
        overflow: 'hidden', marginBottom: '1.5rem',
        display: 'grid', gridTemplateColumns: '220px 1fr',
      }}>
        {/* Photo */}
        <div style={{ background: '#1e2535', position: 'relative', minHeight: '260px' }}>
          <div style={{
            position: 'absolute', bottom: '0.75rem', right: '0.75rem',
            fontSize: '4rem', fontWeight: 900, color: color, opacity: 0.2, lineHeight: 1,
          }}>{player.shirtNumber}</div>
          <img src={player.photoUrl} alt={player.fullName} style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top',
          }} />
        </div>
        {/* Info */}
        <div style={{ padding: '1.75rem 2rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            {player.position}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            {player.fullName}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {player.nationality} · {player.team?.name}
          </p>
          {/* Mini stats */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Goals',    value: player.stats.goals    },
              { label: 'Assists',  value: player.stats.assists  },
              { label: 'Apps',     value: player.stats.appearances},
              { label: 'Yellow',   value: player.stats.yellowCards},
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem', letterSpacing: '0.06em' }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full stats row */}
      <div style={{
        background: '#161b26', border: '1px solid #252d3d', borderRadius: '12px',
        padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem',
      }}>
        {statBoxes.map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center', padding: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '0.3rem', letterSpacing: '0.05em' }}>
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Competition tabs */}
      <div style={{
        display: 'flex', gap: '0.3rem',
        background: '#161b26', border: '1px solid #252d3d',
        borderRadius: '10px', padding: '0.25rem',
        marginBottom: '1.25rem', width: 'fit-content',
      }}>
        {COMPS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveComp(key)} style={{
            padding: '0.4rem 1rem', borderRadius: '7px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.85rem',
            background: activeComp === key ? color : 'transparent',
            color:      activeComp === key ? 'white'  : '#64748b',
            transition: 'all 0.2s',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Competition detail */}
      <div style={{
        background: '#161b26', border: '1px solid #252d3d',
        borderRadius: '12px', overflow: 'hidden',
      }}>
        {[
          ['Matches as Starter', compStats.matchesAsStarter ?? 0],
          ['Matches as Sub',     compStats.matchesAsSub     ?? 0],
          ['Assists',            compStats.assists           ?? 0],
          ['Minutes Played',     compStats.minutes          ?? 0],
          ['Passes',             compStats.passes            ?? 0],
        ].map(([label, value], i) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.85rem 1.5rem',
            borderBottom: i < 4 ? '1px solid #1e2535' : 'none',
            background: i % 2 === 0 ? 'transparent' : '#0d0f1430',
          }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{label}</span>
            <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerPage;
