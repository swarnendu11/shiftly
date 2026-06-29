import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaFlag,
  FaTruck,
  FaBoxOpen,
  FaRuler,
  FaRupeeSign,
  FaChevronLeft,
  FaInfoCircle,
  FaBoxes,
  FaCalendarAlt,
} from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";
import BidForm from "../components/bookings/BidForm";
import LocationMap from "../components/bookings/LocationMap";
import TopBidders from "../components/bookings/TopBidders";

// Mock data for frontend-only mode
const MOCK_BOOKINGS = [
  {
    bookingId: "BK001",
    pickup: { address: "123 Main Street, Mumbai" },
    delivery: { address: "456 Park Avenue, Pune" },
    date: "2025-10-25",
    time: "10:00 AM",
    goods: {
      type: "Electronics",
      items: [
        { name: "TV", quantity: 2, weight: 15 },
        { name: "Laptop", quantity: 5, weight: 2 },
      ],
    },
    distance: "150",
    estimatedPrice: { min: 1000, max: 2000 },
    status: "Available",
    notes: "Handle with care",
    bookingId: "BK001",
    pickup: { address: "123 Main Street, Mumbai" },
    delivery: { address: "456 Park Avenue, Pune" },
    date: "2025-10-25",
    time: "10:00 AM",
    goods: {
      type: "Electronics",
      items: [
        { name: "TV", quantity: 2, weight: 15 },
        { name: "Laptop", quantity: 5, weight: 2 },
      ],
    },
    distance: "150",
    estimatedPrice: { min: 1000, max: 2000 },
    status: "Available",
    notes: "Handle with care",
  },
  {
    bookingId: "BK002",
    pickup: { address: "Delhi, Delhi - 110001" },
    delivery: { address: "Agra, Uttar Pradesh - 282001" },
    date: "2025-10-26",
    time: "11:00 AM",
    goods: {
      type: "Household Goods",
      items: [
        { name: "Sofa", quantity: 2, weight: 40 },
        { name: "Fridge", quantity: 1, weight: 60 },
      ],
    },
    distance: "230 km",
    estimatedPrice: { min: 2000, max: 4000 },
    status: "Available",
    notes: "Fragile items included",
  },
  {
    bookingId: "BK003",
    pickup: { address: "Chennai, Tamil Nadu - 600001" },
    delivery: { address: "Coimbatore, Tamil Nadu - 641001" },
    date: "2025-10-27",
    time: "09:00 AM",
    goods: {
      type: "Electronics",
      items: [
        { name: "TV", quantity: 5, weight: 10 },
        { name: "Laptop", quantity: 10, weight: 2 },
      ],
    },
    distance: "500 km",
    estimatedPrice: { min: 3000, max: 5000 },
    status: "Available",
    notes: "Handle with care",
  },
];
// Add more mock bookings if needed


const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [currentBid, setCurrentBid] = useState(null);
  const [topBidders, setTopBidders] = useState([]);

  // Fetch booking details from mock data
  useEffect(() => {
    const foundBooking = MOCK_BOOKINGS.find((b) => b.bookingId === bookingId);
    setBooking(foundBooking || null);
    setTopBidders([]); // start with empty bidders
  }, [bookingId]);

  const handleSubmitBid = (bidData) => {
    const newBid = {
      driverId: "DR123",
      amount: bidData.amount,
      note: bidData.note,
      bidTime: new Date().toISOString(),
    };

    setCurrentBid(newBid);
    setTopBidders((prev) => [...prev, newBid]);
    alert("Bid submitted successfully (frontend only)");
  };

  const isBidLocked = (date) => {
    if (!date) return false;
    const pickupDate = new Date(date);
    const now = new Date();
    const hoursBeforePickup = (pickupDate - now) / (1000 * 60 * 60);
    return hoursBeforePickup < 24;
  };

  const formatLocation = (location) => {
    if (!location) return "Address not available";
    return location.address || JSON.stringify(location);
  };

  const formatDate = (date) => {
    if (!date) return "Date not specified";
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-red-500">Booking not found</p>
          <button
            onClick={() => navigate("/available-bookings")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Back to Available Bookings
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-5 sm:p-6">
        <button
          onClick={() => navigate("/available-bookings")}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-5"
        >
          <FaChevronLeft /> Back to Available Bookings
        </button>

        {/* Booking header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaTruck className="text-red-500" /> Booking Details
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-8">
            ID: {booking.bookingId}
          </p>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mt-2 md:mt-0">
            {booking.status}
          </span>
        </div>

        {/* Locations */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Locations</h2>
          <div className="grid grid-cols-1 gap-4 mb-5">
            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
              <FaMapMarkerAlt className="text-red-500 mt-1" />
              <p className="text-gray-800 font-medium whitespace-pre-line">
                Pickup: {formatLocation(booking.pickup)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
              <FaFlag className="text-green-500 mt-1" />
              <p className="text-gray-800 font-medium whitespace-pre-line">
                Delivery: {formatLocation(booking.delivery)}
              </p>
            </div>
          </div>
          <LocationMap pickup={formatLocation(booking.pickup)} delivery={formatLocation(booking.delivery)} />
        </div>

        {/* Shipment Details */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Shipment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
              <p className="text-gray-800 font-medium">{formatDate(booking.date)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Load Type</p>
              <p className="text-gray-800 font-medium">{booking.goods.type}</p>
            </div>
          </div>

          {/* Items */}
          {booking.goods.items && booking.goods.items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                <FaBoxes className="text-red-500" /> Items to Transport
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                {booking.goods.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Weight: {item.weight}kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div>
              <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                <FaInfoCircle className="text-red-500" /> Notes
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* BidForm and TopBidders */}
        <div className="space-y-6">
          <BidForm
            booking={booking}
            currentBid={currentBid}
            onBidSubmit={handleSubmitBid}
            isLocked={isBidLocked(booking.date)}
          />
          <TopBidders bidders={topBidders} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingDetails;
