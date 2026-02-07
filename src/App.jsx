// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Loader from './Components/Loader';
import LeagueSelector from './pages/LeagueSelector';

// adjust path if your file is in src/pages/PlayersHomePage.jsx

import PlayersHomePage from './pages/PlayersHomePage';
import PlayerPage from './pages/PlayerPage';


function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    return (
      <div className="splash-screen">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            color: '#ffffffff',
            textAlign: 'center',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
              LOADING SQUAD...
            </h1>
          </div>

          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Man City header bar */}
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
        {/* City logo - replace with your actual logo */}
        <img 
          src="/Logo.svg" 
          alt="Man City" 
          style={{ height: '45px',border:5 }}
        />
        
        {/* Nav links */}
        <nav style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto' }}>
          <Link to="/" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>News</Link>
          <Link to="/fixtures" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Fixtures</Link>
          <Link to="/tickets" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Tickets</Link>
          <Link to="/shop" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Shop</Link>
          <Link to="/players" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 600 }}>Players</Link>
          <Link to="/club" style={{ color: 'Ivory', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Club</Link>
        </nav>

        {/* Right side: EN | Sign In */}
        <div style={{ display: 'flex', gap: '1rem', color: 'Ivory', fontSize: '0.85rem' }}>
          <span>EN</span>
          <button style={{ background: 'none', border: 'none', color: 'Ivory', cursor: 'pointer' }}>Sign In</button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ padding: '1.5rem' }}>
        <Routes>

          <Route path="/" element={<LeagueSelector />} />
         { /* <Route path="/" element={<PlayersHomePage />} />*/  }

          <Route path="/players/:playerId" element={<PlayerPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
