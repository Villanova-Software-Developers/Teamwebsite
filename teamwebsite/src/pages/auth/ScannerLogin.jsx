import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ScannerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const q = query(
        collection(db, 'scanner_users'),
        where('username', '==', username.trim().toLowerCase())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error('Invalid credentials');
      }

      const userDoc = snapshot.docs[0].data();

      if (userDoc.active === false) {
        throw new Error('Account is disabled');
      }

      await login(userDoc.email, password);
      navigate('/scan');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-emerald-400">Scanner Access</h1>
          <p className="text-slate-400 text-sm mt-1">UTS Classroom Technology</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScannerLogin;
