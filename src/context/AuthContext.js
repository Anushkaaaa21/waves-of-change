// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {cd
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Effect to run once on component mount to check for existing token
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // You might have a backend endpoint like /api/auth/me to get user info
          // using the token, which also implicitly validates the token.
          const response = await fetch('https://waves-of-change-backend.onrender.com/api/auth/me', {
            headers: {
              'x-auth-token': token
            }
          });

          // Read response body as text first to avoid 'body stream already read'
          const responseBody = await response.text();
          let userData = null;

          if (response.ok) {
            try {
              userData = JSON.parse(responseBody);
              setIsAuthenticated(true);
              setUser(userData); // Set user data (e.g., { id: '...', name: '...' })
            } catch (jsonParseError) {
              console.error("Error parsing user data from /api/auth/me:", jsonParseError);
              localStorage.removeItem('token');
              setIsAuthenticated(false);
              setUser(null);
              // Handle case where /api/auth/me returns non-JSON despite being OK
              console.error("'/api/auth/me' responded OK but with non-JSON:", responseBody);
            }
          } else {
            // Token might be expired or invalid, clear it
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            console.error("Token invalid or expired or /api/auth/me failed. Response:", responseBody);
          }
        } catch (error) {
          console.error("Error verifying token or network issue with /api/auth/me:", error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false); // Finished checking auth status
    };

    checkAuthStatus();
  }, []); // Only run once on mount

  const login = async (email, password) => {
    try {
      const response = await fetch('https://waves-of-change-backend.onrender.com/api/auth/login', { // Your backend login endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // --- NEW ROBUST ERROR HANDLING FOR RESPONSE BODY ---
      let responseBody;
      try {
        // Attempt to read the body as text. This can always be done once.
        responseBody = await response.text();
      } catch (readError) {
        console.error("Failed to read login response body:", readError);
        setIsAuthenticated(false);
        setUser(null);
        return { success: false, message: 'Login failed: Could not read server response.' };
      }

      let data = {};
      let errorMessage = 'Login failed: An unknown error occurred.';

      // Now, try to parse the read text as JSON
      try {
        data = JSON.parse(responseBody);
      } catch (jsonParseError) {
        // If JSON parsing fails, the response was not JSON
        console.error("Server responded with non-JSON or invalid JSON:", responseBody);
        // Provide more specific messages for common non-JSON errors
        if (responseBody.startsWith("Proxy erro")) {
            errorMessage = "Login failed: Could not connect to the authentication server. Please check if the server is running on port 3001.";
        } else if (response.status === 500) {
            errorMessage = `Login failed: Internal server error. Server response: "${responseBody.substring(0, 100)}..."`;
        } else {
            errorMessage = `Login failed: Unexpected server response format: "${responseBody.substring(0, 100)}..."`;
        }
        setIsAuthenticated(false);
        setUser(null);
        return { success: false, message: errorMessage };
      }
      // --- END OF ROBUST ERROR HANDLING ---

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        // Assuming your login response returns user data, or you fetch it
        // after setting the token. For simplicity, if data.user is returned:
        setUser(data.user || { id: data.userId, name: data.name }); // Adjust based on your actual response
        navigate('/'); // Redirect to homepage or dashboard after login
        return { success: true, message: 'Login successful' };
      } else {
        // If response.ok is false, but we successfully parsed JSON data
        setIsAuthenticated(false);
        setUser(null);
        // Use the parsed data.msg from the backend, or a generic error message
        return { success: false, message: data.msg || errorMessage };
      }
    } catch (error) {
      // This outer catch block handles network errors that prevent any server response
      console.error("Login network/fetch error:", error);
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, message: 'Network error or server unavailable. Please check your internet connection or try again later.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  if (loading) {
    // Optional: Render a loading spinner or placeholder while checking auth status
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};