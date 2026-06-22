import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import NanasVision_Logo from './assets/NanasVision_Logo.png';

export default function TopAppBar({ title }) {
  const { currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigation is handled by ProtectedRoute in App.jsx when currentUser becomes null
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 20px', 
      backgroundColor: '#ffffff', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      position: 'relative',
      zIndex: 50 
    }}>
      {/* Left side: Logo Placeholder & Optional Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          fontWeight: 'bold',
          color: '#888',
          fontSize: '12px'
        }}>
          <img src={NanasVision_Logo} alt="NanasVision Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
        {title && <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{title}</div>}
      </div>

      {/* Right side: User Dropdown */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '8px 12px', 
            borderRadius: '20px',
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {currentUser?.displayName?.split(' ')[0] || 'User'}
          <span style={{ fontSize: '10px' }}>▼</span>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '200px',
            overflow: 'hidden',
            border: '1px solid #eee'
          }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
              <li style={menuItemStyle}>👤 Edit Profile</li>
              <li style={menuItemStyle}>⚙️ App Settings</li>
              <li style={menuItemStyle}>🌐 Language: EN</li>
              <li style={menuItemStyle}>🌙 Dark Mode</li>
              <li style={menuItemStyle}>❓ Help & Support</li>
              <div style={{ height: '1px', backgroundColor: '#eee', margin: '4px 0' }}></div>
              <li onClick={handleLogout} style={{ ...menuItemStyle, color: '#d32f2f' }}>🚪 Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const menuItemStyle = {
  padding: '12px 16px',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  transition: 'background-color 0.2s'
};