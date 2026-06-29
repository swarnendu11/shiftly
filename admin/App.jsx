import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDrivers from './pages/AdminDrivers';
import AdminBookings from './pages/AdminBookings';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Navigate to="/admin/dashboard" replace />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDrivers />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminBookings />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              border: "1px solid #10B981",
              borderLeft: "4px solid #10B981",
            },
          },
          error: {
            style: {
              border: "1px solid #EF4444",
              borderLeft: "4px solid #EF4444",
            },
          },
        }}
      />
    </AdminProvider>
  );
}

export default App;

