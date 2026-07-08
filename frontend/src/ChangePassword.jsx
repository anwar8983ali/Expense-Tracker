import React, { useState } from 'react';
import api from './api/axios';
import './ChangePassword.css';

export default function ChangePassword() {
  const [view, setView] = useState('initial');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const res = await api.post('/api/users/request-password-otp', {});
      setMessage(res.data.message);
      setView('otp');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error requesting OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await api.post('/api/users/reset-password-with-otp', { otp, newPassword });
      setMessage(res.data.message);
      setView('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- FIX: Make the OTP input only accept numbers ---
  const handleOtpChange = (e) => {
    const value = e.target.value;
    // This regex removes any character that is not a digit
    const numericValue = value.replace(/[^0-9]/g, '');
    // We only update the state if the value is 6 digits or less
    if (numericValue.length <= 6) {
      setOtp(numericValue);
    }
  };

  if (view === 'success') {
    return (
      <div className="change-password-container">
        <h3>Password Changed</h3>
        <p className="message success">{message}</p>
        <button onClick={() => setView('initial')} className="action-button">Done</button>
      </div>
    );
  }

  if (view === 'otp') {
    return (
      <div className="change-password-container">
        <h3>Enter OTP</h3>
        <p className="message info">{message}</p>
        <form onSubmit={handleResetPassword} className="otp-form">
          <div className="form-group">
            <label>6-Digit OTP from Email</label>
            <input 
              type="text" 
              value={otp} 
              onChange={handleOtpChange} 
              required 
              disabled={isLoading}
              autoComplete="one-time-code" // Hint for browsers
              inputMode="numeric" // Hint for mobile keyboards
              pattern="[0-9]{6}" // Enforce 6 digits
              maxLength="6"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              disabled={isLoading} 
            />
          </div>
          <div className="button-group">
            <button type="button" onClick={() => setView('initial')} className="btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="action-button" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // The initial view
  return (
    <div className="change-password-container">
      <h3>Security</h3>
      <p>Change your account password by verifying your identity with an OTP.</p>
      {message && <p className="message error">{message}</p>}
      <button onClick={handleRequestOtp} className="action-button" disabled={isLoading}>
        {isLoading ? 'Sending OTP...' : 'Change Password'}
      </button>
    </div>
  );
}