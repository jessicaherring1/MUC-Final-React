// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleLevelClick = (levelPath) => {
    const confirmLeave = window.confirm("Are you sure you want to leave this page and go to the selected level?");
    if (confirmLeave) {
      navigate(levelPath);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Welcome to PopSign ASL</h1>
      <p style={{ marginBottom: '2rem', color: '#555' }}>Select a level to begin practicing ASL:</p>
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
        <button onClick={() => handleLevelClick('/level0')} style={{ padding: '0.75rem' }}>Level 0: First Signs</button>
        <button onClick={() => handleLevelClick('/level1')} style={{ padding: '0.75rem' }}>Level 1: Drag and Drop</button>
        <button onClick={() => handleLevelClick('/level2')} style={{ padding: '0.75rem' }}>Level 2: Type Your Translation</button>
        <button onClick={() => handleLevelClick('/level3')} style={{ padding: '0.75rem' }}>Level 3: Sign with Video</button>
      </div>
    </div>
  );
}

export default HomePage;
