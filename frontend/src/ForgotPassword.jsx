import React, { useState } from 'react';
import api from './api/axios';
import './AuthForm.css'; // We can reuse the same form styles

// This component receives a function to go back to the login view
export default function ForgotPassword({ onBackToLogin }) {
  // 'view' state controls which part of the process is shown
  const [view, setView] = useState('enterEmail'); // 'enterEmail' or 'enterOtp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Handler for the first step: Requesting the OTP ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setView('enterOtp'); // Switch to the next step
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handler for the second step: Verifying OTP and resetting password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await api.post('/api/auth/reset-password', { email, otp, newPassword });
      setMessage(res.data.message);
      // You could add a 'success' view or automatically switch back to login
    } catch (error) {
       setMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
        setIsLoading(false);
    }
  };
  
  // If we are in the 'enterOtp' view, show that form
  if (view === 'enterOtp') {
    return (
      <div>
        <h4>Reset Password</h4>
        <p className="message info">{message}</p>
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>OTP from Email</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isLoading} />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          <a href="#" onClick={onBackToLogin} className="back-link">Back to Login</a>
        </form>
      </div>
    );
  }

  // Otherwise, show the initial 'enterEmail' form
  return (
    <div>
      <h4>Forgot Password</h4>
      <p>Enter your email and we'll send an OTP to reset your password.</p>
      {message && <p className="message error">{message}</p>}
      <form onSubmit={handleRequestOtp}>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading}/>
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
        <a href="#" onClick={onBackToLogin} className="back-link">Back to Login</a>
      </form>
    </div>
  );
}