import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import config from '../config';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Mock data for demonstration
  const mockUsers = [
    {
      id: 1,
      fullName: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      phone: "+1234567890",
      status: "active",
      joinDate: "2024-01-15",
      totalBookings: 12,
      lastActive: "2024-01-20"
    },
    {
      id: 2,
      fullName: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
      phone: "+1234567891",
      status: "active",
      joinDate: "2024-01-10",
      totalBookings: 8,
      lastActive: "2024-01-19"
    },
    {
      id: 3,
      fullName: "Mike Johnson",
      username: "mikej",
      email: "mike@example.com",
      phone: "+1234567892",
      status: "inactive",
      joinDate: "2024-01-05",
      totalBookings: 3,
      lastActive: "2024-01-15"
    }
  ];

  const mockDrivers = [
    {
      id: 1,
      fullName: "Robert Wilson",
      email: "robert@example.com",
      phone: "+1234567893",
      licenseNumber: "DL123456789",
      vehicleType: "Truck",
      vehicleNumber: "MH-12-AB-1234",
      status: "active",
      rating: 4.8,
      totalTrips: 45,
      joinDate: "2024-01-01",
      lastActive: "2024-01-20"
    },
    {
      id: 2,
      fullName: "Sarah Davis",
      email: "sarah@example.com",
      phone: "+1234567894",
      licenseNumber: "DL987654321",
      vehicleType: "Van",
      vehicleNumber: "MH-12-CD-5678",
      status: "active",
      rating: 4.6,
      totalTrips: 32,
      joinDate: "2024-01-08",
      lastActive: "2024-01-19"
    },
    {
      id: 3,
      fullName: "David Brown",
      email: "david@example.com",
      phone: "+1234567895",
      licenseNumber: "DL456789123",
      vehicleType: "Truck",
      vehicleNumber: "MH-12-EF-9012",
      status: "pending",
      rating: 0,
      totalTrips: 0,
      joinDate: "2024-01-18",
      lastActive: "2024-01-18"
    }
  ];

  const mockBookings = [
    {
      id: 1,
      userId: 1,
      driverId: 1,
      pickupAddress: "123 Main St, City A",
      deliveryAddress: "456 Oak Ave, City B",
      goods: "Furniture",
      vehicleType: "Truck",
      status: "completed",
      totalAmount: 2500,
      bookingDate: "2024-01-15",
      pickupDate: "2024-01-16",
      deliveryDate: "2024-01-17"
    },
    {
      id: 2,
      userId: 2,
      driverId: 2,
      pickupAddress: "789 Pine St, City C",
      deliveryAddress: "321 Elm St, City D",
      goods: "Electronics",
      vehicleType: "Van",
      status: "in_progress",
      totalAmount: 1800,
      bookingDate: "2024-01-18",
      pickupDate: "2024-01-19",
      deliveryDate: null
    },
    {
      id: 3,
      userId: 1,
      driverId: null,
      pickupAddress: "555 Maple Ave, City E",
      deliveryAddress: "777 Cedar St, City F",
      goods: "Office Equipment",
      vehicleType: "Truck",
      status: "pending",
      totalAmount: 3200,
      bookingDate: "2024-01-20",
      pickupDate: "2024-01-21",
      deliveryDate: null
    }
  ];

  useEffect(() => {
    const initializeAdmin = async () => {
      // Check for existing admin session
      const adminToken = localStorage.getItem('adminToken');
      const adminEmail = localStorage.getItem('adminEmail');
      const adminName = localStorage.getItem('adminName');
      const adminRole = localStorage.getItem('adminRole');

      if (adminToken && adminEmail) {
        setAdmin({
          email: adminEmail,
          name: adminName || 'Admin',
          role: adminRole || 'admin'
        });
      }

      // Try to fetch data from API if backend is available
      if (import.meta.env.VITE_BACKEND_URL && adminToken) {
        try {
          const token = localStorage.getItem('adminToken');
          const headers = { Authorization: `Bearer ${token}` };

          // Fetch users
          try {
            const usersResponse = await axios.get(`${config.API_URL}/admin/users`, { headers });
            if (usersResponse.data.success) {
              setUsers(usersResponse.data.users);
            }
          } catch (err) {
            console.warn('Failed to fetch users from API, using mock data');
            setUsers(mockUsers);
          }

          // Fetch drivers
          try {
            const driversResponse = await axios.get(`${config.API_URL}/admin/drivers`, { headers });
            if (driversResponse.data.success) {
              setDrivers(driversResponse.data.drivers);
            }
          } catch (err) {
            console.warn('Failed to fetch drivers from API, using mock data');
            setDrivers(mockDrivers);
          }

          // Fetch bookings
          try {
            const bookingsResponse = await axios.get(`${config.API_URL}/admin/bookings`, { headers });
            if (bookingsResponse.data.success) {
              setBookings(bookingsResponse.data.bookings);
            }
          } catch (err) {
            console.warn('Failed to fetch bookings from API, using mock data');
            setBookings(mockBookings);
          }
        } catch (error) {
          console.warn('API initialization failed, using mock data:', error);
          setUsers(mockUsers);
          setDrivers(mockDrivers);
          setBookings(mockBookings);
        }
      } else {
        // Load mock data if no backend
        setUsers(mockUsers);
        setDrivers(mockDrivers);
        setBookings(mockBookings);
      }
      
      setIsLoading(false);
    };

    initializeAdmin();
  }, []);

  const login = async (email, password) => {
    try {
      // Try API call first if backend is available
      if (import.meta.env.VITE_BACKEND_URL) {
        try {
          const response = await axios.post(`${config.API_URL}/admin/login`, {
            email,
            password
          });

          if (response.data.success) {
            const adminData = response.data.admin;
            setAdmin(adminData);
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminEmail', adminData.email);
            localStorage.setItem('adminName', adminData.name);
            localStorage.setItem('adminRole', adminData.role);
            
            toast.success('Login successful!');
            return { success: true, admin: adminData };
          } else {
            return { success: false, error: response.data.message || 'Invalid credentials' };
          }
        } catch (apiError) {
          // If API fails, fall back to mock data
          console.warn('API login failed, using mock data:', apiError);
        }
      }
      
      // Fallback to mock authentication
      const validAdmins = [
        { email: "admin@shiftly.com", password: "admin123", role: "admin" },
        { email: "superadmin@shiftly.com", password: "superadmin123", role: "superadmin" }
      ];

      const admin = validAdmins.find(a => a.email === email && a.password === password);
      
      if (admin) {
        const adminData = {
          email: admin.email,
          name: admin.email.split('@')[0],
          role: admin.role
        };
        
        setAdmin(adminData);
        localStorage.setItem('adminToken', 'admin-jwt-token');
        localStorage.setItem('adminEmail', admin.email);
        localStorage.setItem('adminName', adminData.name);
        localStorage.setItem('adminRole', admin.role);
        
        toast.success('Login successful!');
        return { success: true, admin: adminData };
      } else {
        toast.error('Invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const updateDriver = (driverId, updates) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId ? { ...driver, ...updates } : driver
    ));
  };

  const deleteDriver = (driverId) => {
    setDrivers(prev => prev.filter(driver => driver.id !== driverId));
  };

  const updateBooking = (bookingId, updates) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, ...updates } : booking
    ));
  };

  const deleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const getStats = useCallback(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter(driver => driver.status === 'active').length;
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(booking => booking.status === 'completed').length;
    const totalRevenue = bookings
      .filter(booking => booking.status === 'completed')
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    return {
      totalUsers,
      activeUsers,
      totalDrivers,
      activeDrivers,
      totalBookings,
      completedBookings,
      totalRevenue,
      pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
      inProgressBookings: bookings.filter(booking => booking.status === 'in_progress').length
    };
  }, [users, drivers, bookings]);

  const value = {
    admin,
    isLoading,
    users,
    drivers,
    bookings,
    login,
    logout,
    updateUser,
    deleteUser,
    updateDriver,
    deleteDriver,
    updateBooking,
    deleteBooking,
    getStats
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};


