import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null); // <-- Add state for user info
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/auth/status')
      .then(response => {
        setIsLoggedIn(response.data.isLoggedIn);
        setUser(response.data.user); // <-- Save user info on load
        setLoading(false);
      })
      .catch(err => {
        setIsLoggedIn(false);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      setIsLoggedIn(true);
      setUser(response.data.user); // <-- Save user info on login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
      throw err;
    }
  };

  const signup = async (email, password) => {
    try {
      setError('');
      await api.post('/api/auth/register', {
        email,
        password
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed.');
      throw err;
    }
  };

  // --- THIS IS THE NEW LOGOUT FUNCTION ---
  const logout = async () => {
    try {
      // 1. Call the backend to destroy the session
      await api.post('/api/auth/logout', {});
      // 2. Update the state on the frontend
      setIsLoggedIn(false);
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const value = {
    user, // <-- Expose user info
    isLoggedIn,
    loading,
    error,
    setError,
    login,
    signup,
    logout // <-- Expose the new logout function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
