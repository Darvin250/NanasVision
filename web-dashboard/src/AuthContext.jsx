// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'farmer'
  const [loading, setLoading] = useState(true);

  // Check for the environment variable to skip login for development
  const SKIP_LOGIN = import.meta.env.VITE_SKIP_LOGIN === 'true';

  useEffect(() => {
    if (SKIP_LOGIN) {
      console.warn("--- DEVELOPMENT MODE: LOGIN SKIPPED ---");
      // Create a mock user object that has the properties your app expects
      setCurrentUser({
        uid: 'mock-farmer-uid-123',
        displayName: 'Dev Farmer',
        email: 'dev@nanasvision.com',
      });
      // Set a default role for testing
      setUserRole('farmer');
      setLoading(false);
      // Return a no-op function because there's no Firebase listener to unsubscribe from
      return () => {};
    }

    // Original Firebase authentication logic
    const unsubscribe = onAuthStateChanged(auth, async (user) => { 
      if (user) {
        // Look up the user's document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          // If the user doesn't exist, create them and default to 'farmer'
          await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            role: 'farmer',
            createdAt: new Date()
          });
          setUserRole('farmer');
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
