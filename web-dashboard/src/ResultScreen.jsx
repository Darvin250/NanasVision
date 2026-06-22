import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function ResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state, with fallbacks for direct access/testing
  const { prediction, image } = location.state || {};
  const cultivar = prediction?.cultivar || 'MD2 AC9';
  const confidence = prediction?.confidence * 100 || 94;
  const imageUrl = image || 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80';

  return (
    <div style={{ backgroundColor: '#101010', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Half - Captured Photo Placeholder */}
      <div style={{ flex: 1, backgroundColor: '#333', backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      </div>

      {/* Bottom Half - Crisp White Card */}
      <div style={{ backgroundColor: '#ffffff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '30px 20px 90px 20px', marginTop: '-20px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ color: '#101010', fontSize: '28px', margin: '0 0 16px 0', fontWeight: '800' }}>{cultivar}</h2>
        
        {/* Confidence Score Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#555', fontSize: '14px', fontWeight: 'bold' }}>Confidence Score</span>
            <span style={{ color: '#e0a040', fontSize: '14px', fontWeight: 'bold' }}>{confidence.toFixed(0)}%</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${confidence}%`, backgroundColor: '#e0a040', borderRadius: '4px' }}></div>
          </div>
        </div>

        {/* Field Notes Input */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', color: '#555', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Field Notes (Optional)</label>
          <textarea
            rows="3" placeholder="Add any observations..."
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={() => navigate('/farmer/history')}
          style={{ backgroundColor: '#4060a0', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '18px', fontWeight: 'bold', width: '100%', cursor: 'pointer', boxShadow: '0 4px 6px rgba(64, 96, 160, 0.3)' }}
        >
          Save Record
        </button>
      </div>
      <BottomNav />
    </div>
  );
}