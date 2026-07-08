import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './Header.css';

// This is a helper function (a "custom hook") that detects clicks outside of an element.
// We use it to close the dropdown menu automatically.
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function Header() {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // This ref will be attached to our dropdown menu

  // Use the custom hook to close the menu when clicking anywhere else on the page
  useOnClickOutside(dropdownRef, () => setIsMenuOpen(false));

  return (
    <header className="header-container">
      <Link to="/" className="header-brand">
        Expense Tracker
      </Link>
      <nav className="header-nav" ref={dropdownRef}>
        {/* The Hamburger Menu Button */}
        <button
          className="hamburger-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle the menu's visibility
          aria-label="Open user menu"
        >
          {/* SVG icon for the hamburger menu */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        {/* --- Dropdown Menu --- */}
        {/* This menu only appears if 'isMenuOpen' is true */}
        {isMenuOpen && (
          <div className="dropdown-menu">
            <NavLink
              to="/"
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/settings" // This will be the link to your new settings page
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </NavLink>
            <div className="dropdown-divider"></div>
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="dropdown-item logout-action"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}