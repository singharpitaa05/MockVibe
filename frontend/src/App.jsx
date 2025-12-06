import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import InterviewCustomization from './pages/InterviewCustomization';
import InterviewHistory from './pages/InterviewHistory';
import InterviewResult from './pages/InterviewResult';
import InterviewSession from './pages/InterviewSession';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PracticeMode from './pages/PracticeMode';
import ProfileSetup from './pages/ProfileSetup';
import Register from './pages/Register';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Profile Setup - Semi-protected (requires auth but not complete profile) */}
          <Route path="/profile-setup" element={<ProfileSetup />} />
          
          {/* Protected Routes - require authentication and complete profile */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/interview-history"
            element={
              <ProtectedRoute>
                <InterviewHistory />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/interview-result/:id"
            element={
              <ProtectedRoute>
                <InterviewResult />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/interview-customization"
            element={
              <ProtectedRoute>
                <InterviewCustomization />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/interview/:id"
            element={
              <ProtectedRoute>
                <InterviewSession />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/practice-mode"
            element={
              <ProtectedRoute>
                <PracticeMode />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;