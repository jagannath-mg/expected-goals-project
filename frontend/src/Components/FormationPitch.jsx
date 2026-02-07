// src/Components/FormationPitch.jsx
import React from 'react';

const positions4321 = [
  // shirtNumber, top%, left%
  { num: 1,  top: 80, left: 50 }, // GK

  { num: 2,  top: 65, left: 20 }, // back 4
  { num: 3,  top: 65, left: 40 },
  { num: 4,  top: 65, left: 60 },
  { num: 5,  top: 65, left: 80 },

  { num: 6,  top: 50, left: 30 }, // three midfielders
  { num: 7,  top: 50, left: 50 },
  { num: 8,  top: 50, left: 70 },

  { num: 10, top: 35, left: 40 }, // two attacking mids
  { num: 11, top: 35, left: 60 },

  { num: 9,  top: 20, left: 50 }, // striker
];

const FormationPitch = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '450px',
        height: '420px',
        margin: '2rem auto',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundImage: 'url("/pitch.jpg")', // pitch background
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        boxShadow: '0 28px 55px rgba(15,23,42,0.8)',
        color: '#fff',
      }}
    >
      {/* optional inner frame, no visible border */}
      <div
        style={{
          position: 'absolute',
          inset: '12% 6% 8% 6%',
          border: 'none',
          borderRadius: '18px',
        }}
      />

      {/* formation label */}
      <div
        style={{
          position: 'absolute',
          top: '4%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.8rem',
          fontWeight: 800,
          letterSpacing: '0.15em',
          textShadow: '0 3px 6px rgba(0,0,0,0.8)',
        }}
      >
        4-3-2-1
      </div>

      {/* players */}
      {positions4321.map((p) => (
        <div
          key={p.num}
          style={{
            position: 'absolute',
            top: `${p.top}%`,
            left: `${p.left}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              // no background color here so the pitch shows through png transparency
            }}
          >
            <img
              src="/shirt.png"              // put shirt.png in public/
              alt={`Shirt ${p.num}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />

            {/* number overlay */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                color: '#ffffffff',
              }}
            >
              {p.num}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormationPitch;
