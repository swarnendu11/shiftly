import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatisticsCard from "../components/dashboard/StatisticsCard";
import QuickActions from "../components/dashboard/QuickActions";
import LiveTrackingCard from "../components/dashboard/LiveTrackingCard";
import UpcomingBookings from "../components/dashboard/UpcomingBookings";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import useProfileCheck from "../hooks/useProfileCheck";
import { useProfile } from "../context/ProfileContext";

const Dashboard = () => {
  const { isProfileComplete, user, loading } = useProfileCheck();
  const { logout } = useProfile();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Set dynamic page title when component mounts
  useEffect(() => {
    document.title =
      "Customer Dashboard | Manage Your Account | Shiftly - A Seamless Transport System";

    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && !isProfileComplete) {
      setShowProfileModal(true);
    }
  }, [isProfileComplete, loading]);

  const handleLogout = () => {
    logout();
    navigate("/"); // 👈 redirect to home/index page
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 mt-20 lg:ml-24 md:ml-22">
      

      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-4 sm:mb-6">
        <div className="lg:col-span-2">
          <WelcomeCard />
        </div>
        <div className="lg:col-span-1 lg:order-2">
          <StatisticsCard />
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-4 sm:mb-6">
        <QuickActions />
      </div>

      {/* Live Tracking and Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <LiveTrackingCard />
        <UpcomingBookings />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <RecentOrdersTable />
      </div>

      {/* Profile Update Modal */}
      {!loading && user && (
        <ProfileUpdateModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          username={user.username}
        />
      )}
    </main>
  );
};

export default Dashboard;
