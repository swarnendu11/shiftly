import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaSpinner,
  FaInfoCircle,
  FaClipboardCheck,
  FaTruck,
  FaRegClock,
  FaMapMarkerAlt,
  FaStar,
  FaCalendarAlt,
  FaShareAlt,
  FaChevronLeft,
  FaCopy,
  FaUserCircle,
  FaCheckCircle,
  FaDirections,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShipmentTracker from "../components/tracking/ShipmentTracker";
import LiveTrackingMap from "../components/tracking/LiveTrackingMap";
import BookingStatusBadge from "../components/myBookings/BookingStatusBadge";
import { toast } from "react-hot-toast";

const TrackingPage = () => {
  const { bookingId } = useParams();

  // State variables
  const [booking, setBooking] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = `Tracking Shipment #${bookingId} | Shiftly`;
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, [bookingId]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Fetch booking details (or mock demo data)
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ If no backend, use mock demo data
        if (!import.meta.env.VITE_BACKEND_URL) {
          const demoBooking = {
            bookingId: bookingId || "BOOK-1757297492845",
            status: "inTransit",
            pickup: { street: "13/21 M.L.B Road", city: "Bally" },
            delivery: { street: "4 no Notun gram", city: "Rishrah" },
            schedule: { date: new Date(), time: "12:00 AM" },
            goods: { type: "Small Household" },
            updatedAt: new Date(),
            trackingUpdates: [
              {
                message: "Shipment picked up from origin",
                timestamp: new Date(Date.now() - 1000 * 60 * 60),
              },
              {
                message: "Shipment is on the way",
                timestamp: new Date(),
              },
            ],
          };

          const demoDriver = {
            name: "Animesh Pandey",
            rating: 4.9,
            trips: 120,
            vehicle: "Truck",
          };

          setBooking(demoBooking);
          setDriver(demoDriver);
          setLiveLocation({ lat: 19.076, lng: 72.8777 }); 
          return;
        }

        // ✅ Otherwise, fetch real backend data
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/tracking/public/${bookingId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch booking details");
        }

        if (data.success && data.tracking && data.tracking.booking) {
          setBooking(data.tracking.booking);

          if (
            data.tracking.booking.driverId &&
            typeof data.tracking.booking.driverId === "object"
          ) {
            setDriver(data.tracking.booking.driverId);
          }
        } else {
          setError("Booking not found or you don't have access to view it");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError(error.message || "Failed to load booking details");
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Copy tracking link to clipboard
  const copyTrackingLink = () => {
    const trackingUrl = `${window.location.origin}/tracking/${bookingId}`;
    navigator.clipboard
      .writeText(trackingUrl)
      .then(() => {
        toast.success("Tracking link copied to clipboard");
        setShowShareOptions(false);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        toast.error("Failed to copy link");
      });
  };

  // Share tracking link
  const shareTrackingLink = () => {
    const trackingUrl = `${window.location.origin}/tracking/${bookingId}`;
    if (navigator.share) {
      navigator
        .share({
          title: `Track Shipment #${bookingId}`,
          text: `Track your shipment in real-time: `,
          url: trackingUrl,
        })
        .then(() => setShowShareOptions(false))
        .catch((err) => console.error("Share failed:", err));
    } else {
      copyTrackingLink();
    }
  };

  // Show user-friendly messages for loading and error states
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 min-h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-red-500 text-4xl mb-4" />
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 min-h-[70vh]">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-red-500 mb-4 text-5xl flex justify-center">
              <FaInfoCircle />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The booking you're looking for could not be found."}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/"
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
              >
                <FaChevronLeft />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format address
  const formatAddress = (address) => {
    if (!address) return "Not available";
    if (typeof address === "string") return address;

    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);

    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  // Determine if the shipment is in active delivery (driver is sharing location)
  const isActiveDelivery =
    booking.status === "inTransit" || booking.status === "in_transit";

  return (
    <div className="min-h-screen bg-gray-50 mt-20 ">
      <div className="container mx-auto px-4 py-6">
        {/* Header section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Track Shipment #{booking.bookingId}
            </h1>
            <div className="flex items-center gap-2">
              {booking.status === "delivered" ||
              booking.status === "completed" ? (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                  <FaCheckCircle className="mr-2" />
                  Delivery Complete
                </span>
              ) : booking.status === "inTransit" ||
                booking.status === "in_transit" ? (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></span>
                  In Transit
                </span>
              ) : (
                <BookingStatusBadge status={booking.status} />
              )}
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Last updated: {formatDate(booking.updatedAt || new Date())} at{" "}
            {formatTime(booking.updatedAt || new Date())}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Tracking info */}
          <div className="space-y-6">
            {/* Booking info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaClipboardCheck className="text-red-600" /> Booking
                Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium text-gray-800 break-words">
                    {booking.bookingId}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium text-gray-800 break-words">
                      {formatAddress(booking.pickup)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p className="font-medium text-gray-800 break-words">
                      {formatAddress(booking.delivery)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scheduled Date</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(booking.schedule?.date)}
                    {booking.schedule?.time && ` at ${booking.schedule.time}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Driver details card */}
            {driver && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserCircle className="text-red-600" /> Driver Information
                </h2>
                <p className="font-medium text-gray-800">
                  {(driver.name || "Driver").split(" ")[0]}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <FaStar className="text-yellow-400" />
                  <span>{driver.rating}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{driver.trips}+ trips</span>
                </div>
                <p className="text-sm text-gray-600">
                  Vehicle: {driver.vehicle}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <FaShareAlt />
                    <span>Share Tracking Link</span>
                  </button>
                  {showShareOptions && (
                    <div className="mt-3 bg-white shadow-lg rounded-lg z-10 p-3 border border-gray-200">
                      <button
                        onClick={copyTrackingLink}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded w-full text-left cursor-pointer"
                      >
                        <FaCopy className="text-gray-500" />
                        <span>Copy tracking link</span>
                      </button>
                      <button
                        onClick={shareTrackingLink}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded w-full text-left cursor-pointer"
                      >
                        <FaShareAlt className="text-gray-500" />
                        <span>Share via...</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shipment status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTruck className="text-red-600" /> Shipment Status
              </h2>
              <ShipmentTracker booking={booking} />
            </div>
          </div>

          {/* Right column - Live map */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" /> Live Tracking
                </div>
              </h2>
              <div className="lg:h-[550px] h-[400px] sm:h-[500px] relative rounded-lg overflow-hidden">
                <LiveTrackingMap
                  bookingId={bookingId}
                  initialLocation={liveLocation}
                  isDelivered={
                    booking.status === "delivered" ||
                    booking.status === "completed"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackingPage;
