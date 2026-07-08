
import React from 'react';
import { NavLink, Routes, Route, Outlet } from 'react-router-dom';
import Header from './/Header';
import './SettingsPage.css';
import AccountDetails from './AccountDetails'; // We will create this next

export default function SettingsPage() {
  return (
    <div className="settings-page-container">
      <Header />
      <main className="settings-main-content">
        <div className="settings-layout">
          {/* --- Sidebar Navigation --- */}
          <aside className="settings-sidebar">
            <h2>Settings</h2>
            <nav className="settings-nav">
              <NavLink to="/settings/account" className="settings-nav-link">
                Account Details
              </NavLink>
              <NavLink to="/settings/preferences" className="settings-nav-link">
                Preferences
              </NavLink>
              <NavLink to="/settings/security" className="settings-nav-link">
                Security
              </NavLink>
            </nav>
          </aside>

          {/* --- Content Area --- */}
          {/* This is where the different setting components will be rendered */}
          <div className="settings-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}