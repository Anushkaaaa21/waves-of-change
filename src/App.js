import React from 'react'; // No need for useState here if using AuthContext
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import the AuthProvider and useAuth hook
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import './index.css'; // Assuming this is correct
import AboutUsPage from './pages/AboutUsPage';
import DonationsPage from './pages/DonationPage'; // Changed to DonationsPage as per usage below

// --- Helper Component for Protected Routes ---
// This component will use the AuthContext to determine if a user is authenticated
// and redirect if not. This keeps your Route elements cleaner.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Get isAuthenticated and loading state from AuthContext

  if (loading) {
    // Optionally render a loading spinner or message while auth status is being checked
    return <div>Loading authentication...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  // REMOVE: You no longer need to manage isAuthenticated or handleLogin/handleLogout state directly here
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const handleLogin = () => { setIsAuthenticated(true); };
  // const handleLogout = () => { setIsAuthenticated(false); };

  return (
    <Router>
      {/* AuthProvider MUST wrap everything that needs access to auth context,
          and it MUST be inside the Router for useNavigate to work within AuthProvider */}
      <AuthProvider>
        <AppContent /> {/* Render a separate component that uses useAuth */}
      </AuthProvider>
    </Router>
  );
}

// Separate component to consume AuthContext for Navbar and Routes
function AppContent() {
  // Access auth state and functions from the context
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} /> {/* Pass logout from context */}
      <Routes>
        {/* Redirect based on authentication status for the root path */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          }
        />
        {/* LoginPage should use the login function from AuthContext */}
        <Route path="/login" element={<LoginPage />} /> {/* LoginPage will use useAuth().login() internally */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<UserPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/donate" element={<DonationsPage />} />

        {/* Use the ProtectedRoute for routes that require authentication */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;