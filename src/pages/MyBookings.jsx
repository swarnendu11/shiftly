import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaExclamationCircle } from "react-icons/fa";

// Temporary mock BookingCard
const BookingCard = ({ booking }) => (
  <div className="bg-white shadow rounded-xl p-4">
    <h3 className="font-semibold text-lg">{booking.item}</h3>
    <p className="text-sm text-gray-600">Status: {booking.status}</p>
    <p className="text-sm text-gray-500">Date: {booking.date}</p>
  </div>
);

// Temporary mock ProfileUpdateModal
const ProfileUpdateModal = ({ isOpen, onClose, username }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
        <p className="mb-4">Update profile for user: {username}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [isProfileComplete] = useState(true); // change to false to test profile warning
  const [user] = useState({ username: "demoUser" });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      "My Bookings | View Your Orders | Shiftly - A Seamless Transport System";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isProfileComplete) {
      setShowProfileModal(true);
    }
    fetchBookings();
  }, [isProfileComplete]);

  const goToProfile = () => {
    if (user && user.username) {
      navigate(`/user/${user.username}`);
    }
  };

  const fetchBookings = () => {
    setTimeout(() => {
      try {
        const mockBookings = [
          {
            bookingId: "1",
            status: "pending",
            item: "Household Goods",
            date: "2025-09-10",
          },
          {
            bookingId: "2",
            status: "completed",
            item: "Office Equipment",
            date: "2025-09-08",
          },
        ];
        setBookings(mockBookings);
        setLoading2(false);
      } catch (err) {
        setError("Failed to load bookings");
        setLoading2(false);
      }
    }, 800);
  };

  const filterBookings = (status) => {
    setActiveFilter(status);
  };

  const getFilteredBookings = () => {
    if (activeFilter === "all") return bookings;
    if (activeFilter === "completed") {
      return bookings.filter(
        (b) => b.status === "completed" || b.status === "delivered"
      );
    }
    return bookings.filter((b) => b.status === activeFilter);
  };

  if (loading2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 mt-20 md:ml-22 lg:ml-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {!isProfileComplete && !showProfileModal ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Profile Update Required
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Please update your mobile number in your profile to view
                    your bookings.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="ml-1 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="mb-8">
              <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                <div className="flex min-w-full md:min-w-0 pb-2">
                  {[
                    "all",
                    "pending",
                    "confirmed",
                    "inTransit",
                    "completed",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => filterBookings(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap mr-2
                        ${
                          activeFilter === status
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bookings */}
            {getFilteredBookings().length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBox className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No {activeFilter !== "all" ? activeFilter : ""} bookings found
                </h3>
                <p className="text-gray-500">
                  {activeFilter === "all"
                    ? "Your bookings will appear here once you make a booking"
                    : activeFilter === "completed"
                    ? "You don't have any completed or delivered bookings"
                    : `You don't have any ${activeFilter} bookings`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {getFilteredBookings().map((booking) => (
                  <BookingCard key={booking.bookingId} booking={booking} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Profile Update Modal */}
        <ProfileUpdateModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          username={user.username}
        />
      </div>
    </div>
  );
};

export default MyBookings;
