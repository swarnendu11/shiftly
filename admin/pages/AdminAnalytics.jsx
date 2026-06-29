import { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaChartBar, 
  FaUsers, 
  FaTruck, 
  FaDollarSign,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';

const AdminAnalytics = () => {
  const { getStats, users, drivers } = useAdmin();
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    const statsData = getStats();
    setStats(statsData);
  }, [getStats]);

  const getRevenueData = () => {
    // Mock revenue data for different time periods
    const revenueData = {
      '7days': [1200, 1500, 1800, 1600, 2000, 2200, 2500],
      '30days': [5000, 5500, 6000, 5800, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000, 15500, 16000, 16500, 17000, 17500, 18000, 18500, 19000],
      '90days': [15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000, 55000, 58000, 62000, 65000, 68000, 72000, 75000, 78000, 82000, 85000, 88000, 92000, 95000, 98000, 102000, 105000, 108000, 112000, 115000, 118000, 122000, 125000, 128000, 132000, 135000, 138000, 142000, 145000, 148000, 152000, 155000, 158000, 162000, 165000, 168000, 172000, 175000, 178000, 182000, 185000, 188000, 192000, 195000, 198000, 202000, 205000, 208000, 212000, 215000, 218000, 222000, 225000, 228000, 232000, 235000, 238000, 242000, 245000, 248000, 252000, 255000, 258000, 262000, 265000, 268000, 272000, 275000, 278000, 282000, 285000, 288000, 292000, 295000, 298000, 302000, 305000, 308000, 312000]
    };
    return revenueData[timeRange] || revenueData['30days'];
  };

  const getBookingTrends = () => {
    // Mock booking trends
    const trends = {
      '7days': [5, 8, 12, 10, 15, 18, 20],
      '30days': [20, 25, 30, 28, 35, 40, 45, 42, 50, 55, 60, 58, 65, 70, 75, 72, 80, 85, 90, 88, 95, 100, 105, 102, 110, 115, 120, 118, 125, 130],
      '90days': [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 890, 900, 910, 920, 930, 940, 950]
    };
    return trends[timeRange] || trends['30days'];
  };

  const getTopDrivers = () => {
    return drivers
      .sort((a, b) => b.totalTrips - a.totalTrips)
      .slice(0, 5);
  };

  const getTopUsers = () => {
    return users
      .sort((a, b) => b.totalBookings - a.totalBookings)
      .slice(0, 5);
  };

  const StatCard = ({ title, value, icon, color, change, changeType, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <p className={`text-sm flex items-center mt-1 ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={FaDollarSign}
          color="bg-green-500"
          change="+12.5%"
          changeType="positive"
          subtitle={`${timeRange} period`}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={FaCalendarAlt}
          color="bg-blue-500"
          change="+8.2%"
          changeType="positive"
          subtitle={`${stats.completedBookings} completed`}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={FaUsers}
          color="bg-purple-500"
          change="+15.3%"
          changeType="positive"
          subtitle={`${stats.totalUsers} total users`}
        />
        <StatCard
          title="Active Drivers"
          value={stats.activeDrivers}
          icon={FaTruck}
          color="bg-orange-500"
          change="+6.7%"
          changeType="positive"
          subtitle={`${stats.totalDrivers} total drivers`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <FaChartLine className="text-2xl text-green-500" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-1">
            {getRevenueData().slice(-14).map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-green-500 rounded-t w-6 transition-all duration-300 hover:bg-green-600"
                  style={{ height: `${(value / Math.max(...getRevenueData())) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">Day {index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Average daily revenue: ₹{Math.round(getRevenueData().slice(-14).reduce((a, b) => a + b, 0) / 14).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
            <FaChartBar className="text-2xl text-blue-500" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-1">
            {getBookingTrends().slice(-14).map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-blue-500 rounded-t w-6 transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(value / Math.max(...getBookingTrends())) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">Day {index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Average daily bookings: {Math.round(getBookingTrends().slice(-14).reduce((a, b) => a + b, 0) / 14)}
            </p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Drivers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Drivers</h3>
          <div className="space-y-4">
            {getTopDrivers().map((driver) => (
              <div key={driver.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {driver.fullName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{driver.fullName}</p>
                    <p className="text-sm text-gray-500">{driver.vehicleType} • {driver.vehicleNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{driver.totalTrips} trips</p>
                  <p className="text-sm text-gray-500">Rating: {driver.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Users</h3>
          <div className="space-y-4">
            {getTopUsers().map((user) => (
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
                  <p className="text-sm font-medium text-gray-900">{user.totalBookings} bookings</p>
                  <p className="text-sm text-gray-500 capitalize">{user.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-gray-900">{stats.completedBookings}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(stats.completedBookings / stats.totalBookings) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-sm font-medium text-gray-900">{stats.inProgressBookings}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${(stats.inProgressBookings / stats.totalBookings) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-gray-900">{stats.pendingBookings}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${(stats.pendingBookings / stats.totalBookings) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-gray-900">{stats.activeUsers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inactive Users</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalUsers - stats.activeUsers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${((stats.totalUsers - stats.activeUsers) / stats.totalUsers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Drivers</span>
              <span className="text-sm font-medium text-gray-900">{stats.activeDrivers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(stats.activeDrivers / stats.totalDrivers) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inactive Drivers</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalDrivers - stats.activeDrivers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${((stats.totalDrivers - stats.activeDrivers) / stats.totalDrivers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;


