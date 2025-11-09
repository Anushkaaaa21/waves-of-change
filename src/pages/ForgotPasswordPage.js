import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="marine-theme-page">
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-header">
              <div className="success-icon">✓</div>
              <h2>Check Your Email</h2>
              <p>We've sent password reset instructions to your email address.</p>
            </div>

            <div className="success-message">
              <p>If you don't see the email in your inbox, please check your spam folder.</p>
            </div>

            <div className="auth-footer">
              <Link to="/login" className="auth-btn secondary">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="marine-theme-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h2>Reset Password</h2>
            <p>Enter your email to receive reset instructions</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="form-input"
              />
            </div>

            <button type="submit" className="auth-btn primary">
              Send Reset Instructions
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="auth-link">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;