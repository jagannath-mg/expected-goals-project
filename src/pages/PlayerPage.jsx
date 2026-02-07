// src/pages/PlayerPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PlayerPage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [season, setSeason] = useState('2025-2026');
  const [activeComp, setActiveComp] = useState('league');

  useEffect(() => {
    // TEMP: dummy player data with stats
    setPlayer({
      _id: playerId,
      fullName: 'MARCUS BETTINELLI',
      position: 'GK',
      shirtNumber: 13,
      photoUrl: '/player.webp',
      nationality: 'England',
      team: { name: 'Manchester City' },
      stats: {
        // global stats
        matches: 24,
        goals: 0,
        assists: 0,
        minutes: 2107,
        shots: 12,
        foulsReceived: 8,
        appearances: 28,
        yellowCards: 2,
        redCards: 0,
      },
      // competition-specific stats
      league: {
        matches: 18,
        assists: 0,
        minutes: 1576,
        passes: 606,
        matchesAsStarter: 15,
        matchesAsSub: 3,
      },
      ucl: {
        matches: 4,
        assists: 0,
        minutes: 350,
        passes: 210,
        matchesAsStarter: 4,
        matchesAsSub: 0,
      },
      cup: {
        matches: 2,
        assists: 0,
        minutes: 181,
        passes: 90,
        matchesAsStarter: 1,
        matchesAsSub: 1,
      },
    });
  }, [playerId]);

  if (!player) return <div>Loading player...</div>;

  const globalStats = {
    matches: player.stats?.matches ?? 24,
    goals: player.stats?.goals ?? 0,
    assists: player.stats?.assists ?? 0,
    minutes: player.stats?.minutes ?? 2107,
    shots: player.stats?.shots ?? 12,
    foulsReceived: player.stats?.foulsReceived ?? 8,
  };

  const compStats = player[activeComp] || {};

  const tabStyle = (tab) => ({
    flex: 1,
    padding: '0.9rem 0',
    textAlign: 'center',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    backgroundColor: activeComp === tab ? '#6366f1' : 'transparent',
    color: activeComp === tab ? '#e5e7eb' : '#a8afbcff',
    transition: 'all 0.2s ease',
    border: 'none',
  });

  return (
    <div className="player-page-bg">
      <div style={{ padding: '2rem 4rem' }}>
        {/* Top bar: back + season */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#93c5fd',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            ⬅️ Back to Home page
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#020617',
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              border: '1px solid #1f2937',
              fontSize: '0.9rem',
            }}
          >
            <span style={{ color: '#ffffffff' }}><b>Season: </b></span>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              style={{
                background: 'black',
                border: '10',
                color: '#e5e7eb',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
        </div>

        {/* Player name */}
        <h1
          style={{
            fontSize: '2.5rem',
            marginBottom: '0.25rem',
            textTransform: 'uppercase',
            color: '#ffffffff',
          }}
        >
          {player.fullName}
        </h1>

        {/* Image + basic info + small stats */}
        <div
          style={{
            marginTop: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 2fr)',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* left: big image and number */}
          <div
            style={{
              background: '#cddcfeff',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '1rem',
                fontSize: '4rem',
                fontWeight: 800,
                color: '#0f172a',
                opacity: 0.85,
              }}
            >
              {player.shirtNumber}
            </div>
            {player.photoUrl && (
              <img
                src={player.photoUrl}
                alt={player.fullName}
                style={{
                  width: '100%',
                  height: '380px',
                  objectFit: 'cover',
                  objectPosition: 'top',
                }}
              />
            )}
          </div>

          {/* right: position, club, small stats */}
          <div>
            <p
              style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#f9fafdff',
              }}
            >
              {player.position} • {player.nationality}
            </p>

            {player.team && (
              <p style={{ marginTop: '0.5rem', color: '#767e89ff' }}>
                Club: <strong>{player.team.name}</strong>
              </p>
            )}

            {/* small stats grid */}
            <div style={{ marginTop: '1.5rem' }}>
              <h2
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '0.75rem',
                  color: '#f4f5f7ff',
                }}
              >
                <u>Stats</u>
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '0.75rem',
                }}
              >
                <StatBox label="Appearances" value={player.stats?.appearances ?? 28} />
                <StatBox label="Goals" value={player.stats?.goals ?? 0} />
                <StatBox label="Assists" value={player.stats?.assists ?? 0} />
                <StatBox label="Yellow Cards" value={player.stats?.yellowCards ?? 2} />
                <StatBox label="Red Cards" value={player.stats?.redCards ?? 0} />
              </div>
            </div>
          </div>
        </div>

        {/* Complete stats big numbers row */}
        <section
          style={{
            background: '#020617',
            borderRadius: '18px',
            padding: '1.8rem 2.4rem',
            marginTop: '3rem',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: '2rem',
            boxShadow: '0 18px 40px rgba(15,23,42,0.9)',
            border: '1px solid #111827',
          }}
        >
          <StatBlock label="Matches played" value={globalStats.matches} />
          <StatBlock label="Goals" value={globalStats.goals} />
          <StatBlock label="Assists" value={globalStats.assists} />
          <StatBlock label="Minutes played" value={globalStats.minutes} />
          <StatBlock label="Shots" value={globalStats.shots} />
          <StatBlock label="Fouls received" value={globalStats.foulsReceived} />
        </section>

        {/* competition tabs */}
        <div
          style={{
            background: '#020617',
            borderRadius: '999px',
            padding: '0.25rem',
            display: 'flex',
            marginBottom: '1.5rem',
            border: '1px solid #111827',
          }}
        >
          <button style={tabStyle('league')} onClick={() => setActiveComp('league')}>
            La Liga
          </button>
          <button style={tabStyle('ucl')} onClick={() => setActiveComp('ucl')}>
            Champions League
          </button>
          <button style={tabStyle('cup')} onClick={() => setActiveComp('cup')}>
            Copa del Rey
          </button>
        </div>

        {/* detailed 2-column stats */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '3rem',
            fontSize: '0.95rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: '#e5e7eb' }}>
              Matches played
            </h2>
            <Row label="Matches as starter" value={compStats.matchesAsStarter ?? 0} />
            <Row label="Matches as substitute" value={compStats.matchesAsSub ?? 0} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: '#e5e7eb' }}>
              Other
            </h2>
            <Row label="Assists" value={compStats.assists ?? 0} />
            <Row label="Minutes played" value={compStats.minutes ?? 0} />
            <Row label="Passes" value={compStats.passes ?? 0} />
          </div>
        </section>
      </div>
    </div>
  );
};

const StatBlock = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#e5e7eb' }}>
      {value}
    </div>
    <div style={{ marginTop: '0.25rem', color: '#e5e8eeff', fontSize: '0.9rem' }}>
      {label}
    </div>
  </div>
);

const Row = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.65rem 0',
      borderBottom: '1px solid #111827',
    }}
  >
    <span style={{ color: '#e5e7eb' }}>{label}</span>
    <span style={{ color: '#9ca3af' }}>{value}</span>
  </div>
);

const StatBox = ({ label, value }) => (
  <div
    style={{
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      background: '#f3f4f6',
    }}
  >
    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#b2b3b7ff' }}>
      {label}
    </div>
    <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{value ?? 0}</div>
  </div>
);

export default PlayerPage;
