import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import AuthPage from './AuthPage.jsx';
import SettingsPage from './SettingsPage.jsx'; // <-- Import SettingsPage
import AccountDetails from './AccountDetails.jsx'; // <-- Import AccountDetails
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is NOT logged in, only allow access to the AuthPage
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        {/* Any other path will redirect to /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // If the user IS logged in, set up all the protected routes
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* --- This is the new nested route for settings --- */}
      <Route path="/settings" element={<SettingsPage />}>
        {/* Default view for /settings will be the account page */}
        <Route index element={<Navigate to="account" />} />
        <Route path="account" element={<AccountDetails />} />
        {/* You can add more routes here later for preferences, security, etc. */}
        <Route path="preferences" element={<div>Preferences coming soon!</div>} />
        <Route path="security" element={<div>Security settings coming soon!</div>} />
      </Route>
      {/* If a logged-in user tries a non-existent path, redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}