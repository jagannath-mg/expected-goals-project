import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000';

const leagueNames = {
  epl:        { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', accent: '#3b82f6' },
  laliga:     { name: 'La Liga',         flag: '🇪🇸',        accent: '#ef4444' },
  bundesliga: { name: 'Bundesliga',      flag: '🇩🇪',        accent: '#f59e0b' },
};

const SkeletonRow = () => (
  <div style={{ background: '#161b26', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '0.6rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <div className="skeleton" style={{ height: '14px', width: '120px' }} />
      <div className="skeleton" style={{ height: '20px', width: '60px' }} />
      <div className="skeleton" style={{ height: '14px', width: '120px' }} />
    </div>
  </div>
);

const FixturesPage = () => {
  const { league } = useParams();
  const navigate   = useNavigate();
  const meta       = leagueNames[league] || { name: league, flag: '', accent: '#3b82f6' };

  const [seasons,        setSeasons]        = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [fixtures,       setFixtures]       = useState([]);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [loadingFix,     setLoadingFix]     = useState(false);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    setLoadingSeasons(true);
    fetch(`${API}/league/${league}/seasons`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setSeasons(data);
        if (data.length > 0) setSelectedSeason(data[0].season_id);
        setLoadingSeasons(false);
      })
      .catch(e => { setError(e.message); setLoadingSeasons(false); });
  }, [league]);

  useEffect(() => {
    if (!selectedSeason) return;
    setLoadingFix(true);
    setFixtures([]);
    fetch(`${API}/league/${league}/fixtures?season_id=${selectedSeason}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setFixtures(data);
        setLoadingFix(false);
      })
      .catch(e => { setError(e.message); setLoadingFix(false); });
  }, [league, selectedSeason]);

  // Group fixtures by matchweek
  const grouped = fixtures.reduce((acc, f) => {
    const wk = `Matchweek ${f.matchweek}`;
    if (!acc[wk]) acc[wk] = [];
    acc[wk].push(f);
    return acc;
  }, {});

  return (
    <div className="page-enter" style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/leagues" style={{
          color: '#64748b', textDecoration: 'none', fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          padding: '0.4rem 0.8rem', borderRadius: '6px',
          background: '#161b26', border: '1px solid #252d3d',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          ← Leagues
        </Link>
        <div>
          <div style={{ fontSize: '0.8rem', color: meta.accent, fontWeight: 600, letterSpacing: '0.08em' }}>
            {meta.flag} FIXTURES
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            {meta.name}
          </h1>
        </div>

        {/* Season dropdown */}
        {!loadingSeasons && seasons.length > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Season</span>
            <select
              value={selectedSeason || ''}
              onChange={e => setSelectedSeason(Number(e.target.value))}
              style={{
                background: '#161b26', color: '#f1f5f9',
                border: '1px solid #252d3d', borderRadius: '8px',
                padding: '0.4rem 0.8rem', fontSize: '0.9rem', cursor: 'pointer',
                outline: 'none',
              }}
            >
              {seasons.map(s => (
                <option key={s.season_id} value={s.season_id}>{s.season_name}</option>
              ))}
            </select>
            {fixtures.length > 0 && (
              <span style={{
                fontSize: '0.75rem', color: '#64748b',
                background: '#161b26', border: '1px solid #252d3d',
                padding: '0.3rem 0.6rem', borderRadius: '6px'
              }}>
                {fixtures.length} matches
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#1e2535', border: '1px solid #ef444440', borderRadius: '10px',
          padding: '1rem 1.25rem', color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Skeletons */}
      {(loadingSeasons || loadingFix) && (
        <div>
          <div className="skeleton" style={{ height: '16px', width: '100px', marginBottom: '0.75rem' }} />
          {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {/* Grouped fixtures */}
      {!loadingFix && !error && Object.entries(grouped).map(([week, matches]) => (
        <div key={week} style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700, color: '#64748b',
            letterSpacing: '0.1em', marginBottom: '0.6rem',
            textTransform: 'uppercase'
          }}>
            {week}
          </div>
          {matches.map(fixture => (
            <div
              key={fixture.match_id}
              onClick={() => navigate(`/${league}/match/${fixture.match_id}`, {
                state: { ...fixture, season_id: selectedSeason }
              })}
              style={{
                background: '#161b26', border: '1px solid #252d3d',
                borderRadius: '10px', padding: '1rem 1.5rem',
                marginBottom: '0.5rem', cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1e2535';
                e.currentTarget.style.borderColor = meta.accent + '60';
                e.currentTarget.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#161b26';
                e.currentTarget.style.borderColor = '#252d3d';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 500, minWidth: '70px' }}>
                {fixture.date}
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <span style={{ flex: 1, textAlign: 'right', fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9' }}>
                  {fixture.home}
                </span>
                <span style={{
                  minWidth: '70px', textAlign: 'center',
                  fontWeight: 800, fontSize: '1.1rem', color: '#10b981',
                  background: '#0d2e22', padding: '0.25rem 0.6rem',
                  borderRadius: '6px', letterSpacing: '0.05em'
                }}>
                  {fixture.home_score} – {fixture.away_score}
                </span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9' }}>
                  {fixture.away}
                </span>
              </div>
              <span style={{ color: '#334155', fontSize: '0.8rem', marginLeft: '1rem' }}>›</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FixturesPage;
