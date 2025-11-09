// src/pages/HomePage.js - Only the relevant changes

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../index.css";

const HomePage = () => {
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [errorOpportunities, setErrorOpportunities] = useState(null);
  const [alert, setAlert] = useState(null);

  const { isAuthenticated, user } = useAuth();

  const impactStats = [
    { number: "10,000+", label: "Volunteers Mobilized" },
    { number: "500+", label: "Projects Completed" },
    { number: "50+", label: "Communities Served" },
    { number: "5", label: "Countries Active" },
  ];

  // Fetch real opportunities from your backend
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch('/api/opportunities'); // <--- Call your backend API
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        const data = await response.json();
        setVolunteerOpportunities(data);
        setLoadingOpportunities(false);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setErrorOpportunities("Failed to load opportunities.");
        setLoadingOpportunities(false);
      }
    };
    fetchOpportunities();
  }, []); // Run once on component mount

  const handleSignUpForOpportunity = async (opportunityId) => {
    if (!isAuthenticated) {
      setAlert({ type: 'error', message: 'Please log in to sign up for opportunities.' });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAlert({ type: 'error', message: 'Authentication token not found. Please log in again.' });
        setTimeout(() => setAlert(null), 5000);
        return;
      }

      const response = await fetch(`/api/user-opportunities`, { // <--- This is the new endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ opportunityId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || `HTTP error! status: ${response.status}`);
      }

      setAlert({ type: 'success', message: 'Successfully signed up for the opportunity!' });
      setTimeout(() => setAlert(null), 5000);

    } catch (error) {
      console.error("Error signing up for opportunity:", error);
      setAlert({ type: 'error', message: error.message || 'Failed to sign up for opportunity. Please try again.' });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    // ... rest of your existing JSX code ...
    <div className="marine-theme-page">
      {/* Alert Display */}
      {alert && (
        <div className={`alert-message ${alert.type}`}>
          {alert.message}
          <button onClick={() => setAlert(null)} className="alert-close-btn">&times;</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Protecting Our Ocean for Future Generations</h1>
          <p>
            Join Waves of Change in our mission to create a healthy ocean—one
            that sustains us and thrives for generations to come.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="cta-button cta-button-secondary">Join Us Now</Link>
          </div>
        </div>
      </section>

      <div className="home-container">
        {/* Impact Section */}
        <section className="impact-section">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            {impactStats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            To protect and restore marine ecosystems through community-driven
            conservation, scientific research, and sustainable solutions that
            create lasting positive change for our oceans.
          </p>
          <Link to="/about" className="link-more">
            Learn about our work ›
          </Link>
        </section>

        {/* Opportunities Section */}
        <section className="opportunities-section">
          <h2>Get Involved</h2>
          <div className="opportunities-grid">
            {loadingOpportunities ? (
              <p>Loading volunteer opportunities...</p>
            ) : errorOpportunities ? (
              <p className="error-message">{errorOpportunities}</p>
            ) : volunteerOpportunities.length > 0 ? (
              volunteerOpportunities.map((opportunity) => (
                <div key={opportunity._id} className="opportunity-card">
                  <h3>{opportunity.title}</h3>
                  <p>{opportunity.description}</p>
                  <div className="opportunity-details">
                    <p><strong>Location:</strong> {opportunity.location}</p>
                    <p><strong>Duration:</strong> {opportunity.duration}</p>
                    <p><strong>Volunteers Needed:</strong> {opportunity.volunteersNeeded}</p>
                  </div>
                  {isAuthenticated ? (
                    <button
                      onClick={() => handleSignUpForOpportunity(opportunity._id)}
                      className="volunteer-btn"
                    >
                      Sign Up Now
                    </button>
                  ) : (
                    <Link to="/login" className="volunteer-btn">
                      Log In to Sign Up
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <p>No volunteer opportunities found at the moment.</p>
            )}
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Join thousands of volunteers working to protect our oceans and
            marine life.
          </p>
          <div className="cta-buttons">
            <Link to="/donate" className="cta-button cta-button-secondary">
              Support Us
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Waves of Change. All rights reserved.</p>
          <p>Together, we create waves of positive change for our oceans.</p>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/donate">Donate</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;