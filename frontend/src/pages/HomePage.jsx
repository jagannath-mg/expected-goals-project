import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Stadium theme

const HomePage = () => {
  return (
    <div className="homepage stadium-bg">
      <nav className="navbar">
        <div className="logo">⚽ xG Analyzer</div>
        <div className="nav-links">
          <Link to="/leagues">Leagues</Link>
          <Link to="/xg-calculator">xG Calc</Link>
        </div>
      </nav>
      
      <div className="hero">
        <h1>Expected Goals Football Analytics</h1>
        <div className="options-grid">
          <Link to="/leagues" className="option-card league-card">
            <div className="stadium-bg-overlay"></div>
            <h2>🏆 League Stats</h2>
            <p>Premier League, LaLiga, Bundesliga<br/>Live standings + xG</p>
          </Link>
          
          <Link to="/xg-calculator" className="option-card xg-card">
            <div className="pitch-preview"></div>
            <h2>⚽ Manual xG Calculator</h2>
            <p>Input shot details → Get xG<br/>Interactive pitch visualizer</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
