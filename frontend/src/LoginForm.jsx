import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import './AuthForm.css';

// It now receives an 'onForgotPassword' function as a prop
export default function LoginForm({ onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // We get the 'login' function and the global 'error' state from our "brain"
  const { login, error } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(email, password); // Attempt to log in
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Display the error message from the context if it exists */}
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="login-email" className="form-label">Email Address</label>
        <input
          type="email"
          id="login-email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="login-password" className="form-label">Password</label>
        <input
          type="password"
          id="login-password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* --- THIS IS THE KEY CHANGE --- */}
      {/* The "Forgot Password?" link only appears if there is a login error */}
      {error && (
        <div className="forgot-password">
          <a href="#" onClick={onForgotPassword}>Forgot Password?</a>
        </div>
      )}

      <button type="submit" className="submit-button">
        Login
      </button>
    </form>
  );
}