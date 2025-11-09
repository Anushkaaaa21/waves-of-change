import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="marine-theme-page">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div className="about-content" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>

          {/* Hero Section with Image */}
          <div className="about-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <img 
              src="https://saveourseas.com/sosf-shark-education-centre/wp-content/uploads/sites/3/20220411-image01danelwentzel-copyright.jpg"
              alt="Ocean Conservation" 
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '15px',
                marginBottom: '2rem'
              }}
            />
            <h1 style={{ color: '#0077b6', fontSize: '3rem', marginBottom: '1rem' }}>About Waves of Change</h1>
            <p style={{ color: '#718096', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
              Waves of Change is a global marine conservation organization dedicated to protecting our oceans and marine ecosystems. Founded by passionate marine scientists and conservationists, we mobilize communities to take action against ocean pollution, habitat destruction, and climate change impacts.
            </p>
          </div>

          {/* Mission Section with Image Below Paragraph */}
          <div className="mission-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', marginTop: '3rem' }}>
            <div>
              <h2 style={{ color: '#0077b6', marginBottom: '1rem' }}>Our Mission</h2>
              <p style={{ color: '#4a5568', lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'center' }}>
                To protect and restore marine ecosystems through community-driven conservation, scientific research, and sustainable solutions that create lasting positive change for our oceans and the communities that depend on them.
              </p>
            </div>
            <div style={{ width: '100%' }}>
              <img 
                src="https://imgs.search.brave.com/a0D1CF-W48WyDS8ygiFnwKdSYrdlV0Kharo_XMEh3IQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/b2NlYW5zLXJlc2Vh/cmNoLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNS8wMS9T/dXBwb3J0LU9jZWFu/LUNvbnNlcnZhdGlv/bi1Pcmdhbml6YXRp/b25zLmpwZw"
                alt="Beach Cleanup Mission"
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '15px'
                }}
              />
            </div>
          </div>

          {/* Impact Section with Background Image */}
          <div className="stats-section" style={{ marginTop: '3rem' }}>
            <div style={{
              background: 'linear-gradient(rgba(0,60,100,0.8), rgba(0,120,180,0.8)), url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '15px',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <h2 style={{ color: 'white', marginBottom: '2rem', fontSize:'2.5rem', textAlign: 'center' }}>Our Impact</h2>
              <div className="impact-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                textAlign: 'center'
              }}>
                <div className="impact-item">
                  <div style={{ fontSize: '2.0rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>10,000+</div>
                  <div style={{ color: 'rgba(255,255,255,0.9)' }}>Volunteers Worldwide</div>
                </div>
                <div className="impact-item">
                  <div style={{ fontSize: '2.0rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>500+</div>
                  <div style={{ color: 'rgba(255,255,255,0.9)' }}>Conservation Projects</div>
                </div>
                <div className="impact-item">
                  <div style={{ fontSize: '2.0rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>50+</div>
                  <div style={{ color: 'rgba(255,255,255,0.9)' }}>Coastal Communities</div>
                </div>
                <div className="impact-item">
                  <div style={{ fontSize: '2.0rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>5</div>
                  <div style={{ color: 'rgba(255,255,255,0.9)' }}>Countries Reached</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;