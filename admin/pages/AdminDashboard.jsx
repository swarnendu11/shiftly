import { useMemo, useCallback } from 'react';
import { 
  FaUsers, 
  FaTruck, 
  FaClipboardList, 
  FaDollarSign, 
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';

const AdminDashboard = () => {
  const { getStats, users, bookings } = useAdmin();

  // Memoize expensive calculations
  const stats = useMemo(() => getStats(), [getStats]);
  const recentBookings = useMemo(() => bookings.slice(0, 5), [bookings]);
  const recentUsers = useMemo(() => users.slice(0, 5), [users]);

  const StatCard = useCallback(({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-1 ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <FaChartLine className="mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  ), []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="text-green-600" />;
      case 'in_progress': return <FaClock className="text-blue-600" />;
      case 'pending': return <FaExclamationTriangle className="text-yellow-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  }, []);


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-red-100">Monitor and manage your transport platform efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FaUsers}
          color="bg-blue-500"
          change="+12% from last month"
          changeType="positive"
        />
        <StatCard
          title="Active Drivers"
          value={stats.activeDrivers}
          icon={FaTruck}
          color="bg-green-500"
          change="+8% from last month"
          changeType="positive"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={FaClipboardList}
          color="bg-purple-500"
          change="+15% from last month"
          changeType="positive"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={FaDollarSign}
          color="bg-yellow-500"
          change="+22% from last month"
          changeType="positive"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Bookings</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
            </div>
            <FaCheckCircle className="text-3xl text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            </div>
            <FaClock className="text-3xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgressBookings}</p>
            </div>
            <FaExclamationTriangle className="text-3xl text-blue-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(booking.status)}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Booking #{booking.id}</p>
                      <p className="text-sm text-gray-500">{booking.goods} • {booking.vehicleType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{booking.totalAmount}</p>
                    <p className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{user.totalBookings} bookings</p>
                    <p className={`text-xs px-2 py-1 rounded-full ${
                      user.status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {user.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
            <FaUsers className="text-2xl text-blue-500 mb-2" />
            <p className="font-medium text-gray-900">Add New User</p>
            <p className="text-sm text-gray-500">Create user account</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <FaTruck className="text-2xl text-green-500 mb-2" />
            <p className="font-medium text-gray-900">Add Driver</p>
            <p className="text-sm text-gray-500">Register new driver</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <FaClipboardList className="text-2xl text-purple-500 mb-2" />
            <p className="font-medium text-gray-900">View Bookings</p>
            <p className="text-sm text-gray-500">Manage bookings</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <FaChartLine className="text-2xl text-yellow-500 mb-2" />
            <p className="font-medium text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-500">Check reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


