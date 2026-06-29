import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUsers, 
  FaTruck, 
  FaClipboardList, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaShieldAlt,
  FaBell
} from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
    { name: 'Users', path: '/admin/users', icon: FaUsers },
    { name: 'Drivers', path: '/admin/drivers', icon: FaTruck },
    { name: 'Bookings', path: '/admin/bookings', icon: FaClipboardList },
    { name: 'Analytics', path: '/admin/analytics', icon: FaChartBar },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  useEffect(() => {
    // Mock notifications
    setNotifications([
      { id: 1, message: 'New driver registration pending approval', type: 'warning', time: '2 min ago' },
      { id: 2, message: 'Booking #1234 completed successfully', type: 'success', time: '15 min ago' },
      { id: 3, message: 'User reported an issue with delivery', type: 'error', time: '1 hour ago' },
    ]);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <div className="flex items-center">
            <FaShieldAlt className="text-2xl text-red-500 mr-2" />
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  isActive(item.path) ? 'bg-red-600 text-white' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 text-lg" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {admin?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-white text-sm font-medium">{admin?.name}</p>
                <p className="text-gray-400 text-xs">{admin?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <FaBars className="text-xl" />
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-800">
                {menuItems.find(item => isActive(item.path))?.name || 'Admin Panel'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                  <FaBell className="text-xl" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Admin info */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {admin?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{admin?.name}</p>
                  <p className="text-xs text-gray-500">{admin?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


