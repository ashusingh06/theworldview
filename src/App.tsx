import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { PublicSharedTripPage } from './pages/PublicSharedTripPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected route wrapper for authenticated workspace
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't completed registration profile, send them to /register
  if (currentUser.isProfileComplete === false) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
};

// Route wrapper for login page (sends already-registered users to dashboard)
const LoginRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  // If logged in with completed profile, send to dashboard
  if (currentUser && currentUser.isProfileComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in with incomplete profile, send to register
  if (currentUser && currentUser.isProfileComplete === false) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Login & Register Pages */}
              <Route
                path="/login"
                element={
                  <LoginRoute>
                    <LoginPage />
                  </LoginRoute>
                }
              />
              
              {/* Register Page is always accessible for new signups and Google profile completion */}
              <Route path="/register" element={<RegisterPage />} />

              {/* Public Shared Trip View */}
              <Route path="/share/:shareId" element={<PublicSharedTripPage />} />

              {/* Protected Workspace Layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/trips" element={<MyTripsPage />} />
                <Route path="/trips/:tripId" element={<ItineraryBuilderPage />} />
                <Route path="/create-trip" element={<CreateTripPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
