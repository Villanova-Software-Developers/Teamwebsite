import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';

const AlertMessage = ({ children }) => (
  <div className="flex items-center p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50">
    <AlertCircle className="w-5 h-5 mr-2" />
    <span className="text-sm font-medium">{children}</span>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  useEffect(() => {
    // Check localStorage for existing attempts and lockout
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const remainingTime = getRemainingLockoutTime();
    if (remainingTime) {
      setError(`Account is locked. Please try again in ${remainingTime} minutes.`);
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      resetLoginAttempts();
      navigate('/admin');
    } catch (error) {
      updateLoginAttempts();
      if (loginAttempts + 1 >= MAX_ATTEMPTS) {
        setError(`Maximum login attempts exceeded. Account locked for 30 minutes.`);
      } else {
        setError(`${error.message}. ${MAX_ATTEMPTS - (loginAttempts + 1)} attempts remaining.`);
      }
    } finally {
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
            <AlertMessage>
              Warning: {attemptsRemaining} login attempts remaining
            </AlertMessage>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={remainingTime !== null}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={remainingTime !== null}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || remainingTime !== null}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  (isLoading || remainingTime !== null) ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : remainingTime ? `Locked (${remainingTime}m remaining)` : 'Sign in'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;