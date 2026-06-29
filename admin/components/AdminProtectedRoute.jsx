import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAdmin } from '../context/AdminContext';

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { admin, isLoading } = useAdmin();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    try {
      // ✅ Allow fake token in demo mode
      if (token !== 'admin-jwt-token') {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          throw new Error('Token expired');
        }
      }
    } catch (err) {
      console.warn('Invalid token, logging out:', err.message);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRole');
      navigate('/admin/login', { replace: true });
    } finally {
      setCheckingAuth(false);
    }
  }, [navigate]);

  if (checkingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return children;
};

export default AdminProtectedRoute;


