// src/Login.jsx
import React, { useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Login() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect users to their respective dashboards if already logged in
  useEffect(() => {
    if (currentUser && userRole) {
      if (userRole === 'admin') navigate('/admin');
      else navigate('/farmer');
    }
  }, [currentUser, userRole, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: '#e0e0e0', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#101010', position: 'relative', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        {/* Clean Minimalist Logo */}
        <div style={{ width: '80px', height: '80px', backgroundColor: '#4060a0', borderRadius: '50%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>NV</div>
        
        <h1 style={{ fontSize: '32px', marginBottom: '8px', fontWeight: '800' }}>NanasVision</h1>
        <p style={{ fontSize: '16px', marginBottom: '48px', color: '#555' }}>Identify Pineapple Cultivars seamlessly.</p>
        
        <button 
          onClick={handleGoogleSignIn} 
          style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', color: '#101010', border: 'none', borderRadius: '24px', padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          {/* Google G Icon */}
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px', height: '24px', marginRight: '12px' }} />
          Sign in with Google
        </button>
      </div>
      
      {/* Abstract Wave / Leaf Pattern at the bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%', backgroundColor: '#a0c0e0', borderTopLeftRadius: '50% 100%', borderTopRightRadius: '50% 100%', opacity: 0.6, zIndex: 0 }}></div>
    </div>
  );
}
