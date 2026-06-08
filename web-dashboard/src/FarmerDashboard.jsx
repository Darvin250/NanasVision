import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BottomNav from './BottomNav';

export default function FarmerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#e0e0e0', minHeight: '100vh', color: '#101010', paddingBottom: '70px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '24px', cursor: 'pointer' }}>☰</div>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
          Hello, {currentUser?.displayName?.split(' ')[0] || 'Farmer'}
        </div>
      </div>

      {/* Central Area */}
      <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/farmer/capture')}
          style={{
            backgroundColor: '#e0a040', color: '#ffffff', border: 'none', borderRadius: '12px',
            padding: '20px 40px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer',
            width: '100%', maxWidth: '300px', marginBottom: '40px', boxShadow: '0 4px 10px rgba(224, 160, 64, 0.4)'
          }}
        >
          + New Scan
        </button>

        {/* Summary Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '300px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '16px' }}>Scans Completed Today</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: '800', color: '#4060a0' }}>12</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}