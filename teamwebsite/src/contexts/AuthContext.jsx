import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'; // We keep Firebase imports for future use if needed
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration (still included in case you want to extend or modify)
const firebaseConfig = {
  apiKey: "AIzaSyCbIrfqY1J-LoPQG1w0Z3PHKY050P3JY-Y",
  authDomain: "villanova-software-engineers.firebaseapp.com",
  projectId: "villanova-software-engineers",
  storageBucket: "villanova-software-engineers.firebasestorage.app",
  messagingSenderId: "975272925438",
  appId: "1:975272925438:web:6f0c66421ab1737478edaf",
  measurementId: "G-11DGT8YF7E"
};

// Initialize Firebase (this can remain for analytics or future Firebase features)
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // This can be kept for future use

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here we are assuming the user is logged out when there's no valid session.
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Temporary hardcoded login check
    if (email === 'admin@gmail.com' && password === 'password') {
      const mockUser = { email: 'admin@example.com', uid: 'admin123' }; // Mock user object
      setUser(mockUser);
      return mockUser;
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    try {
      setUser(null); // Clear user state
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
