import React from 'react';
import { useNavigate } from 'react-router-dom';

const LEAGUES = [
  {
    id: 'epl',
    name: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    seasons: '2 seasons',
    accent: '#3b82f6',
    bg: '/pl2.webp',
  },
  {
    id: 'laliga',
    name: 'La Liga',
    country: 'Spain',
    flag: '🇪🇸',
    seasons: '5 seasons',
    accent: '#ef4444',
    bg: '/LaLiga.png',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany',
    flag: '🇩🇪',
    seasons: '2 seasons',
    accent: '#f59e0b',
    bg: '/bl2.png',
  },
];

const LeagueSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="page-enter" style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          STATSBOMB OPEN DATA
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          Select League
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.4rem', fontSize: '0.95rem' }}>
          Real match data with xG calculated by your trained model
        </p>
      </div>

      {/* League Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {LEAGUES.map((league) => (
          <div
            key={league.id}
            onClick={() => navigate(`/${league.id}/fixtures`)}
            style={{
              position: 'relative', overflow: 'hidden',
              borderRadius: '16px', cursor: 'pointer',
              border: `1px solid #252d3d`,
              height: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = league.accent;
              e.currentTarget.style.boxShadow = `0 20px 40px ${league.accent}25`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#252d3d';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Background image */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url('${league.bg}')`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'brightness(0.35)',
            }} />

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${league.accent}20 0%, transparent 100%)`,
            }} />

            {/* Content */}
            <div style={{
              position: 'relative', zIndex: 2,
              padding: '1.5rem', height: '100%',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                padding: '0.3rem 0.7rem', borderRadius: '999px',
                fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 600,
                width: 'fit-content',
              }}>
                <span>{league.flag}</span>
                <span>{league.country}</span>
              </div>

              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.35rem' }}>
                  {league.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{league.seasons} available</span>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 600, color: league.accent,
                    display: 'flex', alignItems: 'center', gap: '0.3rem'
                  }}>
                    View Fixtures →
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueSelector;
