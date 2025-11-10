import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <--- Import useAuth from AuthContext

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// REMOVE ALL THESE INCORRECT IMPORTS! They belong in App.js, not LoginPage.js
// import Navbar from './components/NavBar';
// import HomePage from './pages/HomePage';
// import UserPage from './pages/UserPage';
// import RegisterPage from './pages/RegisterPage';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import './index.css'; // This usually belongs in index.js or App.js, not a page component
// import AboutUsPage from './pages/AboutUsPage';
// import DonationsPage from './pages/DonationPage';


// Remove the 'onLogin' prop, as it's no longer passed from App.js
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the login function from AuthContext
  const { login } = useAuth(); // <--- Use the login function from AuthContext
  const navigate = useNavigate(); // Still need useNavigate for manual redirection after successful login

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the login function from AuthContext, which internally handles API call and token storage
      const result = await login(formData.email, formData.password); // Call login from AuthContext

      if (result.success) {
        console.log("Login successful! Token:", localStorage.getItem('token')); // Token is stored by AuthContext
        // AuthContext's login function already handles navigation on success,
        // so you might not need this navigate('/home') here unless you want
        // to override AuthContext's default behavior.
        // For consistency, let AuthContext handle navigation.
        // navigate('/home'); // AuthContext usually handles this.
      } else {
        // If AuthContext's login returns success: false
        setError(result.message || 'Login failed.');
        console.error('Login error:', result.message);
      }

    } catch (err) {
      // This catch block might not be strictly necessary if AuthContext's login handles all errors
      // But it's good for network issues *before* the login function is even called reliably.
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marine-theme-page">
      <div className="auth-container">
        <div className="auth-box">
          {/* Header Section */}
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="form-input"
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>
            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
            <button type="submit" className="auth-btn primary" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button type="button" className="social-btn google">
              Continue with Google
            </button>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;