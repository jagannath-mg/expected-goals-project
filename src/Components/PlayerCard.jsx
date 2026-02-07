// src/components/PlayerCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlayerCard = ({ player }) => {
  const navigate = useNavigate();
  const name = player.fullName || '';

  return (
    <div
      onClick={() => navigate(`/players/${player._id}`)}
      style={{
        background: '#fcf8f8ff',
        borderRadius: '12px',
        boxShadow: '0 12px 25px rgba(15,23,42,0.15)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ position: 'relative', padding: '1rem', background: '#b0d9f5ff' }}>
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.75rem',
            fontSize: '3rem',
            fontWeight: 800,
            color: '#4f4d4dff',
            opacity: 0.85,
          }}
        >
          {player.shirtNumber}
        </div>
        {player.photoUrl && (
  <img
    src={player.photoUrl}
    alt={name}
    style={{
      width: '100%',
      height: '220px',
      objectFit: 'cover',
      objectPosition: 'top',
    }}
  />
)}
      </div>

      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1 }}>
          {name.toUpperCase()}
        </div>
        <div style={{ marginTop: '0.3rem', color: '#7d7d80ff', fontWeight: 600 }}>
          {player.position}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
