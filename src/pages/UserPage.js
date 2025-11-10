import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making HTTP requests to your backend


const UserPage = () => {
  // State to hold user profile data fetched from the backend
  const [userProfile, setUserProfile] = useState(null);
  // State to manage edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for form fields (when editing)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '', // Consider Date type for backend
    gender: '',
    country: '',
    city: ''
  });
  // State for loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // For success/error messages after API calls

  // --- Mock Data (Replace with actual backend calls for volunteer history and upcoming events) ---
  const userVolunteerHistory = [
    { id: 1, event: "Beach Cleanup: Surfers Paradise", date: "2025-11-11", hours: 3, status: "Ongoing" },

  ];

  const upcomingEvents = [
    { id: 1, event: "Ocean Cleanup Drive", date: "2024-02-10", time: "9:00 AM", location: "Coastal Bay" },
    { id: 2, event: "Coral Nursery Planting", date: "2024-02-15", time: "10:00 AM", location: "Blue Lagoon" },
    { id: 3, event: "Sea Turtle Rescue", date: "2024-02-20", time: "8:30 AM", location: "Sandy Beach" }
  ];
  // --- End Mock Data ---

  // --- Helper function to format Date for input[type="date"] ---
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- useEffect to fetch user profile on component mount ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        setError("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMessage(''); // Clear previous messages
        const response = await axios.get('https://waves-of-change-backend.onrender.com/profile/me', {
          headers: {
            'x-auth-token': token
          }
        });
        
        setUserProfile(response.data);
        // Initialize formData with fetched data
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '', // CORRECTED: Completed this line
          phone: response.data.phone || '',
          dateOfBirth: formatDateForInput(response.data.dateOfBirth),
          gender: response.data.gender || '',
          country: response.data.country || '',
          city: response.data.city || ''
        });
      } catch (err) {
        console.error("Error fetching profile:", err.response ? err.response.data : err.message);
        setError(err.response?.data?.msg || "Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this runs once on mount

  // --- Handlers for edit mode and form changes ---
  const handleEditClick = () => {
    setIsEditing(true);
    setMessage(''); // Clear messages when entering edit mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to current userProfile values
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
        gender: userProfile.gender || '',
        country: userProfile.country || '',
        city: userProfile.city || ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Handler for form submission (updating profile) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      setMessage('');
      const response = await axios.put('https://waves-of-change-backend.onrender.com/profile/me', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      setUserProfile(response.data.user); // Update local state with the new user data
      setMessage(response.data.message || "Profile updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error("Error updating profile:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Loading / Error states ---
  if (loading) return <div className="container" style={{maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem'}}>Loading profile...</div>;
  if (error) return <div className="container" style={{maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', color: 'red'}}>Error: {error}</div>;
  if (!userProfile) return <div className="container" style={{maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem'}}>No profile data found.</div>;

  return (
    <div className="marine-theme-page user-page-content">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem' }}>
        {/* Profile Section */}
        <div className="user-profile" style={{ marginBottom: '2rem' }}>
          <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {/* Replaced blue div with img tag */}
            <img 
              src="https://cdn-icons-png.freepik.com/256/8895/8895458.png?semt=ais_white_label" 
              alt="User Avatar" 
              className="profile-avatar" 
              style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <div className="profile-info">
              <h1 style={{ fontSize: '1.6rem', margin: 0 }}>Welcome Back, {userProfile.firstName || 'Ocean Defender'}!</h1>
              <p style={{ fontSize: '0.9rem', color: '#718096', margin: 0 }}>Thank you for protecting our marine ecosystems</p>
            </div>
            {/* Edit Profile Button */}
            {!isEditing && (
              <button
                onClick={handleEditClick}
                style={{
                  marginLeft: 'auto',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  background: '#0077b6',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {message && <p style={{ color: 'green', backgroundColor: '#e6ffe6', padding: '0.5rem', borderRadius: '5px', marginBottom: '1rem' }}>{message}</p>}
          {error && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '0.5rem', borderRadius: '5px', marginBottom: '1rem' }}>{error}</p>}

          {/* Profile Details (View Mode) */}
          {!isEditing ? (
            <div className="profile-details-view" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong>First Name:</strong> {userProfile.firstName}</div>
              <div><strong>Last Name:</strong> {userProfile.lastName}</div>
              <div><strong>Email:</strong> {userProfile.email}</div>
              <div><strong>Phone:</strong> {userProfile.phone || 'N/A'}</div>
              <div><strong>Date of Birth:</strong> {userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
              <div><strong>Gender:</strong> {userProfile.gender || 'N/A'}</div>
              <div><strong>Country:</strong> {userProfile.country || 'N/A'}</div>
              <div><strong>City:</strong> {userProfile.city || 'N/A'}</div>
            </div>
          ) : (
            /* Profile Edit Form */
            <form onSubmit={handleSubmit} className="profile-edit-form" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>First Name:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Last Name:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Date of Birth:</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Gender:</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Country:</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>City:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={handleCancelEdit} style={{ ...buttonStyle, background: '#cbd5e0', color: '#2d3748' }}>Cancel</button>
                <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          )}

          <div className="stats-cards" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', marginTop: '2rem' }}>
            <div className="stat-card" style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontWeight: '700', color: '#0077b6', fontSize: '1.3rem' }}>15</div>
              <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>Total Hours</div>
            </div>
            <div className="stat-card" style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontWeight: '700', color: '#0077b6', fontSize: '1.3rem' }}>3</div>
              <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>Events Completed</div>
            </div>
            <div className="stat-card" style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontWeight: '700', color: '#0077b6', fontSize: '1.3rem' }}>{upcomingEvents.length}</div>
              <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>Upcoming Events</div>
            </div>
          </div>
        </div>

        {/* Volunteer History & Upcoming Events (rest of your original content) */}
        <div className="user-sections" style={{ display: 'grid', gap: '2rem' }}>
          {/* Volunteer History */}
          <div className="user-section">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#0077b6' }}>Volunteer History</h2>
            <div className="history-list">
              {userVolunteerHistory.map(record => (
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', borderBottom: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '0.5rem', background: '#f9fafb' }}>
                  <div>
                    <h4 style={{ color: '#2d3748', margin: 0, fontSize: '1rem' }}>{record.event}</h4>
                    <p style={{ color: '#718096', margin: 0, fontSize: '0.85rem' }}>{record.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {/* CORRECTED: Removed the duplicated style property causing the octal literal error */}
                    <span style={{ display: 'block', color: '#0077b6', fontWeight: '600', fontSize: '0.9rem' }}>{record.hours} hrs</span>
                    <span style={{ padding: '0.25rem 0.5rem', background: '#c6f6d5', color: '#22543d', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>{record.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="user-section">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#0077b6' }}>Upcoming Events</h2>
            <div className="upcoming-list">
              {upcomingEvents.map(event => (
                <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', borderBottom: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '0.5rem', background: '#f9fafb' }}>
                  <div>
                    <h4 style={{ color: '#2d3748', margin: 0, fontSize: '1rem' }}>{event.event}</h4>
                    <p style={{ color: '#718096', margin: 0, fontSize: '0.85rem' }}>{event.date} at {event.time}</p>
                    <p style={{ color: '#0077b6', fontWeight: '600', margin: 0, fontSize: '0.85rem' }}>{event.location}</p>
                  </div>
                  {/* The "View" button has been removed from here */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Basic Reusable Styles (for form elements) ---
const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  border: '1px solid #cbd5e0',
  borderRadius: '6px',
  fontSize: '0.9rem',
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  background: '#0077b6',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600'
};

export default UserPage;
