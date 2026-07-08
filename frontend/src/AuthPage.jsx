import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPassword from './ForgotPassword'; // We will create this next
import './AuthPage.css';

export default function AuthPage() {
  // This state controls which view is visible: 'login', 'signup', or 'forgot'
  const [view, setView] = useState('login');

  // This function decides which component to render based on the 'view' state
  const renderView = () => {
    switch (view) {
      case 'signup':
        return <SignupForm />;
      case 'forgot':
        // The ForgotPassword component needs a function to go back to the login screen
        return <ForgotPassword onBackToLogin={() => setView('login')} />;
      case 'login':
      default:
        // The LoginForm receives a function to switch to the forgot password screen
        return <LoginForm onForgotPassword={() => setView('forgot')} />;
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Only show the Login/Signup tabs if we are not in the 'forgot password' view */}
        {view !== 'forgot' && (
          <div className="auth-tabs">
            <button
              className={`tab-button ${view === 'login' ? 'active' : ''}`}
              onClick={() => setView('login')}
            >
              Login
            </button>
            <button
              className={`tab-button ${view === 'signup' ? 'active' : ''}`}
              onClick={() => setView('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        <div className="form-container">
          {renderView()}
        </div>
      </div>
    </div>
  );
}