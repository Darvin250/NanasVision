import React from 'react';
import BottomNav from './BottomNav';
import TopAppBar from './TopAppBar';

export default function HistoryScreen() {
  // Mock Data
  const historyData = [
    { id: 1, species: 'Josapine AC5', date: 'Oct 24, 2023 - 10:42 AM', synced: true },
    { id: 2, species: 'MD2 AC9', date: 'Oct 24, 2023 - 09:15 AM', synced: true },
    { id: 3, species: 'Moris Gajah', date: 'Oct 23, 2023 - 03:30 PM', synced: true },
  ];

  return (
    <div style={{ backgroundColor: '#e0e0e0', minHeight: '100vh', color: '#101010', paddingBottom: '80px' }}>
      <TopAppBar title="Scan History" />

      {/* Main Body - List View */}
      <div style={{ padding: '20px' }}>
        {historyData.map(item => (
          <div key={item.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            {/* Thumbnail */}
            <div style={{ width: '50px', height: '50px', backgroundColor: '#a0c0e0', borderRadius: '8px', marginRight: '16px', backgroundImage: 'url(https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=100&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            
            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{item.species}</div>
              <div style={{ color: '#888', fontSize: '12px' }}>{item.date}</div>
            </div>
            {item.synced && <div style={{ color: '#4caf50', fontSize: '20px', title: 'Cloud Synced' }}>✓</div>}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}