import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import BookingsOverview from "../components/dashboard/BookingsOverview";
import BidActivity from "../components/dashboard/BidActivity";
import PerformanceMetrics from "../components/dashboard/PerformanceMetrics";
import EarningsSummary from "../components/dashboard/EarningsSummary";
import VehicleStatus from "../components/dashboard/VehicleStatus";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import { FaSpinner } from "react-icons/fa";

const Dashboard = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [hasAddress, setHasAddress] = useState(true);

  // Set dynamic page title
  useEffect(() => {
    document.title =
      "Driver Dashboard | Service Overview | Shiftly - A Seamless Transport System";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulate fetching driver data (frontend mock)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Mock driver data
      const mockDriver = {
        username: "driver123",
        name: "John Doe",
        rating: 4.8,
        totalTrips: 256,
        vehicle: {
          make: "Tata Motors",
          model: "Ace Mini Truck",
          plateNumber: "MH12AB1234",
          status: "Active",
        },
      };

      setDriver(mockDriver);
      setHasAddress(true); // or false to test modal
      setLoading(false);
    }, 800); // simulate loading delay
  }, []);

  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-red-500" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-5">
        {/* Welcome Card */}
        <div className="lg:col-span-3">
          <WelcomeCard driver={driver} />
        </div>

        {/* Stats Card */}
        <div className="lg:col-span-2">
          <StatsCard driver={driver} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <QuickActions />
      </div>

      {/* Bookings Overview + Bid Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <BookingsOverview />
        </div>
        <div>
          <BidActivity />
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="mt-6">
        <EarningsSummary />
      </div>

      {/* Performance Metrics */}
      <div className="mt-6">
        <PerformanceMetrics driver={driver} />
      </div>

      {/* Vehicle Status */}
      <div className="mt-6">
        <VehicleStatus vehicle={driver?.vehicle || {}} />

      </div>

      {/* Profile Update Modal (optional) */}
      <ProfileUpdateModal
        isOpen={!hasAddress || isProfileModalOpen}
        onClose={handleCloseModal}
        username={driver?.username}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
