import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../contexts/AuthContext';

const AlertMessage = ({ children, type = 'warning' }) => {
  const colors = {
    warning: 'text-yellow-800 border-yellow-300 bg-yellow-50',
    error: 'text-red-800 border-red-300 bg-red-50',
    info: 'text-blue-800 border-blue-300 bg-blue-50'
  };

  return (
    <div className={`flex items-center p-4 mb-4 border rounded-lg ${colors[type]}`}>
      <AlertCircle className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Load stored login attempts and lockout time
  useEffect(() => {
    const loadLoginAttempts = () => {
      const storedAttempts = localStorage.getItem('loginAttempts');
      const storedLockoutEnd = localStorage.getItem('lockoutEndTime');
      
      if (storedAttempts) {
        setLoginAttempts(parseInt(storedAttempts));
      }
      
      if (storedLockoutEnd) {
        const lockoutTime = parseInt(storedLockoutEnd);
        if (lockoutTime > Date.now()) {
          setLockoutEndTime(lockoutTime);
        } else {
          // Clear expired lockout
          localStorage.removeItem('lockoutEndTime');
          localStorage.removeItem('loginAttempts');
        }
      }
    };

    loadLoginAttempts();
  }, []);

  const updateLoginAttempts = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockoutEnd = Date.now() + LOCKOUT_DURATION;
      setLockoutEndTime(lockoutEnd);
      localStorage.setItem('lockoutEndTime', lockoutEnd.toString());
    }
  };

  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setLockoutEndTime(null);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutEndTime');
  };

  const getRemainingLockoutTime = () => {
    if (!lockoutEndTime) return null;
    const remaining = Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60);
    return remaining > 0 ? remaining : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate Villanova email
    if (!formData.email.endsWith('@villanova.edu')) {
      setError('Please use your Villanova email address');
      return;
    }

    const remainingTime = getRemainingLockoutTime();
    if (remainingTime) {
      setError(`Account is locked. Please try again in ${remainingTime} minutes.`);
      return;
    }

    setIsLoading(true);

    try {
      // Attempt login
      const userCredential = await login(formData.email, formData.password);
      
      // Verify admin status
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (!adminDoc.exists()) {
        throw new Error('Unauthorized access');
      }

      // Check if account is active
      if (adminDoc.data().status !== 'ACTIVE') {
        throw new Error('Account is deactivated');
      }

      // Update last login information
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        await updateDoc(doc(db, 'admins', userCredential.user.uid), {
          lastLogin: new Date(),
          lastLoginIP: ipData.ip
        });
      } catch (error) {
        console.error('Error updating login metadata:', error);
      }

      // Reset login attempts and navigate
      resetLoginAttempts();
      navigate('/admin');
    } catch (error) {
      updateLoginAttempts();
      if (loginAttempts + 1 >= MAX_ATTEMPTS) {
        setError(`Maximum login attempts exceeded. Account locked for 30 minutes.`);
      } else {
        setError(`${error.message}. ${MAX_ATTEMPTS - (loginAttempts + 1)} attempts remaining.`);
      }
      setIsLoading(false);
    }
  };

  const remainingTime = getRemainingLockoutTime();
  const attemptsRemaining = MAX_ATTEMPTS - loginAttempts;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {attemptsRemaining < MAX_ATTEMPTS && !remainingTime && (
            <AlertMessage type="warning">
              Warning: {attemptsRemaining} login attempts remaining
            </AlertMessage>
          )}

          {error && (
            <AlertMessage type="error">
              {error}
            </AlertMessage>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={remainingTime !== null}
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={remainingTime !== null}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || remainingTime !== null}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                (isLoading || remainingTime !== null) ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 
               remainingTime ? `Locked (${remainingTime}m remaining)` : 
               'Sign in'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;