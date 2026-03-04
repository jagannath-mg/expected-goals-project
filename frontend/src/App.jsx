import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// 1. Imports from your Components folder
import XGCalculator from "./Components/XGCalculator"; 
import Loader from './Components/Loader';

// 2. Imports from your Pages folder
import FixturesPage from './pages/FixturesPage';
import LeagueSelector from './pages/LeagueSelector';
import MatchDetails from './pages/MatchDetails';
import PlayersHomePage from './pages/PlayersHomePage';
import PlayerPage from './pages/PlayerPage';

// 3. Local Page Components
const HomePage = () => (
  <div style={{padding: '1rem 2rem 0 2rem', textAlign: 'center', minHeight: '80vh'}}>
    <h1 style={{
      fontSize: 'clamp(3rem, 8vw, 6rem)',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 50%, #ffa500 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 0 30px rgba(255,215,0,0.5)',
      letterSpacing: '-0.02em',
      marginBottom: '4rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}> xG Analyzer</h1>

    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: '1000px', margin: '0 auto'}}>
      <Link to="/leagues" style={{
        background: `linear-gradient(rgba(80, 64, 64, 0.9), rgba(234,88,12,0.9)), url("/Box_bg.png") center/cover`,
        padding: '3rem',
        borderRadius: '20px',
        color: 'white',
        textDecoration: 'none',
        boxShadow: '0 20px 40px rgba(220,38,38,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1, borderRadius: '20px' }}></div>
        <div style={{position: 'relative', zIndex: 2}}>
          <h2 style={{margin: '0 0 1rem 0', fontSize: '2rem'}}> League Stats</h2>
          <p style={{margin: 0, fontSize: '1.1rem'}}>Premier League, LaLiga, Bundesliga<br/>xG analytics</p>
        </div>
      </Link>

      <Link to="/xg-calculator" style={{
        background: 'linear-gradient(45deg, #059669, #10b981)', 
        padding: '3rem', borderRadius: '20px', color: 'white', textDecoration: 'none',
        boxShadow: '0 20px 40px rgba(5,150,105,0.3)'
      }}>
        <h2 style={{margin: '0 0 1rem 0'}}>⚽ Manual xG Calculator</h2>
        <p>Shot distance, angle, type → Instant xG<br/>Interactive pitch visualizer</p>
      </Link>
    </div>
  </div>
);

// --- NOTE: THE DUPLICATE XGCALCULATOR FUNCTION WAS REMOVED FROM HERE ---

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    return (
      <div className="splash-screen">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: '#ffffffff',
          textAlign: 'center',
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>LOADING SQUAD...</h1>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div>
      <header style={{
        background: 'linear-gradient(90deg, #ffffffff 0%, #0057B8 100%)',
        height: '70px',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        boxShadow: '0 4px 12px rgba(176, 176, 250, 1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <img src="/Logo.svg" alt="Man City" style={{ height: '45px' }} />
        <nav style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto' }}>
          <Link to="/" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 500 }}><b> Home</b></Link>
          <Link to="/leagues" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 600 }}> Leagues</Link>
          <Link to="/xg-calculator" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 600 }}> xG Calc</Link>
          <Link to="/players" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 600 }}>Players</Link>
          <Link to="/club" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 500 }}>Club</Link>
        </nav>
      </header>

      <main style={{ padding: '1.5rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersHomePage />} />
          <Route path="/leagues" element={<LeagueSelector />} />
          <Route path="/:league/fixtures" element={<FixturesPage />} />
          <Route path="/:league/fixtures/:matchId" element={<MatchDetails />} />
          <Route path="/xg-calculator" element={<XGCalculator />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;