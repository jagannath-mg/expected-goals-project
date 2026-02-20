// src/pages/FixturesPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const FixturesPage = () => {
  const { league } = useParams();
  const navigate = useNavigate();
  
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const dummyFixtures = {
      epl: [
        { 
          id: '1', 
          date: 'Saturday, February 07, 2026', 
          home: 'Sunderland', 
          score: '1-0', 
          away: 'Burnley',
          time: '15:00'
        },
        { 
          id: '2', 
          date: 'Saturday, February 07, 2026', 
          home: 'Leeds', 
          score: '2-0', 
          away: 'Nottm Forest',
          time: '17:30'
        },
        { 
          id: '3', 
          date: 'Saturday, February 07, 2026', 
          home: 'Man United', 
          score: '1-1', 
          away: 'Aston Villa',
          time: '20:00'
        }
      ],
      laliga: [
        { 
          id: '4', 
          date: 'Saturday, February 07, 2026', 
          home: 'Real Madrid', 
          score: '2-1', 
          away: 'Barcelona',
          time: '21:00'
        }
      ],
      bundesliga: [
        { 
          id: '5', 
          date: 'Saturday, February 07, 2026', 
          home: 'Bayern Munich', 
          score: '3-1', 
          away: 'Dortmund',
          time: '18:30'
        }
      ]
    };
    
    setFixtures(dummyFixtures[league] || []);
  }, [league]);

  const leagueNames = {
    epl: 'Premier League',
    laliga: 'La Liga',
    bundesliga: 'Bundesliga'
  };

  const goToMatchDetails = (fixtureId) => {
    navigate(`/${league}/fixtures/${fixtureId}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f1117',
      color: 'white',
      padding: '2rem 4rem'
    }}>
      {/* Centered Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        position: 'relative'
      }}>
        <Link 
          to="/" 
          style={{ 
            color: '#3b82f6', 
            textDecoration: 'none', 
            fontWeight: 600,
            position: 'absolute',
            left: '4rem',
            top: '0.5rem'
          }}
        >
          ← Back to Leagues
        </Link>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 auto 1rem',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #3b82f6, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {leagueNames[league]?.toUpperCase() || 'EPL'} Fixtures
        </h1>
      </div>

      {/* Fixtures List */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {fixtures.map((fixture) => (
          <div
            key={fixture.id}
            onClick={() => goToMatchDetails(fixture)}
            style={{
              background: '#1f2937',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              marginBottom: '1rem',
              borderLeft: '4px solid #3b82f6',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#374151';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(59,130,246,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#1f2937';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }}
          >
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#9ca3af', 
              marginBottom: '1rem',
              fontWeight: 500
            }}>
              {fixture.date} • {fixture.time}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <div style={{ 
                textAlign: 'left', 
                flex: 1,
                minWidth: 0 
              }}>
                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {fixture.home}
                </div>
              </div>
              
              <div style={{ 
                flex: '0 0 80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem', 
                fontWeight: 800, 
                color: '#10b981',
                textAlign: 'center',
                minWidth: '80px'
              }}>
                {fixture.score}
              </div>
              
              <div style={{ 
                textAlign: 'right', 
                flex: 1,
                minWidth: 0 
              }}>
                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {fixture.away}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixturesPage;
