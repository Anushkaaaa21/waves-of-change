// DonationsPage.js
import React, { useState } from 'react';
import axios from 'axios'; // <-- IMPORT AXIOS
// import { useNavigate } from 'react-router-dom'; // Uncomment if you want to redirect after donation

const DonationsPage = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // <-- NEW STATE: To prevent double submissions
  const [error, setError] = useState(null); // <-- NEW STATE: To display potential errors
  // const navigate = useNavigate(); // Uncomment if you want to redirect after donation

  const presetAmounts = [25, 50, 100, 250, 500];

  const handleDonationSubmit = async (e) => { // <-- MAKE FUNCTION ASYNC
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsSubmitting(true); // Disable button during submission

    const amount = customAmount ? parseFloat(customAmount) : parseFloat(donationAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('Please select or enter a valid donation amount.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Get token from localStorage (assuming it's stored there after login)
      const token = localStorage.getItem('token');

      // Prepare headers
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // If a token exists, add it to the headers for authentication
      if (token) {
        config.headers['x-auth-token'] = token;
      } else {
        // Optionally, if you require login for donations,
        // you could redirect here or show an error
        alert('You need to be logged in to make a donation.');
        // navigate('/login'); // Uncomment to redirect
        setIsSubmitting(false);
        return;
      }

      // Make the API call to your backend
      const res = await axios.post('https://waves-of-change-backend.onrender.com/donations', // <-- YOUR BACKEND ENDPOINT
        { amount: amount, currency: 'USD' }, // <-- DATA TO SEND (adjust currency if needed)
        config // <-- INCLUDE HEADERS WITH TOKEN
      );

      console.log('Donation successful:', res.data);
      alert(`Thank you for your donation of $${amount}! We appreciate your support.`);

      // Reset form fields after successful donation
      setDonationAmount('');
      setCustomAmount('');
      // navigate('/thank-you-page'); // Example: redirect to a thank you page
    } catch (err) {
      console.error('Error submitting donation:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || 'Failed to process donation. Please try again.');
      alert(`Donation failed: ${err.response?.data?.msg || 'Something went wrong. Please try again.'}`);
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <div className="marine-theme-page">
      <div
        className="container"
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
      >
        <div
          className="donation-content"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '3rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div
            className="donation-header"
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h1 style={{ color: '#0077b6', fontSize: '3rem', marginBottom: '1rem' }}>
              Support Our Mission
            </h1>
            <p
              style={{
                color: '#718096',
                fontSize: '1.2rem',
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
              Your donation helps us protect marine ecosystems, clean our oceans, and
              educate communities worldwide
            </p>
          </div>

          <div
            className="donation-sections"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}
          >
            {/* Impact Section */}
            <div className="impact-section">
              <h2 style={{ color: '#0077b6', marginBottom: '2rem' }}>Your Impact</h2>
              <div
                className="impact-list"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div
                  className="impact-item"
                  style={{
                    background: 'linear-gradient(135deg, #caf0f8, #90e0ef)',
                    padding: '1.5rem',
                    borderRadius: '10px',
                  }}
                >
                  <h3 style={{ color: '#0077b6', marginBottom: '0.5rem' }}>$25</h3>
                  <p style={{ color: '#4a5568', margin: 0 }}>
                    Provides cleanup supplies for 5 volunteers
                  </p>
                </div>
                <div
                  className="impact-item"
                  style={{
                    background: 'linear-gradient(135deg, #caf0f8, #90e0ef)',
                    padding: '1.5rem',
                    borderRadius: '10px',
                  }}
                >
                  <h3 style={{ color: '#0077b6', marginBottom: '0.5rem' }}>$100</h3>
                  <p style={{ color: '#4a5568', margin: 0 }}>
                    Supports coral restoration for 1 square meter
                  </p>
                </div>
                <div
                  className="impact-item"
                  style={{
                    background: 'linear-gradient(135deg, #caf0f8, #90e0ef)',
                    padding: '1.5rem',
                    borderRadius: '10px',
                  }}
                >
                  <h3 style={{ color: '#0077b6', marginBottom: '0.5rem' }}>$500</h3>
                  <p style={{ color: '#4a5568', margin: 0 }}>
                    Funds educational programs for 50 students
                  </p>
                </div>
              </div>
            </div>

            {/* Donation Form */}
            <div className="donation-form-section">
              <h2 style={{ color: '#0077b6', marginBottom: '2rem' }}>Make a Donation</h2>
              <form onSubmit={handleDonationSubmit} className="donation-form">
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '1rem',
                      fontWeight: '600',
                      color: '#2d3748',
                    }}
                  >
                    Select Amount
                  </label>
                  <div
                    className="amount-buttons"
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      marginBottom: '1rem',
                    }}
                  >
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setDonationAmount(amount.toString());
                          setCustomAmount('');
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          border:
                            donationAmount === amount.toString()
                              ? '2px solid #0077b6'
                              : '2px solid #e2e8f0',
                          background:
                            donationAmount === amount.toString()
                              ? '#0077b6'
                              : 'white',
                          color:
                            donationAmount === amount.toString()
                              ? 'white'
                              : '#0077b6',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="custom-amount" style={{ marginTop: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#2d3748',
                      }}
                    >
                      Or enter custom amount
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setDonationAmount('');
                      }}
                      placeholder="Enter amount"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>
                </div>

                {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>} {/* <-- DISPLAY ERROR */}

                <button
                  type="submit"
                  className="auth-btn primary"
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #0077b6, #0096c7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 119, 182, 0.3)',
                  }}
                  disabled={isSubmitting} // <-- DISABLE BUTTON
                >
                  {isSubmitting ? 'Processing...' : 'Donate Now'} {/* <-- LOADING TEXT */}
                </button>
              </form>

              <div
                className="security-notice"
                style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  background: 'rgba(72, 202, 228, 0.1)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#718096', margin: 0, fontSize: '0.9rem' }}>
                  🔒 Your donation is secure and tax-deductible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationsPage;