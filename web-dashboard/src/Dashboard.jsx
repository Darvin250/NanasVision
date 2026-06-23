import React from 'react';
import BottomNav from './BottomNav';

export default function Dashboard() {
  return (
    <div style={{ backgroundColor: '#101010', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '70px' }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>Dashboard</h1>
        <p style={{ fontSize: '18px', color: '#aaa' }}>
          This page is currently not available and in developement. Stay tuned for future updates and features that will enhance your experience with NanasVision.
        </p>
      </div>
      <BottomNav />
    </div>
  );
}