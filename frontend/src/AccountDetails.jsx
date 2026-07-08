import React from 'react';
import { useAuth } from './context/AuthContext';
import './AccountDetails.css';
import ChangePassword from './ChangePassword'; // <-- Import the new component

export default function AccountDetails() {
  const { user } = useAuth();

  return (
    <div className="account-details-container">
      <h3>Account Information</h3>
      <p>This is your personal information. Keep it safe.</p>
      <div className="details-grid">
        <div className="detail-item">
          <label>Email Address</label>
          <span>{user?.email}</span>
        </div>
         <div className="detail-item">
          <label>User ID</label>
          <span>{user?.id}</span>
        </div>
      </div>

      {/* --- Add the new component here --- */}
      <ChangePassword />
    </div>
  );
}
