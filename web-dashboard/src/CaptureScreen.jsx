import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function CaptureScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header with Flash Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', zIndex: 10 }}>
        <div style={{ color: '#ffffff', fontSize: '24px', cursor: 'pointer' }}>⚡</div>
      </div>

      {/* Camera Viewfinder (Simulated) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Minimalist White Framing Guide */}
        <div style={{ width: '250px', height: '300px', border: '2px solid rgba(255,255,255,0.6)', borderRadius: '12px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '4px solid #fff', borderLeft: '4px solid #fff', borderTopLeftRadius: '12px' }}></div>
          <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '4px solid #fff', borderRight: '4px solid #fff', borderTopRightRadius: '12px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #fff', borderLeft: '4px solid #fff', borderBottomLeftRadius: '12px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #fff', borderRight: '4px solid #fff', borderBottomRightRadius: '12px' }}></div>
        </div>
      </div>

      {/* Bottom Shutter Area */}
      <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '60px' }}>
        {/* Circular Shutter Button */}
        <button 
          onClick={() => navigate('/farmer/result')}
          style={{ width: '72px', height: '72px', borderRadius: '50%', border: '4px solid #ffffff', backgroundColor: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
        >
          <div style={{ width: '54px', height: '54px', backgroundColor: '#ffffff', borderRadius: '50%', margin: 'auto' }}></div>
        </button>
      </div>
      <BottomNav />
    </div>
  );
}