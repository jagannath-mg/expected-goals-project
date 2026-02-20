// src/pages/MatchDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const MatchDetails = () => {
  const { league, matchId } = useParams();

  const matchData = {
    homeTeam: 'Sunderland',
    awayTeam: 'Burnley',
    score: '1-0',
    leagueNames: { epl: 'Premier League', laliga: 'La Liga', bundesliga: 'Bundesliga' }
  };

  const burnleyPlayers = [
    { name: 'Mario Dembélé', pos: 'DC', min: 90, shots: 0, goals: 0, xG: 0.02 },
    { name: 'Pascaline H.', pos: 'DC', min: 90, shots: 0, goals: 0, xG: 0.01 },
    { name: 'L. Sauret', pos: 'DL', min: 90, shots: 0, goals: 0, xG: 0.03 },
    { name: 'Lucas Pérez', pos: 'DR', min: 90, shots: 0, goals: 0, xG: 0.01 },
    { name: 'J. Edwards', pos: 'AMC', min: 90, shots: 0, goals: 0, xG: 0.07 },
    { name: 'A. Roger', pos: 'FW', min: 45, shots: 1, goals: 0, xG: 0.12 },
    { name: 'L. Braaten', pos: 'Sub', min: 17, shots: 0, goals: 0, xG: 0.01 },
    { name: 'M. Perring', pos: 'Sub', min: 24, shots: 1, goals: 0, xG: 0.05 }
  ];

  const sunderlandPlayers = [
    { name: 'R. Booth', pos: 'GK', min: 90, shots: 0, goals: 0, xG: 0.00 },
    { name: 'T. Hume', pos: 'DR', min: 90, shots: 1, goals: 0, xG: 0.04 },
    { name: 'G. Adélaïde', pos: 'DC', min: 90, shots: 0, goals: 0, xG: 0.02 },
    { name: 'R. Diallo', pos: 'DC', min: 90, shots: 2, goals: 1, xG: 0.18 },
    { name: 'N. Sadio', pos: 'DL', min: 90, shots: 1, goals: 0, xG: 0.09 },
    { name: 'C. Tomé', pos: 'MC', min: 90, shots: 0, goals: 0, xG: 0.03 },
    { name: 'W. Lodiger', pos: 'Sub', min: 8, shots: 2, goals: 0, xG: 0.14 },
    { name: 'N. Poudrade', pos: 'Sub', min: 1, shots: 0, goals: 0, xG: 0.01 }
  ];

  const teamStats = {
    sunderland: { possession: 88, goals: 3, shots: 14, shotsOnTarget: 5, xG: 1.67 },
    burnley: { possession: 12, goals: 0, shots: 4, shotsOnTarget: 0, xG: 0.47 }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0e17',
      color: 'white',
      padding: '1rem',
      fontFamily: 'monospace'
    }}>
      {/* Header with Back Button */}
      <div style={{ 
        position: 'relative',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <Link to={`/${league}/fixtures`} style={{
          position: 'absolute', left: 20, top: 10,
          color: '#3b82f6', textDecoration: 'none', fontSize: '1rem'
        }}>
          ← Back
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#e5e7eb' }}>
          {matchData.homeTeam} vs {matchData.awayTeam}
        </h1>
      </div>

      {/* Two Column Player Tables */}
      <div style={{ display: 'flex', gap: '1rem', height: 'calc(100vh - 200px)', overflow: 'auto' }}>
        {/* Burnley Players Table */}
        <div style={{ flex: 1, background: '#1a1f2e', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: '#f59e0b' }}>
            Burnley
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2a344d', height: '40px' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: '#94a3b8' }}>#</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>POS</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>MIN</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>SH</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>G</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>xG</th>
              </tr>
            </thead>
            <tbody>
              {burnleyPlayers.map((player, idx) => (
                <tr key={idx} style={{ 
                  height: '36px', 
                  borderBottom: '1px solid #2a344d',
                  background: idx % 2 ? '#1a1f2e' : '#111827'
                }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>{player.name}</td>
                  <td style={{ padding: '0.5rem', color: '#94a3b8' }}>{player.pos}</td>
                  <td style={{ padding: '0.5rem' }}>{player.min}</td>
                  <td style={{ padding: '0.5rem' }}>{player.shots}</td>
                  <td style={{ padding: '0.5rem', color: '#10b981' }}>{player.goals}</td>
                  <td style={{ padding: '0.5rem' }}>{player.xG}</td>
                </tr>
              ))}
              <tr style={{ background: '#2a344d', height: '40px' }}>
                <td colSpan="2" style={{ padding: '0.5rem', fontWeight: 'bold' }}>TOTAL</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>720</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>4</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold', color: '#10b981' }}>0</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>0.47</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sunderland Players Table */}
        <div style={{ flex: 1, background: '#1a1f2e', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: '#ef4444' }}>
            Sunderland
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2a344d', height: '40px' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: '#94a3b8' }}>#</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>POS</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>MIN</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>SH</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>G</th>
                <th style={{ padding: '0.5rem', color: '#94a3b8' }}>xG</th>
              </tr>
            </thead>
            <tbody>
              {sunderlandPlayers.map((player, idx) => (
                <tr key={idx} style={{ 
                  height: '36px', 
                  borderBottom: '1px solid #2a344d',
                  background: idx % 2 ? '#1a1f2e' : '#111827'
                }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>{player.name}</td>
                  <td style={{ padding: '0.5rem', color: '#94a3b8' }}>{player.pos}</td>
                  <td style={{ padding: '0.5rem' }}>{player.min}</td>
                  <td style={{ padding: '0.5rem' }}>{player.shots}</td>
                  <td style={{ padding: '0.5rem', color: '#10b981' }}>{player.goals}</td>
                  <td style={{ padding: '0.5rem' }}>{player.xG}</td>
                </tr>
              ))}
              <tr style={{ background: '#2a344d', height: '40px' }}>
                <td colSpan="2" style={{ padding: '0.5rem', fontWeight: 'bold' }}>TOTAL</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>719</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>14</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold', color: '#10b981' }}>1</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>1.67</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Stats Bottom Bar */}
      <div style={{ 
        display: 'flex', 
        background: '#111827', 
        borderTop: '1px solid #2a344d',
        padding: '1rem',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px'
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sunderland</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ef4444' }}>88%</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #2a344d' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>GOALS</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>1</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #2a344d' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SHOTS</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b' }}>14</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #2a344d' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SHOTS ON TARGET</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>5</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #2a344d' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>xG</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>1.67</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #2a344d' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>xA</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>0.80</div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
