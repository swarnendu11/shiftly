import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaMoneyBillWave,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaShippingFast,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaCommentDots,
  FaPaperPlane,
} from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";

// This component is a frontend-only enhanced mock of your long
// ConfirmedBookingDetails file. It intentionally contains many
// UI sections and placeholder logic but DOES NOT perform any
// backend fetches or require backend dependencies.

const ConfirmedBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // --- Local state (all frontend-only) ---
  const [booking, setBooking] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // --- Mocked datasets (simulate what the big file used) ---
  const mockBookings = useMemo(
    () => [
      {
        bookingId: "BK001",
        pickup: { city: "kolkata", state: "West Bengal", addressLine1: "12B Park Street" },
        delivery: { city: "Pune", state: "Maharashtra", addressLine1: "45 MG Road" },
        schedule: { date: "2025-10-26", time: "10:30", specialInstructions: "Handle with care" },
        distance: "1774 km",
        goods: { type: "Construction Material", items: ["Cement bags (50)", "Steel rods (20)"] },
        finalPrice: "12000",
        price: "12500",
        acceptedBid: { amount: 12000 },
        payment: { status: "paid", amount: 12000, method: "online", _id: "PAY123" },
        status: "confirmed",
        confirmedAt: "2025-10-20T10:00:00Z",
      },
      {
        bookingId: "BK002",
        pickup: { city: "pune", state: "Maharastra", addressLine1: "88 Koregaon" },
        delivery: { city: "Jaipur", state: "Rajasthan", addressLine1: "101 Bapu Bazaar" },
        schedule: { date: "2025-10-28", time: "08:00" },
        distance: "1096 km",
        goods: { type: "Electronics", items: ["TVs (10)", "Speakers (20)"] },
        finalPrice: "4200",
        status: "in_transit",
        inTransitAt: "2025-10-28T09:00:00Z",
      },
      {
        bookingId: "BK003",
        pickup: { city: "Kolkata", state: "West Bengal" },
        delivery: { city: "Patna", state: "Bihar" },
        schedule: { date: "2025-10-20", time: "09:00" },
        distance: "560 km",
        goods: { type: "Groceries" },
        finalPrice: "3900",
        status: "delivered",
        completedAt: "2025-10-21T14:32:00Z",
      },
    ],
    []
  );

  const mockDriver = useMemo(
    () => ({
      id: "DR001",
      fullName: "Ravi Kumar",
      phone: "+91 98765 43210",
      email: "ravi.kumar@example.com",
      profileImage: null,
      vehicle: { type: "Mini Truck", license: "MH12AB1234" },
    }),
    []
  );

  const mockMessages = useMemo(
    () => [
      { id: 1, from: "driver", text: "On my way to pickup.", time: "2025-10-26T09:45:00Z" },
      { id: 2, from: "customer", text: "Please call when you arrive.", time: "2025-10-26T09:47:00Z" },
    ],
    []
  );

  // --- Simulate component mount: load mock booking & driver ---
  useEffect(() => {
    setLoading(true);
    // Simulate a small delay (frontend-only)
    const t = setTimeout(() => {
      const found = mockBookings.find((b) => b.bookingId === bookingId);
      if (found) {
        setBooking(found);
        setShipmentStatus(found.status === "in_transit" ? "inTransit" : found.status);
        // attach mock driver only for confirmed/in_transit bookings
        if (found.status === "confirmed" || found.status === "in_transit") {
          setDriver(mockDriver);
        }
        // set some mock messages
        setMessages(mockMessages);
      } else {
        setBooking(null);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [bookingId, mockBookings, mockDriver, mockMessages]);

  useEffect(() => {
    document.title = `Booking Details | ${bookingId} | Shiftly`;
    window.scrollTo(0, 0);
  }, [bookingId]);

  // --- Helpers ---
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch (e) {
      return "Date error";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN");
    } catch (e) {
      return dateString;
    }
  };

  const formatLocation = (location) => {
    if (!location) return "Not specified";
    if (typeof location === "string") return location;
    const parts = [];
    if (location.addressLine1) parts.push(location.addressLine1);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.pincode) parts.push(location.pincode);
    return parts.join(", ") || "Address not available";
  };

  const getActualPrice = () => {
    if (!booking) return 0;
    if (booking.finalPrice) return Number(booking.finalPrice);
    if (booking.payment?.amount) return Number(booking.payment.amount);
    if (booking.price) return Number(booking.price);
    if (booking.acceptedBid?.amount) return Number(booking.acceptedBid.amount);
    return 0;
  };

  const getNextStatus = () => {
    const statusFlow = {
      confirmed: "inTransit",
      inTransit: "delivered",
      in_transit: "delivered",
    };
    return statusFlow[shipmentStatus] || null;
  };

  const getStatusButtonLabel = () => {
    const labels = {
      inTransit: "Start Transit",
      delivered: "Mark as Delivered",
    };
    return labels[getNextStatus()] || "";
  };

  const renderStatusButton = () => {
    if (!booking) return null;
    if (updateLoading) {
      return (
        <button disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg flex items-center gap-2">
          <FaSpinner className="animate-spin" /> Updating...
        </button>
      );
    }

    const next = getNextStatus();
    if (!next) {
      return (
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
          <FaCheck /> Delivery Completed
        </div>
      );
    }

    return (
      <button
        onClick={() => {
          // frontend-only: simulate update
          setUpdateLoading(true);
          setTimeout(() => {
            setShipmentStatus(next);
            // Map our logical statuses back to booking.status keys for display
            const newBookingStatus = next === "inTransit" ? "in_transit" : next === "delivered" ? "delivered" : next;
            setBooking((b) => ({ ...b, status: newBookingStatus }));
            setUpdateLoading(false);
          }, 700);
        }}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
      >
        <FaShippingFast /> {getStatusButtonLabel()}
      </button>
    );
  };

  const renderStatusTimeline = () => {
    const statuses = [
      { id: "confirmed", label: "Confirmed", date: booking?.confirmedAt },
      { id: "inTransit", label: "In Transit", date: booking?.inTransitAt },
      { id: "delivered", label: "Delivered", date: booking?.completedAt },
    ];

    const currentStatusId = booking?.status === "in_transit" ? "inTransit" : booking?.status;

    return (
      <div className="space-y-4">
        {statuses.map((s, idx) => {
          const isActive = !currentStatusId ? false : s.id === currentStatusId || (statuses.findIndex((x) => x.id === currentStatusId) > idx);
          const isCurrent = currentStatusId === s.id;
          return (
            <div key={s.id} className={`flex items-start gap-4 ${isActive ? "text-red-600" : "text-gray-400"}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isActive ? "bg-red-100" : "bg-gray-100"}`}>
                {s.id === "confirmed" && <FaCheck />}
                {s.id === "inTransit" && <FaShippingFast />}
                {s.id === "delivered" && <FaCheckCircle />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{s.label}</p>
                  {s.date && <p className="text-sm text-gray-500">{formatDateTime(s.date)}</p>}
                </div>
                {isCurrent && <p className="text-sm text-red-500">Current Status</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Chat helpers
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;
    const msg = { id: Date.now(), from: "driver", text: newMessage.trim(), time: new Date().toISOString() };
    setMessages((m) => [...m, msg]);
    setNewMessage("");
    // scroll behavior would be handled in a real component
  };

  // --- Render fallbacks ---
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <FaSpinner className="animate-spin text-red-500 text-4xl mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">The booking you're looking for could not be found or you don't have permission to view it.</p>
            <button onClick={() => navigate("/my-bookings")} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 mx-auto">
              <FaArrowLeft /> Back to My Bookings
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- Main UI ---
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate("/my-bookings")} className="mb-2 flex items-center gap-2 text-gray-600 hover:text-red-500">
              <FaArrowLeft /> <span>Back to My Bookings</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Booking #{booking.bookingId}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${booking.status === "delivered" ? "bg-green-100 text-green-800" : booking.status === "in_transit" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
                {typeof booking.status === "string" ? booking.status.replace(/_/g, " ") : "Unknown"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{booking.confirmedAt ? `Confirmed: ${formatDateTime(booking.confirmedAt)}` : ""}</p>
          </div>

          <div className="mt-2 sm:mt-0">{renderStatusButton()}</div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex">
            <button onClick={() => setActiveTab("details")} className={`flex-1 py-3 text-center font-medium ${activeTab === "details" ? "text-red-600 border-b-2 border-red-600 bg-red-50" : "text-gray-500 hover:text-gray-700"}`}>
              Booking Details
            </button>
            <button onClick={() => setActiveTab("tracking")} className={`flex-1 py-3 text-center font-medium ${activeTab === "tracking" ? "text-red-600 border-b-2 border-red-600 bg-red-50" : "text-gray-500 hover:text-gray-700"}`}>
              Delivery Tracking
            </button>
            <button onClick={() => setActiveTab("chat")} className={`flex-1 py-3 text-center font-medium ${activeTab === "chat" ? "text-red-600 border-b-2 border-red-600 bg-red-50" : "text-gray-500 hover:text-gray-700"}`}>
              Messages
            </button>
          </div>
        </div>

        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Main details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Route */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaMapMarkerAlt /> Route</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium text-gray-800">{formatLocation(booking.pickup)}</p>
                    {booking.pickup?.landmark && <p className="text-sm text-gray-600 mt-1">Landmark: {booking.pickup.landmark}</p>}
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p className="font-medium text-gray-800">{formatLocation(booking.delivery)}</p>
                    {booking.delivery?.landmark && <p className="text-sm text-gray-600 mt-1">Landmark: {booking.delivery.landmark}</p>}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-sm text-gray-500">Distance</div>
                  <div className="font-medium text-gray-800">{booking.distance}</div>

                  <div className="text-sm text-gray-500">Goods</div>
                  <div className="font-medium text-gray-800">{booking.goods?.type || "N/A"}</div>

                  <div className="text-sm text-gray-500">Schedule</div>
                  <div className="font-medium text-gray-800">{booking.schedule?.date} • {booking.schedule?.time}</div>
                </div>

                {booking.schedule?.specialInstructions && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-100">
                    <p className="text-sm text-yellow-800 font-medium">Special Instructions</p>
                    <p className="text-sm text-yellow-700 mt-1">{booking.schedule.specialInstructions}</p>
                  </div>
                )}
              </div>

              {/* Goods details */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaBoxOpen /> Goods Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-800">{booking.goods?.type || "N/A"}</span>
                  </div>

                  {booking.goods?.items && booking.goods.items.length > 0 && (
                    <div className="py-2">
                      <span className="text-gray-600">Items</span>
                      <ul className="mt-2 list-disc pl-5 text-gray-800">
                        {booking.goods.items.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Driver info (mocked) */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaUser /> Driver</h2>
                {driver ? (
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {driver.profileImage ? (
                        <img src={driver.profileImage} alt={driver.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-red-400 text-3xl"><FaUser /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{driver.fullName}</p>
                      <p className="text-sm text-gray-600">{driver.vehicle?.type} • {driver.vehicle?.license}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <a href={`tel:${driver.phone}`} className="text-red-600 hover:underline"><FaPhone /> <span className="ml-2">{driver.phone}</span></a>
                        <a href={`mailto:${driver.email}`} className="text-red-600 hover:underline"><FaEnvelope /> <span className="ml-2">{driver.email}</span></a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Driver details will appear once assigned.</p>
                )}
              </div>

              {/* Payment summary */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaMoneyBillWave /> Payment</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-sm text-gray-500">Final Price</div>
                  <div className="font-semibold text-gray-800">₹{getActualPrice().toLocaleString("en-IN")}</div>

                  <div className="text-sm text-gray-500">Payment Status</div>
                  <div className={`font-medium ${booking.payment?.status === "paid" || booking.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                    {booking.payment?.status === "paid" || booking.paymentStatus === "paid" ? "Paid" : booking.status !== "pending" ? "Paid" : "Pending"}
                  </div>

                  <div className="text-sm text-gray-500">Payment Method</div>
                  <div className="text-gray-800">{booking.payment?.method || booking.paymentMethod || "Online"}</div>

                  {booking.payment?._id && (
                    <>
                      <div className="text-sm text-gray-500">Payment ID</div>
                      <div className="text-gray-800 font-mono text-sm">{booking.payment._id}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaMapMarkedAlt /> Delivery Status</h2>
                {renderStatusTimeline()}

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <p className="font-medium">{booking.status.replace(/_/g, " ")}</p>
                    </div>

                    <div>{renderStatusButton()}</div>
                  </div>
                </div>
              </div>

              {/* Route preview / open maps */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaMapMarkedAlt /> Route Preview</h2>
                <p className="text-gray-600 text-sm mb-4">{formatLocation(booking.pickup)} → {formatLocation(booking.delivery)}</p>
                <button onClick={() => {
                  const origin = encodeURIComponent(formatLocation(booking.pickup));
                  const destination = encodeURIComponent(formatLocation(booking.delivery));
                  window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`, "_blank");
                }} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">Open in Maps</button>
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigator.clipboard?.writeText(booking.bookingId)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">Copy Booking ID</button>
                  <button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">Print Summary</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Tracking Timeline</h2>
              {renderStatusTimeline()}

              <div className="mt-6">
                <p className="text-sm text-gray-600">Live Location sharing is a backend feature — this demo shows a preview only.</p>
                <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-100 text-sm">Current location: {booking.pickup.city} (mock)</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-medium mb-2">Driver ETA</h3>
                <p className="text-sm text-gray-600">Estimated arrival at pickup: {booking.schedule?.time}</p>
                <div className="mt-4">{driver ? (<p className="text-sm text-gray-800">{driver.fullName} • {driver.vehicle?.type}</p>) : (<p className="text-sm text-gray-500">No driver assigned</p>)}</div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-medium mb-2">Support</h3>
                <p className="text-sm text-gray-600">If you face an issue, contact support: <a className="text-red-600" href="mailto:support@shiftly.com">support@shiftly.com</a></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaCommentDots /> Messages</h2>

            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-64 overflow-auto p-3 border border-gray-100 rounded-lg bg-gray-50">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-500">No messages yet.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`mb-2 ${m.from === "driver" ? "text-right" : "text-left"}`}>
                      <div className={`${m.from === "driver" ? "inline-block bg-red-600 text-white px-3 py-2 rounded-lg" : "inline-block bg-white border border-gray-100 px-3 py-2 rounded-lg"}`}>
                        <p className="text-sm">{m.text}</p>
                        <p className="text-xs text-gray-300 mt-1">{formatDateTime(m.time)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Write a message..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"><FaPaperPlane /> Send</button>
              </form>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ConfirmedBookingDetails;



/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaMoneyBillWave,
  FaStar,
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaShippingFast,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaClipboardList,
  FaLocationArrow,
  FaHistory,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import LiveLocationSharing from "../components/bookings/LiveLocationSharing";

const ConfirmedBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  // Set dynamic page title when component mounts
  useEffect(() => {
    document.title = "Confirmed Job | Transport Assignment | Shiftly";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  // Add this effect to fetch payment details when booking is loaded
  useEffect(() => {
    if (booking && booking.status !== "pending") {
      // Payment endpoint doesn't exist, so we'll rely on booking data
      // console.log("Checking booking data for price information");

      // Log bid information if available
      if (booking.driverBids && Array.isArray(booking.driverBids)) {
        // console.log("Driver bids found:", booking.driverBids);
        const acceptedBid = booking.driverBids.find(
          (bid) => bid.status === "accepted"
        );
        if (acceptedBid) {
          console.log("Found accepted bid:", acceptedBid);
        }
      }
    }
  }, [booking]);

  useEffect(() => {
    if (!booking) return;

    // Normalize status to handle both in_transit and inTransit formats
    if (booking.status === "in_transit") {
      setShipmentStatus("inTransit");
    } else {
      setShipmentStatus(booking.status);
    }
  }, [booking]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("driverToken");
      if (!token) {
        console.error("No driver token found");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch booking details");
      }

      if (data.success && data.booking) {
        // Log detailed debugging information
        // console.log("Booking data received:", data.booking);

        // Log detailed price information
        // console.log("Price details:", {
        //   price: data.booking.price,
        //   finalPrice: data.booking.finalPrice,
        //   acceptedBid: data.booking.acceptedBid,
        //   payment: data.booking.payment,
        //   paymentId: data.booking.paymentId,
        //   estimatedPrice: data.booking.estimatedPrice,
        //   driverBids: data.booking.driverBids,
        // });

        // Log payment information if available
        if (data.booking.payment) {
          // console.log("Payment information:", {
          //   id: data.booking.payment._id,
          //   amount: data.booking.payment.amount,
          //   status: data.booking.payment.status,
          //   method: data.booking.payment.method,
          //   transactionId: data.booking.payment.transactionId,
          // });
        } else if (data.booking.paymentId) {
          console.log(
            "Payment ID found but no payment object:",
            data.booking.paymentId
          );
        }

        // Log price type information
        // console.log("Price type information:", {
        //   priceType: typeof data.booking.price,
        //   finalPriceType: typeof data.booking.finalPrice,
        //   finalPriceValue: data.booking.finalPrice,
        //   acceptedBidType: typeof data.booking.acceptedBid,
        //   hasAcceptedBidAmount: data.booking.acceptedBid
        //     ? typeof data.booking.acceptedBid.amount
        //     : "no acceptedBid",
        // });

        // Calculate the actual price that will be displayed
        const calculatedPrice =
          data.booking.finalPrice ||
          (data.booking.payment && data.booking.payment.amount) ||
          data.booking.price ||
          (data.booking.acceptedBid && data.booking.acceptedBid.amount) ||
          "No price found";

        console.log("Calculated price for display:", calculatedPrice);

        // Add more detailed logging for items
        if (data.booking.goods && data.booking.goods.items) {
          // console.log("Items structure:", data.booking.goods.items);
          // data.booking.goods.items.forEach((item, index) => {
          //   console.log(`Item ${index}:`, item, "Type:", typeof item);
          // });
        }

        // Sanitize the booking data to avoid MongoDB document issues
        const sanitizedBooking = JSON.parse(JSON.stringify(data.booking));

        setBooking(sanitizedBooking);
        setShipmentStatus(sanitizedBooking.status);

        if (sanitizedBooking.userId) {
          // Sanitize the customer data as well
          const sanitizedCustomer = JSON.parse(
            JSON.stringify(sanitizedBooking.userId)
          );
          setCustomer(sanitizedCustomer);
        }
      } else {
        toast.error("Booking not found");
        navigate("/my-bookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("Failed to load booking details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (newStatus) => {
    setUpdateLoading(true);
    try {
      const token = localStorage.getItem("driverToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/driver/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      // Check for network errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update booking status (${response.status})`
        );
      }

      const data = await response.json();

      if (data.success) {
        setShipmentStatus(newStatus);
        setBooking((prev) => ({ ...prev, status: newStatus }));
        toast.success(`Booking marked as ${newStatus}`);

        // Notify WebSocket server about status change - using bookingId (not _id)
        try {
          const wsResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/tracking/update/${
              booking.bookingId || bookingId
            }`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                status: newStatus,
                message: `Driver updated status to ${newStatus}`,
                timestamp: new Date().toISOString(),
              }),
            }
          );

          if (!wsResponse.ok) {
            // Parse error response if possible
            const errorText = await wsResponse.text().catch(() => null);
            console.error(
              "Failed to notify tracking system about status change:",
              errorText || wsResponse.statusText
            );
          } else {
            console.log(
              "Successfully notified tracking system of status change"
            );
          }
        } catch (wsError) {
          console.error("WebSocket notification error:", wsError);
          // Don't fail the entire operation due to WebSocket notification error
        }

        // Reload the booking to ensure we have the latest data
        await fetchBookingDetails();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error(error.message || "Failed to update booking status");
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
    const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  const formatLocation = (location) => {
    if (!location) return "Not specified";

    // Handle string locations
    if (typeof location === "string") return location;

    // Handle object locations
    if (typeof location === "object" && location !== null) {
    const parts = [];

    if (location.addressLine1) parts.push(location.addressLine1);
    if (location.addressLine2) parts.push(location.addressLine2);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.pincode) parts.push(location.pincode);

      return parts.length > 0
        ? parts.join(", ")
        : "Address details not available";
    }

    return "Location format not recognized";
  };

  const getNextStatus = () => {
    const statusFlow = {
      confirmed: "inTransit",
      inTransit: "delivered",
      in_transit: "delivered", // Add support for in_transit format
    };

    return statusFlow[shipmentStatus] || null;
  };

  const getStatusButtonLabel = () => {
    const labels = {
      inTransit: "Start Transit",
      delivered: "Mark as Delivered",
    };

    return labels[getNextStatus()] || "";
  };

  const getStatusButtonIcon = () => {
    const icons = {
      inTransit: <FaShippingFast />,
      delivered: <FaCheckCircle />,
    };

    return icons[getNextStatus()] || null;
  };

  const renderStatusButton = () => {
    if (updateLoading) {
      return (
        <button
          disabled
          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg flex items-center gap-2"
        >
          <FaSpinner className="animate-spin" />
          Updating...
        </button>
      );
    }

    const nextStatus = getNextStatus();
    if (!nextStatus) {
      return (
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
          <FaCheck />
          Delivery Completed
        </div>
      );
    }

      return (
        <button
        onClick={() => updateBookingStatus(nextStatus)}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
        >
        {getStatusButtonIcon()}
        {getStatusButtonLabel()}
        </button>
      );
  };

  const renderStatusTimeline = () => {
    const statuses = [
      {
        id: "confirmed",
        label: "Confirmed",
        icon: <FaCheck />,
        date: booking?.confirmedAt,
      },
      {
        id: "inTransit",
        label: "In Transit",
        icon: <FaShippingFast />,
        date: booking?.inTransitAt,
      },
      {
        id: "delivered",
        label: "Delivered",
        icon: <FaCheckCircle />,
        date: booking?.completedAt,
      },
    ];

    // For completed deliveries, ALL steps should be active and green
    const isDeliveryCompleted = booking.status === "delivered";

    // Map booking status to our status IDs
    const currentStatusId =
      booking.status === "in_transit" ? "inTransit" : booking.status;

      return (
      <div className="space-y-4">
        {statuses.map((status, index) => {
          // When delivery is completed, ALL steps are active and green
          const isActive = isDeliveryCompleted
            ? true
            : currentStatusId === status.id ||
              statuses.findIndex((s) => s.id === currentStatusId) > index;

          const isCurrentStep = currentStatusId === status.id;

          return (
            <React.Fragment key={status.id}>
              <div
                className={`flex items-center ${
                  isDeliveryCompleted
                    ? "text-green-600"
                    : isActive
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isDeliveryCompleted
                      ? "bg-green-100"
                      : isActive
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}
                >
                  {status.icon}
        </div>
                <div className="ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <p className="font-medium mb-1 sm:mb-0">{status.label}</p>
                    {status.date && (
                      <p className="text-sm text-gray-500 sm:ml-4">
                        {formatDate(status.date)}
                      </p>
                    )}
                  </div>
                  {isCurrentStep && (
                    <p
                      className={`text-sm ${
                        isDeliveryCompleted ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isDeliveryCompleted && status.id === "delivered"
                        ? "Delivery Completed Successfully"
                        : "Current Status"}
                    </p>
                  )}
                </div>
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={`h-8 w-0.5 ml-5 ${
                    isDeliveryCompleted
                      ? "bg-green-400"
                      : isActive &&
                        index <
                          statuses.findIndex((s) => s.id === currentStatusId)
                      ? "bg-red-400"
                      : isActive
                      ? "bg-red-200"
                      : "bg-gray-200"
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Function to get the actual price from various possible sources
  const getActualPrice = () => {
    // If booking is not loaded yet, return 0
    if (!booking) return 0;

    // Check for finalPrice first (most reliable source)
    if (booking.finalPrice && parseFloat(booking.finalPrice) > 0) {
      return parseFloat(booking.finalPrice);
    }

    // Check for payment amount if available
    if (
      booking.payment &&
      booking.payment.amount &&
      parseFloat(booking.payment.amount) > 0
    ) {
      return parseFloat(booking.payment.amount);
    }

    // Check for regular price
    if (booking.price && parseFloat(booking.price) > 0) {
      return parseFloat(booking.price);
    }

    // Check for the acceptedBid object
    if (booking.acceptedBid && booking.acceptedBid.amount) {
      return parseFloat(booking.acceptedBid.amount);
    }

    // Check for driver's accepted bid in driverBids array
    if (booking.driverBids && Array.isArray(booking.driverBids)) {
      // First look for the accepted bid
      const acceptedBid = booking.driverBids.find(
        (bid) =>
          bid.status === "accepted" ||
          (bid.driverId &&
            bid.driverId.toString() === booking.driverId?.toString())
      );

      if (acceptedBid && (acceptedBid.price || acceptedBid.amount)) {
        return parseFloat(acceptedBid.price || acceptedBid.amount);
      }

      // If no accepted bid found but driver is assigned, use the first bid's price
      if (booking.driverBids.length > 0) {
        const firstBid = booking.driverBids[0];
        if (firstBid.price || firstBid.amount) {
          return parseFloat(firstBid.price || firstBid.amount);
        }
      }
    }

    // If we have estimated price, return the average
    if (
      booking.estimatedPrice &&
      typeof booking.estimatedPrice === "object" &&
      booking.estimatedPrice.min !== undefined &&
      booking.estimatedPrice.max !== undefined
    ) {
      return (
        (parseFloat(booking.estimatedPrice.min) +
          parseFloat(booking.estimatedPrice.max)) /
        2
      );
    }

    // If all else fails, return 0
    return 0;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <FaSpinner className="animate-spin text-red-500 text-3xl mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The booking you're looking for could not be found or you don't
              have permission to view it.
            </p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 mx-auto"
            >
              <FaArrowLeft />
              Back to My Bookings
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Back button and header *
        <div className="mb-6">
          <button
            onClick={() => navigate("/my-bookings")}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-red-500 cursor-pointer"
          >
            <FaArrowLeft size={14} />
            <span>Back to My Bookings</span>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                  Booking #{booking.bookingId}
                </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                    ${
                      shipmentStatus === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : shipmentStatus === "inTransit"
                        ? "bg-yellow-100 text-yellow-800"
                        : shipmentStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {typeof shipmentStatus === "string"
                      ? shipmentStatus.charAt(0).toUpperCase() +
                        shipmentStatus.slice(1).replace(/([A-Z])/g, " $1")
                      : "Unknown Status"}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">
                    {booking.confirmedAt
                      ? `Confirmed: ${formatDate(booking.confirmedAt)}`
                      : ""}
                </p>
                </div>
              <div className="mt-2 sm:mt-0">{renderStatusButton()}</div>
              </div>
            </div>
        </div>

        {/* Tab navigation *
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 text-center font-medium cursor-pointer transition-colors ${
                activeTab === "details"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaClipboardList className="text-lg" />
                <span className="whitespace-nowrap">Booking Details</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 text-center font-medium cursor-pointer transition-colors ${
                activeTab === "tracking"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaShippingFast className="text-lg" />
                <span className="whitespace-nowrap">Delivery Tracking</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column *
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details Section *
              <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-red-600" /> Customer Information
              </h2>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Customer Photo *
                <div className="flex-shrink-0">
                  {customer?.profileImage ? (
                    <img
                      src={customer.profileImage}
                      alt={customer.fullName || "Customer"}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                      <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                        <FaUser className="text-red-400 text-3xl" />
                    </div>
                  )}
                </div>

                {/* Customer Details *
                <div className="flex-grow space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-800 font-medium">
                      {customer?.fullName || "Not available"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-500" />
                    <a
                      href={`tel:${customer?.phone}`}
                        className="text-red-600 hover:underline cursor-pointer"
                    >
                      {customer?.phone || "Not available"}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <a
                      href={`mailto:${customer?.email}`}
                        className="text-red-600 hover:underline cursor-pointer"
                    >
                      {customer?.email || "Not available"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Details Section *
              <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaShippingFast className="text-red-600" /> Shipment Details
              </h2>

                <div className="space-y-6">
                {/* Pickup and Delivery *
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <FaMapMarkerAlt className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Pickup Address
                        </p>
                          <p className="text-gray-800 font-medium">
                          {formatLocation(booking.pickup)}
                        </p>
                        {booking.pickup?.landmark && (
                          <p className="text-sm text-gray-600 mt-1">
                            Landmark: {booking.pickup.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                    <div className="p-5 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FaMapMarkerAlt className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Delivery Address
                        </p>
                          <p className="text-gray-800 font-medium">
                          {formatLocation(booking.delivery)}
                        </p>
                        {booking.delivery?.landmark && (
                          <p className="text-sm text-gray-600 mt-1">
                            Landmark: {booking.delivery.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other details *
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Schedule *
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <FaCalendarAlt className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Schedule</p>
                          <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                              <span className="text-gray-800 font-medium">
                              {formatDate(booking.schedule?.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400" />
                              <span className="text-gray-800 font-medium">
                              {booking.schedule?.time || "Not specified"}
                            </span>
                          </div>
                        </div>
                          {booking.schedule?.specialInstructions &&
                            typeof booking.schedule.specialInstructions ===
                              "string" && (
                              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1">
                                  <FaInfoCircle /> Special Instructions
                                </h4>
                                <p className="text-sm text-yellow-700">
                              {booking.schedule.specialInstructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                    {/* Goods & Vehicle *
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <FaBoxOpen className="text-yellow-600" />
                      </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Vehicle Type
                            </p>
                            <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
                              <span className="text-gray-600 font-medium">
                                Vehicle Type:
                              </span>
                              <span className="text-gray-800">
                                {(() => {
                                  const vehicleType =
                                    booking.vehicle ||
                                    booking.vehicleType ||
                                    booking.vehicleDetails?.basic?.type;

                                  if (typeof vehicleType === "string") {
                                    return vehicleType
                                      .replace(/_/g, " ")
                                      .split(" ")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ");
                                  }
                                  return "Not specified";
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      </div>
                    </div>
                  </div>

              {/* Goods Details *
              <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBoxOpen className="text-red-600" /> Goods Details
                </h2>

                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Goods Type:
                    </span>
                    <span className="text-gray-800">
                      {booking.goods && booking.goods.type
                        ? booking.goods.type
                            .replace(/_/g, " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : booking.goodsType || "N/A"}
                    </span>
                      </div>

                  {booking.goods &&
                    booking.goods.items &&
                    booking.goods.items.length > 0 && (
                      <div className="flex flex-col md:flex-row md:items-start justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium md:mt-1">
                          Items:
                        </span>
                        <div className="text-gray-800 md:text-right">
                          <ul className="list-disc pl-5 md:pl-0 md:list-none">
                            {booking.goods.items.map((item, index) => (
                              <li key={index} className="mb-1">
                                {typeof item === "string"
                                  ? item
                                  : typeof item === "object" && item !== null
                                  ? (item.name || item.itemName || "Item") +
                                    (item.quantity ? ` (${item.quantity})` : "")
                                  : `Item ${index + 1}`}
                              </li>
                            ))}
                          </ul>
                      </div>
                    </div>
                    )}

                  {booking.goods && booking.goods.additionalItems && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Additional Items:
                      </span>
                      <span className="text-gray-800">
                        {booking.goods.additionalItems}
                      </span>
                  </div>
                  )}

                  {/* Add any other goods details that might be available *
                  {booking.weight && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Weight:</span>
                      <span className="text-gray-800">{booking.weight} kg</span>
                </div>
                  )}

                  {booking.dimensions && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Dimensions:
                      </span>
                      <span className="text-gray-800">
                        {booking.dimensions}
                      </span>
              </div>
                  )}

                  {booking.description && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
                      <span className="text-gray-600 font-medium">
                        Description:
                      </span>
                      <span className="text-gray-800">
                        {booking.description}
                      </span>
                    </div>
                  )}
                </div>
            </div>
          </div>

          {/* Right Column *
          <div className="space-y-6">
            {/* Price Card *
              <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMoneyBillWave className="text-red-600" /> Price Details
              </h2>

              <div className="space-y-3">
                  {/* Final Price - Show this for confirmed bookings *
                  <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      {booking.status !== "pending" ? "Final Price:" : "Price:"}
                    </span>
                    <span className="text-green-600 font-semibold text-lg">
                      ₹{parseFloat(getActualPrice()).toLocaleString("en-IN")}
                  </span>
                </div>

                  {/* Estimated Price - Show for reference *
                  {booking.estimatedPrice &&
                    typeof booking.estimatedPrice === "object" &&
                    booking.estimatedPrice.min !== undefined &&
                    booking.estimatedPrice.max !== undefined && (
                      <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Estimated Price Range:
                        </span>
                        <span className="text-gray-500 font-medium">
                          <span>
                            ₹
                            {Number(booking.estimatedPrice.min).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                          <span className="mx-1">-</span>
                          <span>
                            ₹
                            {Number(booking.estimatedPrice.max).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                    </span>
                  </div>
                    )}

                  {/* Payment Details *
                  <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Payment Status:
                    </span>
                    <span
                      className={`font-medium ${
                        booking.payment?.status === "success" ||
                        booking.paymentStatus === "success" ||
                        booking.payment?.status === "paid" ||
                        booking.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.payment?.status === "success" ||
                      booking.paymentStatus === "success" ||
                      booking.payment?.status === "paid" ||
                      booking.paymentStatus === "paid"
                        ? "Paid"
                        : booking.status !== "pending"
                        ? "Paid"
                        : "Pending"}
                    </span>
                </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
                    <span className="text-gray-600 font-medium">
                      Payment Method:
                    </span>
                    <span className="text-gray-800">
                      {booking.payment?.method
                        ? booking.payment.method.charAt(0).toUpperCase() +
                          booking.payment.method.slice(1)
                        : booking.paymentMethod
                        ? booking.paymentMethod.charAt(0).toUpperCase() +
                          booking.paymentMethod.slice(1)
                        : "Online Payment"}
                    </span>
                  </div>

                  {/* Payment ID if available *
                  {(booking.payment?._id || booking.paymentId) && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-t border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Payment ID:
                      </span>
                      <span className="text-gray-800 font-mono text-sm">
                        {booking.payment?._id || booking.paymentId}
                      </span>
                </div>
                  )}
              </div>
            </div>

              {/* Route Map Preview *
              <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkedAlt className="text-red-600" /> Route Map
              </h2>

                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-100">
                  <div className="text-center w-full mb-4">
                    <FaMapMarkedAlt className="text-gray-400 mx-auto mb-2 text-3xl" />
                    <p className="text-gray-500 text-sm mb-1">Route from:</p>
                    <div className="space-y-1 max-w-full">
                      <p className="font-medium text-gray-700 text-sm line-clamp-2 px-2">
                        {formatLocation(booking.pickup)}
                      </p>
                      <p className="text-xs text-gray-500">to</p>
                      <p className="font-medium text-gray-700 text-sm line-clamp-2 px-2">
                        {formatLocation(booking.delivery)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const origin = encodeURIComponent(
                        formatLocation(booking.pickup)
                      );
                      const destination = encodeURIComponent(
                        formatLocation(booking.delivery)
                      );
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
                        "_blank"
                      );
                    }}
                    className="w-full max-w-[180px] bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition-colors cursor-pointer hover:scale-105 hover:shadow-lg"
                  >
                    Open in Maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tracking Timeline *
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaShippingFast className="text-red-600" /> Delivery Status
                  Timeline
                </h2>

                <div
                  className={`p-4 ${
                    booking.status === "delivered"
                      ? "bg-green-50 border-green-100"
                      : "bg-red-50 border-red-100"
                  } rounded-lg mb-6 border`}
                >
                  <div className="flex items-start gap-2">
                    <FaInfoCircle
                      className={
                        booking.status === "delivered"
                          ? "text-green-500 mt-1"
                          : "text-red-500 mt-1"
                      }
                    />
                    <p
                      className={
                        booking.status === "delivered"
                          ? "text-green-700 text-sm"
                          : "text-red-700 text-sm"
                      }
                    >
                      {booking.status === "delivered"
                        ? "The shipment has been successfully delivered to the customer. Thank you for completing this delivery!"
                        : "Keep your customer informed about their delivery. The status timeline shows your progress through each stage."}
                    </p>
                  </div>
                </div>

                {renderStatusTimeline()}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Current Status
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          booking.status === "delivered"
                            ? "text-green-600 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {booking.status === "confirmed" && "Ready for pickup"}
                        {(booking.status === "inTransit" ||
                          booking.status === "in_transit") &&
                          "On the way to delivery location"}
                        {booking.status === "delivered" &&
                          "🎉 Delivery successfully completed"}
                      </p>
                    </div>

                    {getNextStatus() && booking.status !== "delivered" && (
                      <button
                        onClick={() => updateBookingStatus(getNextStatus())}
                        disabled={updateLoading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer w-full sm:w-auto justify-center"
                      >
                        {updateLoading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {getStatusButtonIcon()}
                            {getStatusButtonLabel()}
                          </>
                        )}
                      </button>
                    )}

                    {booking.status === "delivered" && (
                      <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center">
                        <FaCheckCircle />
                        Delivery Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Support - Moved to be after status timeline *
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaInfoCircle
                      className={
                      booking.status === "delivered"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                  Need Help?
                </h2>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-700 mb-3">
                    {booking.status === "delivered"
                      ? "If you have any questions about this completed delivery, contact our support team:"
                      : "If you encounter any issues during delivery, contact our support team:"}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-red-500" />
                      <a
                        href="tel:+918765432100"
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        +91 8765432100
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-red-500" />
                      <a
                        href="mailto:support@shiftly.com"
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        support@shiftly.com
                      </a>
                    </div>
                  </div>
                </div>
                  </div>
                </div>

            {/* Right Column - Location Sharing *
            <div className="space-y-6">
              {/* Live Location Sharing - Completely replaced using booking.status directly *
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaLocationArrow
                    className={
                      booking.status === "delivered"
                      ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                  {booking.status === "delivered"
                    ? "Delivery Map"
                    : "Live Location Sharing"}
                </h2>

                {booking.status === "delivered" ? (
                  /* COMPLETED BOOKING - Show delivery completed with green styling 
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-5 border border-green-100 text-center">
                      <div className="flex flex-col items-center mb-4">
                        <FaCheckCircle className="text-green-500 text-3xl mb-3" />
                        <p className="text-gray-800 font-medium">
                          Delivery Completed Successfully
                        </p>
                        <p className="text-gray-600 text-sm mt-1 mb-5">
                          You can view the delivery route and details
                        </p>
                      </div>

                      {/* Add tracking page link *
                      <div className="mt-3 flex justify-center">
                        <Link
                          to={`/tracking/${booking._id}`}
                          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <FaMapMarkedAlt />
                          View Delivery Map
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : booking.status === "inTransit" ||
                  booking.status === "in_transit" ? (
                  /* IN TRANSIT BOOKING - Show transit information with red styling *
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
                      <p className="text-gray-700 mb-4">
                        You are currently in transit. Use the tracking map to
                        view and share your live location with the customer.
                      </p>

                      {/* Add tracking page link *
                      <div className="mt-3 flex justify-center">
                        <Link
                          to={`/tracking/${booking._id}`}
                          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <FaMapMarkedAlt />
                          Open Tracking Map
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CONFIRMED BOOKING - Show start transit option with yellow styling 
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center py-4">
                    <div className="flex flex-col items-center mb-4">
                      <FaExclamationTriangle className="text-yellow-500 text-3xl mb-3" />
                      <p className="text-gray-700 font-medium">
                        Location sharing will be available
                      </p>
                      <p className="text-sm text-gray-500 mt-1 mb-5">
                        Once you start the transit, you can share your live
                        location with the customer
                      </p>
                    </div>
                    <button
                      onClick={() => updateBookingStatus("inTransit")}
                      disabled={updateLoading}
                      className="w-full max-w-[200px] bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer mx-auto"
                    >
                      {updateLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaShippingFast />
                          Start Transit Now
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery Instructions *
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClipboardList
                      className={
                      booking.status === "delivered"
                          ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                  {booking.status === "delivered"
                    ? "Delivery Summary"
                    : "Delivery Instructions"}
                </h2>

                <div
                  className={`p-4 ${
                    booking.status === "delivered"
                      ? "bg-green-50 border-green-100"
                      : "bg-blue-50 border-blue-100"
                  } rounded-lg border`}
                >
                  <div className="space-y-3">
                    {booking.status === "delivered" ? (
                      <>
                        <p className="text-gray-700 font-medium flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" /> Delivery
                          Completed
                        </p>
                        <p className="text-gray-600 text-sm">
                          This delivery has been successfully completed. The
                          customer has received their shipment.
                        </p>
                        <div className="pt-3 border-t border-green-200 mt-3">
                          <p className="text-gray-700 font-medium">
                            Delivery Details:
                          </p>
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="flex justify-between py-1">
                              <span>Delivery Date:</span>
                              <span className="font-medium">
                                {formatDate(booking?.completedAt || new Date())}
                              </span>
                  </div>
                            <div className="flex justify-between py-1">
                              <span>Delivery Location:</span>
                              <span className="font-medium">
                                {
                                  formatLocation(booking?.delivery).split(
                                    ","
                                  )[0]
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 font-medium">
                          Instructions for Delivery:
                        </p>

                        <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                          <li>
                            Confirm the delivery address before proceeding
                          </li>
                          <li>Contact the customer before arrival</li>
                          <li>
                            Verify the recipient's identity before handover
                          </li>
                          <li>
                            Take a photo of the delivered goods if possible
                          </li>
                          <li>
                            Update the status to "Delivered" once completed
                          </li>
                        </ul>
                      </>
                    )}

                    {booking.schedule?.specialInstructions &&
                      typeof booking.schedule.specialInstructions ===
                        "string" && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                          <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1">
                            <FaInfoCircle /> Special Instructions
                          </h4>
                          <p className="text-sm text-yellow-700">
                            {booking.schedule.specialInstructions}
                    </p>
                  </div>
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConfirmedBookingDetails;*/
