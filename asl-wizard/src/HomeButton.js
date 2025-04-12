// HomeButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeButton() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          padding: '0.4rem 1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        🏠 Home
      </button>
    </div>
  );
}
