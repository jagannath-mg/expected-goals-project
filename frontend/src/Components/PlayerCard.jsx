import React from 'react';
import { useNavigate } from 'react-router-dom';

const posColor = { GK: '#f59e0b', DF: '#3b82f6', MF: '#10b981', FW: '#ef4444' };

const PlayerCard = ({ player }) => {
  const navigate = useNavigate();
  const name     = player.fullName || '';
  const color    = posColor[player.position] || '#64748b';

  return (
    <div
      onClick={() => navigate(`/players/${player._id}`)}
      style={{
        background: '#161b26', border: '1px solid #252d3d',
        borderRadius: '12px', overflow: 'hidden',
        cursor: 'pointer', transition: 'all 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '80';
        e.currentTarget.style.transform   = 'translateY(-3px)';
        e.currentTarget.style.boxShadow   = `0 12px 30px ${color}20`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#252d3d';
        e.currentTarget.style.transform   = 'translateY(0)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', background: '#1e2535', height: '180px' }}>
        <div style={{
          position: 'absolute', top: '0.6rem', right: '0.6rem',
          fontSize: '1.8rem', fontWeight: 900, color: '#0d0f14',
          opacity: 0.4, lineHeight: 1,
        }}>
          {player.shirtNumber}
        </div>
        <img src={player.photoUrl} alt={name} style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top',
        }} />
      </div>
      {/* Info */}
      <div style={{ padding: '0.75rem 1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color, letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
          {player.position}
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>
          {name.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
