// src/pages/PlayersHomePage.jsx
import React, { useEffect, useState } from 'react';
import PlayerCard from '../components/PlayerCard';
import FormationPitch from '../Components/FormationPitch';
// remove axios import for now

const PlayersHomePage = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // TEMP: hardcoded players instead of /api/players
    setPlayers([
      { _id: '1', fullName: 'MARCUS BETTINELLI', position: 'GK', shirtNumber: 13 ,photoUrl: '/player.webp',},
      { _id: '2', fullName: 'GIANLUIGI DONNARUMMA', position: 'GK', shirtNumber: 25,photoUrl: '/player.webp', },
      { _id: '3', fullName: 'STEFAN ORTEGA MORENO', position: 'GK', shirtNumber: 18,photoUrl: '/player.webp', },
      { _id: '4', fullName: 'JAMES TRAFFORD', position: 'GK', shirtNumber: 1,photoUrl: '/player.webp', },
      { _id: '5', fullName: 'Saliba', position: 'DF', shirtNumber: 4 ,photoUrl: '/player.webp',},
      { _id: '5', fullName: 'Saliba', position: 'DF', shirtNumber: 4 ,photoUrl: '/player.webp',},
      { _id: '5', fullName: 'Saliba', position: 'DF', shirtNumber: 4 ,photoUrl: '/player.webp',},
      { _id: '5', fullName: 'Saliba', position: 'DF', shirtNumber: 4 ,photoUrl: '/player.webp',},
      { _id: '5', fullName: 'Saliba', position: 'DF', shirtNumber: 4 ,photoUrl: '/player.webp',},
      { _id: '6', fullName: 'ronaldo', position: 'FW', shirtNumber: 9,photoUrl: '/player.webp', },
      { _id: '6', fullName: 'ronaldo', position: 'FW', shirtNumber: 9,photoUrl: '/player.webp', },
      { _id: '6', fullName: 'ronaldo', position: 'FW', shirtNumber: 9 ,photoUrl: '/player.webp',},
      { _id: '6', fullName: 'ronaldo', position: 'FW', shirtNumber: 9,photoUrl: '/player.webp', },
      { _id: '6', fullName: 'ronaldo', position: 'FW', shirtNumber: 9 ,photoUrl: '/player.webp',},
      { _id: '7', fullName: 'Buffon',position:'GK',shirtNumber:10,photoUrl: '/player.webp',},
      { _id: '7', fullName: 'Gianluigi Buffon',position:'FW',shirtNumber:10,photoUrl: '/player.webp',},
    ]);
  }, []);

  const byPos = (pos) => players.filter((p) => p.position === pos);

  return (
    <div style={{ padding: '2rem 4rem' }}>
      {/* big PLAYERS title */}
  
      <h1
        style={{
          fontSize: '3.5rem',
          letterSpacing: '0.15em',
          marginBottom: '1rem',
          color: '#ffffffff',
        }}
      >
        PLAYERS
      </h1>
     
      {/* tabs row */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
        
          marginBottom: '2rem',
          fontWeight: 600,
        
        }}
      >
        <button
          style={{
            border: 'none',
            background: 'none',
            padding: '0 0 0.75rem',
            borderBottom: '3px solid #fdfdfdff',
            color: '#ffffffff',
            
          }}
        >
         <i> Men&apos;s Team</i>
        </button>

        <button
          style={{
            border: 'none',
            background: 'none',
            padding: '0 0 0.75rem',
            color: '#ffffffff',
          }}
        >
          <i>Academy</i>
        </button>
      </div>

      <SectionBlock title="GOALKEEPERS" players={byPos('GK')} />
      <SectionBlock title="DEFENDERS" players={byPos('DF')} />
      <SectionBlock title="MIDFIELDERS" players={byPos('MF')} />
      <SectionBlock title="FORWARDS" players={byPos('FW')} />
      <h2
        style={{
          fontSize: '2rem',
          letterSpacing: '0.12em',
          marginBottom: '1rem',
          color: '#ffffffff',
        }}
      >
        Formation
      </h2>

      {/* pitch left, stats right */}
<div
  style={{
    marginTop: '1rem',
    display: 'flex',
    gap: '0.5rem',              // even closer
    alignItems: 'center',
    justifyContent: 'flex-start',
  }}
>
  <FormationPitch />

  <div
    style={{
      minWidth: '340px',        // bigger card
      maxWidth: '380px',
      padding: '1.4rem 1.6rem', // more padding = larger
      borderRadius: '16px',
      background: '#0f172a',
      color: '#f9fafb',
      boxShadow: '0 20px 40px rgba(15,23,42,0.65)',
    }}
  >
    <h3
      style={{
        margin: 0,
        marginBottom: '0.9rem',
        fontSize: '1.5rem',
      }}
    >
      Team Performance
    </h3>
    <p
      style={{
        margin: '0 0 0.9rem',
        fontSize: '1rem',
        opacity: 0.9,
      }}
    >
      Current best formation: <strong>4‑3‑2‑1</strong>
    </p>
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        fontSize: '1rem',
        lineHeight: 1.8,
      }}
    >
      <li>Matches played: <strong>28</strong></li>
      <li>Wins: <strong>18</strong></li>
      <li>Draws: <strong>6</strong></li>
      <li>Losses: <strong>4</strong></li>
      <li>Win rate: <strong>64%</strong></li>
    </ul>
  </div>
</div>

    </div>
  );
};


const SectionBlock = ({ title, players }) => {
  if (!players.length) return null;

  return (
    <section style={{ marginBottom: '3rem' }}>
      <h2
        style={{
          fontSize: '2rem',
          letterSpacing: '0.12em',
          marginBottom: '1rem',
          color: '#cfd0d1ff',
        }}
      >
        {title}
      </h2>
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', // 4 cards per row
    gap: '1.5rem',
  }}
>
  {players.map((p) => (
    <PlayerCard key={p._id} player={p} />
  ))}
</div>
    </section>
  );
};

export default PlayersHomePage;
