import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/farmer', icon: '🏠' },
    { label: 'Cultivar', path: '/farmer/cultivars', icon: '🍍' },
    { label: 'Scanner', path: '/farmer/capture', icon: '📷' },
    { label: 'Logs', path: '/farmer/history', icon: '📋' },
    { label: 'Dashboard', path: '/farmer/dashboard', icon: '📊' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, width: '100%',
      backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-around',
      padding: '12px 0', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', 
      boxShadow: '0 -4px 14px rgba(0,0,0,0.1)', zIndex: 9999, boxSizing: 'border-box'
    }}>
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <div 
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              color: isActive ? '#4060a0' : '#888888', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: isActive ? 'bold' : 'normal' }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}