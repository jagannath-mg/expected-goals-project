const Loader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

    {/* Spinning ring + logo */}
    <div style={{ position: 'relative', width: '64px', height: '64px' }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        border: '3px solid #1e2535',
        borderTop: '3px solid #3b82f6',
        borderRight: '3px solid #10b981',
        animation: 'spin 1s linear infinite',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src="/xg_logo.png"
          alt="xG Analyzer"
          style={{
            width: '42px', height: '42px',
            borderRadius: '10px', objectFit: 'cover',
          }}
        />
      </div>
    </div>

    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9',
        letterSpacing: '0.15em', marginBottom: '0.4rem'
      }}>
        xG ANALYZER
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', letterSpacing: '0.1em' }}>
        LOADING...
      </div>
    </div>

    {/* Progress bar */}
    <div style={{ width: '160px', height: '3px', background: '#1e2535', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: '40%',
        background: 'linear-gradient(90deg, #3b82f6, #10b981)',
        borderRadius: '2px',
        animation: 'progress 1.4s ease-in-out infinite',
      }} />
    </div>

    <style>{`
      @keyframes spin     { to { transform: rotate(360deg); } }
      @keyframes progress { 0%   { transform: translateX(-100%); width: 40%; }
                            100% { transform: translateX(400%);  width: 40%; } }
    `}</style>
  </div>
);

export default Loader;
