// src/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

import NanasVisionLogo from './assets/NanasVision_Logo_Word.png';
import GoogleLogo from './assets/Google_Logo.svg'; // Assumes you have this local asset

export default function Login() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect user if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(userRole === 'admin' ? '/admin' : '/farmer');
    }
  }, [currentUser, userRole, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // After successful sign-in, the onAuthStateChanged listener in
      // AuthContext will handle user creation and navigation.
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={NanasVisionLogo} alt="NanasVision Logo" style={styles.logo} />
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>
          Sign in to access your pineapple cultivar analysis dashboard.
        </p>
        <button onClick={handleGoogleSignIn} style={styles.googleButton}>
          <img src={GoogleLogo} alt="Google" style={styles.googleIcon} />
          Sign in with Google
        </button>
        <p style={styles.footer}>
          &copy; {new Date().getFullYear()} NanasVision. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// --- Styles ---
// Using a style object for better organization and reusability
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '380px',
    margin: '20px',
  },
  logo: {
    width: '220px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#101010',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 32px 0',
    lineHeight: '1.5',
  },
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #d0d0d0',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    cursor: 'pointer',
    transition: 'background-color 0.2s, box-shadow 0.2s',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
    marginRight: '12px',
  },
  footer: {
    marginTop: '32px',
    fontSize: '12px',
    color: '#999',
  },
};
