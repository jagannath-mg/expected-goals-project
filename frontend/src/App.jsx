import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import XGCalculator   from './Components/XGCalculator';
import Loader         from './Components/Loader';
import FixturesPage   from './pages/FixturesPage';
import LeagueSelector from './pages/LeagueSelector';
import MatchDetails   from './pages/MatchDetails';
import VideoXGPage    from './pages/VideoXGPage';


const NAV_LINKS = [
  { to: '/',              label: 'Home'     },
  { to: '/leagues',       label: 'Leagues'  },
  { to: '/xg-calculator', label: 'xG Calc'  },
  { to: '/video-xg',      label: 'Video xG' },
];


const Navbar = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(13,15,20,0.95)' : '#0d0f14',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: '1px solid #252d3d',
      transition: 'all 0.3s ease',
      height: '60px',
      display: 'flex', alignItems: 'center',
      padding: '0 2rem', gap: '2rem',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <img
          src="/xg_logo.png"
          alt="xG Analyzer"
          style={{ height: '34px', width: '34px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <span style={{
          fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em',
          background: 'linear-gradient(90deg, #3b82f6, #10b981)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>ANALYZER</span>
      </Link>

      <nav style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
        {NAV_LINKS.map(({ to, label }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <Link key={to} to={to} style={{
              padding: '0.4rem 0.9rem', borderRadius: '6px', textDecoration: 'none',
              fontSize: '0.9rem', fontWeight: 600,
              color:      active ? '#f1f5f9' : '#64748b',
              background: active ? '#1e2535' : 'transparent',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#f1f5f9'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#64748b'; }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};


const HomePage = () => (
  <div className="page-enter" style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <div style={{
        display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px',
        background: '#1e2535', border: '1px solid #252d3d',
        fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600,
        letterSpacing: '0.1em', marginBottom: '1.5rem'
      }}>
        POWERED BY ML MODEL + STATSBOMB DATA
      </div>
      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900,
        letterSpacing: '-0.03em', lineHeight: 1.1,
        background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        Expected Goals<br />Analytics
      </h1>
      <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
        Analyse shots, predict xG, and explore league data powered by your trained ML model.
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

      {/* League Stats */}
      <Link to="/leagues" style={{ textDecoration: 'none' }}>
        <div style={{
          background: '#161b26', border: '1px solid #252d3d', borderRadius: '16px',
          padding: '2rem', cursor: 'pointer', transition: 'all 0.25s ease', height: '100%',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(59,130,246,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#252d3d'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', marginBottom: '1.25rem'
          }}>🏆</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f1f5f9' }}>League Stats</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Premier League, La Liga, Bundesliga — real match xG powered by your model.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['EPL', 'La Liga', 'Bundesliga'].map(t => (
              <span key={t} style={{
                padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem',
                background: '#1e2535', border: '1px solid #252d3d', color: '#94a3b8'
              }}>{t}</span>
            ))}
          </div>
        </div>
      </Link>

      {/* xG Calculator */}
      <Link to="/xg-calculator" style={{ textDecoration: 'none' }}>
        <div style={{
          background: '#161b26', border: '1px solid #252d3d', borderRadius: '16px',
          padding: '2rem', cursor: 'pointer', transition: 'all 0.25s ease', height: '100%',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(16,185,129,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#252d3d'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #065f46, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', marginBottom: '1.25rem'
          }}>⚽</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f1f5f9' }}>Manual xG Calculator</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Input shot details — distance, angle, body part — and get instant xG prediction.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['AUC 0.75', 'LogLoss 0.31', 'Logistic Regression'].map(t => (
              <span key={t} style={{
                padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem',
                background: '#1e2535', border: '1px solid #252d3d', color: '#94a3b8'
              }}>{t}</span>
            ))}
          </div>
        </div>
      </Link>

      {/* Video xG */}
      <Link to="/video-xg" style={{ textDecoration: 'none' }}>
        <div style={{
          background: '#161b26', border: '1px solid #252d3d', borderRadius: '16px',
          padding: '2rem', cursor: 'pointer', transition: 'all 0.25s ease', height: '100%',
          position: 'relative', overflow: 'hidden',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(168,85,247,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#252d3d'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', marginBottom: '1.25rem'
          }}>🎬</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f1f5f9' }}>Video xG Analysis</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Upload a match video, capture shot frames manually, mark goal points and get instant xG predictions.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Frame Capture', 'Point Marking', 'Logistic Regression'].map(t => (
              <span key={t} style={{
                padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem',
                background: '#1e2535', border: '1px solid #7c3aed40', color: '#a78bfa'
              }}>{t}</span>
            ))}
          </div>
        </div>
      </Link>

    </div>
  </div>
);


function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    return (
      <div className="splash-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f14' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                        element={<HomePage />} />
          <Route path="/leagues"                 element={<LeagueSelector />} />
          <Route path="/:league/fixtures"        element={<FixturesPage />} />
          <Route path="/:league/match/:match_id" element={<MatchDetails />} />
          <Route path="/xg-calculator"           element={<XGCalculator />} />
          <Route path="/video-xg"                element={<VideoXGPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
