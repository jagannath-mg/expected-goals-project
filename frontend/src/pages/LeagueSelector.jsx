// src/pages/LeagueSelector.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeagueSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (leagueId) => {
    navigate(`/${leagueId}/fixtures`);
  };

  return (
    <div style={{ 
      minHeight: '50vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '4rem', 
        textAlign: 'left' 
      }}>
        Select Your League ...  </h1>
      
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {/* EPL */}
        <div
          onClick={() => handleSelect('epl')}
          style={{
            backgroundImage: 'url("/pl2.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            minWidth: '320px',
            minHeight: '200px',
            transition: 'all 0.3s ease',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-10px) scale(1.02)';
            e.target.style.boxShadow = '0 30px 60px rgb(254, 251, 251)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
        >
          {/* Dark overlay for text readability */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
           /* background: 'rgba(0,0,0,0.6)',*/
            zIndex: 1
          }} />
          
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
          {/*  <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem', 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              EPL
            </h2>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '1.1rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              Premier League
            </p>
            */}
          </div>
        </div>

        {/* La Liga */}
        <div
          onClick={() => handleSelect('laliga')}
          style={{
            backgroundImage: 'url("/LaLiga.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            minWidth: '320px',
            minHeight: '200px',
            transition: 'all 0.3s ease',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-10px) scale(1.02)';
            e.target.style.boxShadow = '0 30px 60px rgba(244, 69, 69, 0.95)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
           /* background: 'rgba(0,0,0,0.6)',*/
            zIndex: 1
          }} />
          
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            {/*
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem', 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              La Liga
            </h2>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '1.1rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              Spanish League
            </p>
            */}
          </div>
        </div>

        {/* Bundesliga */}
        <div
          onClick={() => handleSelect('bundesliga')}
          style={{
            backgroundImage: 'url("/bl2.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            minWidth: '320px',
            minHeight: '200px',
            transition: 'all 0.3s ease',
            boxShadow: '0 20px 40px rgba(248, 248, 248, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-10px) scale(1.02)';
            e.target.style.boxShadow = '0 30px 60px rgb(230, 219, 219)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
           /* background: 'rgba(245, 244, 244, 0.6)',*/
            zIndex: 1
          }} />
          
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            {/*
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem', 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              Bundesliga
            </h2>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '1.1rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              German League
            </p>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueSelector;
