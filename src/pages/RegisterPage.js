import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Function to send registration data to the backend
const registerUser = async (userData) => {
  try {
    // Make sure your backend server is running on http://localhost:5000
    // And that it has a POST route at /api/auth/register
    const res = await axios.post('http://waves-of-change-backend.onrender.com/api/auth/register', userData);
    console.log('Backend response:', res.data);
    return res.data; // Return data if needed
  } catch (err) {
    // Log more specific error if available from backend
    console.error('Registration failed:', err.response ? err.response.data : err.message);
    throw err; // Re-throw to be caught by handleSubmit
  }
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    city: '',
    password: '',         // Added password field
    confirmPassword: ''   // Added confirm password field
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const countries = [
    'Select Country',
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'India',
    'Brazil',
    'South Africa'
  ];

  const genders = [
    'Select',
    'Male',
    'Female',
    'Non-binary',
    'Prefer not to say'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => { // Made handleSubmit async
    e.preventDefault();
    
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // --- Password Validation ---
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) { // Example: minimum password length
        alert('Password must be at least 6 characters long!');
        return;
    }
    // --- End Password Validation ---

    console.log('Registration data to send:', formData);

    try {
      // Destructure to remove confirmPassword before sending to backend
      const { confirmPassword, ...dataToSend } = formData;
      
      await registerUser(dataToSend); // Call the backend registration function

      alert('Registration successful! Please log in with your new account.');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      // Error message already logged by registerUser function
      alert(`Registration failed: ${error.response?.data?.message || 'Please check your input.'}`);
    }
  };

  return (
    <div className="marine-theme-page">
      <div className="application-container">
        <div className="application-box">
          {/* Header Section */}
          <div className="application-header">
            <h1>Marine Conservation Volunteer Application</h1>
            <p>Join our efforts to protect and sustain life below water</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="application-form">
            {/* Personal Information Section */}
            <div className="application-section">
              <h2 className="application-section-title">Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="required">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="required">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="required">Email</label>
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
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-input"
                  >
                    {genders.map(gender => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country" className="required">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* NEW SECTION FOR LOGIN CREDENTIALS */}
            <div className="application-section">
              <h2 className="application-section-title">Login Credentials</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="required">Password</label>
                  <input
                    type="password" // Crucial for hiding input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="required">Confirm Password</label>
                  <input
                    type="password" // Crucial for hiding input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="terms-section">
              <label className="checkbox-container terms-checkbox">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <span className="checkmark"></span>
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="inline-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="inline-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Adjusted Submit Button */}
            <div className="form-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="submit" 
                className="auth-btn primary" 
                style={{ 
                  padding: '0.8rem 2rem', 
                  fontSize: '1rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer' 
                }}
              >
                Submit Application
              </button>
              <Link to="/login" className="auth-link back-link" style={{ fontSize: '0.9rem', color: '#0077b6' }}>
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
