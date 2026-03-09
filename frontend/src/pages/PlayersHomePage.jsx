import React, { useState } from 'react';
import PlayerCard from '../Components/PlayerCard';
import FormationPitch from '../Components/FormationPitch';

const PLAYERS = [
  { _id: 'p1',  fullName: 'Ederson',           position: 'GK', shirtNumber: 31, photoUrl: '/player.webp' },
  { _id: 'p2',  fullName: 'Scott Carson',       position: 'GK', shirtNumber: 33, photoUrl: '/player.webp' },
  { _id: 'p3',  fullName: 'Rúben Dias',         position: 'DF', shirtNumber: 3,  photoUrl: '/player.webp' },
  { _id: 'p4',  fullName: 'Kyle Walker',        position: 'DF', shirtNumber: 2,  photoUrl: '/player.webp' },
  { _id: 'p5',  fullName: 'Manuel Akanji',      position: 'DF', shirtNumber: 25, photoUrl: '/player.webp' },
  { _id: 'p6',  fullName: 'Joško Gvardiol',     position: 'DF', shirtNumber: 24, photoUrl: '/player.webp' },
  { _id: 'p7',  fullName: 'Rodri',              position: 'MF', shirtNumber: 16, photoUrl: '/player.webp' },
  { _id: 'p8',  fullName: 'Kevin De Bruyne',    position: 'MF', shirtNumber: 17, photoUrl: '/player.webp' },
  { _id: 'p9',  fullName: 'Bernardo Silva',     position: 'MF', shirtNumber: 20, photoUrl: '/player.webp' },
  { _id: 'p10', fullName: 'Phil Foden',         position: 'MF', shirtNumber: 47, photoUrl: '/player.webp' },
  { _id: 'p11', fullName: 'Erling Haaland',     position: 'FW', shirtNumber: 9,  photoUrl: '/player.webp' },
  { _id: 'p12', fullName: 'Jeremy Doku',        position: 'FW', shirtNumber: 11, photoUrl: '/player.webp' },
  { _id: 'p13', fullName: 'Jack Grealish',      position: 'FW', shirtNumber: 10, photoUrl: '/player.webp' },
  { _id: 'p14', fullName: 'Savinho',            position: 'FW', shirtNumber: 26, photoUrl: '/player.webp' },
];

const TABS = ['Men\'s Team', 'Academy'];

const SectionBlock = ({ title, players }) => {
  if (!players.length) return null;
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{
        fontSize: '0.72rem', fontWeight: 700, color: '#64748b',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        marginBottom: '1rem', paddingBottom: '0.5rem',
        borderBottom: '1px solid #1e2535',
      }}>
        {title} — {players.length}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1rem',
      }}>
        {players.map(p => <PlayerCard key={p._id} player={p} />)}
      </div>
    </section>
  );
};

const PlayersHomePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const byPos = pos => PLAYERS.filter(p => p.position === pos);

  return (
    <div className="page-enter" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Squad
        </h1>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: '#161b26', border: '1px solid #252d3d', borderRadius: '8px', padding: '0.25rem', width: 'fit-content' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)} style={{
              padding: '0.4rem 1rem', borderRadius: '6px', border: 'none',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              background: activeTab === i ? '#1e2535' : 'transparent',
              color:      activeTab === i ? '#f1f5f9' : '#64748b',
              transition: 'all 0.2s',
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Player sections */}
      <SectionBlock title="Goalkeepers" players={byPos('GK')} />
      <SectionBlock title="Defenders"   players={byPos('DF')} />
      <SectionBlock title="Midfielders" players={byPos('MF')} />
      <SectionBlock title="Forwards"    players={byPos('FW')} />

      {/* Formation */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid #1e2535' }}>
          Formation
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <FormationPitch />
          <div style={{
            flex: 1, minWidth: '260px', maxWidth: '340px',
            background: '#161b26', border: '1px solid #252d3d',
            borderRadius: '14px', padding: '1.5rem',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              TEAM PERFORMANCE
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem' }}>
              4-3-2-1 Formation
            </div>
            {[
              ['Matches Played', '28'],
              ['Wins',           '18'],
              ['Draws',          '6' ],
              ['Losses',         '4' ],
              ['Win Rate',       '64%'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid #1e2535', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>{label}</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersHomePage;
