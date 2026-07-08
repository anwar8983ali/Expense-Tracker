import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import './AuthForm.css';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // For local success/error messages
  const { signup, error, setError } = useAuth(); // Get the signup function and error state from the brain

  // Clear errors when the user starts typing in any field
  const handleFocus = () => {
    setError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleFocus(); // Clear old messages

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      // This is the important part: we call the signup function from our context
      await signup(email, password);
      setMessage('Registration successful! Please switch to the Login tab.');
    } catch (err) {
      // The error is already set in the context from the backend,
      // so we just let it be displayed.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Show the global error from the context OR a local message like 'passwords do not match' */}
      {error ? <p className="error-message">{error}</p> : null}
      {message && <p className={message.includes('successful') ? "success-message" : "error-message"}>{message}</p>}

      <div className="form-group">
        <label htmlFor="signup-email" className="form-label">Email Address</label>
        <input
          type="email"
          id="signup-email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="signup-password" className="form-label">Password</label>
        <input
          type="password"
          id="signup-password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={handleFocus}
          required
        />
      </div>
       <div className="form-group">
        <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          className="form-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={handleFocus}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Create Account
      </button>
    </form>
  );
}
