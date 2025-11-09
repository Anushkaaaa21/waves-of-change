import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navLinks = isAuthenticated 
    ? [
        { path: '/home', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/donate', label: 'Donate' },
        { path: '/user', label: 'Profile' },
      ]
    : [
        { path: '/home', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/donate', label: 'Donate' },
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register', isPrimary: true }
      ];

  return (
    <nav className="marine-navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/home" className="nav-logo">
          <span className="logo-text">Waves of Change</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-desktop">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`
                    nav-link 
                    ${location.pathname === link.path ? 'nav-link-active' : ''}
                    ${link.isPrimary ? 'nav-link-primary' : ''}
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <button 
                  onClick={handleLogout}
                  className="nav-link nav-link-logout"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;