import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaMoneyBillWave, FaTruck, FaFilter, FaSearch, FaMapMarkerAlt, FaClock, FaBoxOpen, FaChevronRight, FaLocationArrow, FaWifi, FaMinus, FaPlus, FaRupeeSign } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const AvailableBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);
  const [filters, setFilters] = useState({
    date: "",
    loadType: "",
    priceMin: "",
    priceMax: "",
  });

  const mockBookings = [
    { id: "BK001", pickup: "Mumbai, Maharashtra - 400001", delivery: "Pune, Maharashtra - 411001", loadType: "Construction Material", priceRange: "1000-3000", date: "2025-10-25", distance: "150 km", expectedDuration: "3-4 hours", weight: "2000 kg" },
    { id: "BK002", pickup: "Delhi, Delhi - 110001", delivery: "Agra, Uttar Pradesh - 282001", loadType: "Household Goods", priceRange: "2000-4000", date: "2025-10-26", distance: "230 km", expectedDuration: "5-6 hours", weight: "1000 kg" },
    { id: "BK003", pickup: "Chennai, Tamil Nadu - 600001", delivery: "Coimbatore, Tamil Nadu - 641001", loadType: "Electronics", priceRange: "3000-5000", date: "2025-10-27", distance: "500 km", expectedDuration: "8-9 hours", weight: "800 kg" },
  ];

  useEffect(() => {
    document.title = "Available Jobs | Shiftly - A Seamless Transport System";
    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
  }, []);

  useEffect(() => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.delivery.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.date) filtered = filtered.filter((b) => b.date === filters.date);
    if (filters.loadType) filtered = filtered.filter((b) => b.loadType.toLowerCase() === filters.loadType.toLowerCase());
    if (filters.priceMin) filtered = filtered.filter((b) => parseInt(b.priceRange.split("-")[0]) >= parseInt(filters.priceMin));
    if (filters.priceMax) filtered = filtered.filter((b) => parseInt(b.priceRange.split("-")[1]) <= parseInt(filters.priceMax));

    setFilteredBookings(filtered);
  }, [filters, searchTerm, bookings]);

  const handleResetFilters = () => {
    setFilters({ date: "", loadType: "", priceMin: "", priceMax: "" });
    setFilterActive(false);
    setSearchTerm("");
    setFilteredBookings(bookings);
  };

  const getUniqueLoadTypes = () => [...new Set(bookings.map((b) => b.loadType))];

  const formatPriceRange = (range) => {
    const [min, max] = range.split("-").map(Number);
    return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden bg-gray-50">
        <main className="h-full p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Available Bookings</h1>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-green-600 flex items-center gap-1">
                <FaWifi className="text-xs" />
                Connected
              </span>
              • <span>{filteredBookings.length} bookings found</span>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by location or ID..."
                  className="pl-11 pr-4 py-3 w-full rounded-xl border-2 border-gray-100 focus:border-red-500 focus:ring focus:ring-red-200 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Radius */}
              <div className="relative">
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-700 shadow-sm">
                  <FaLocationArrow className="text-red-500" />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(Math.max(1, Number(e.target.value)))}
                      className="w-16 bg-transparent border-none text-center font-medium focus:outline-none"
                    />
                    <span className="text-gray-600">km</span>
                  </div>
                  <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-2">
                    <button
                      onClick={() => setSearchRadius((prev) => Math.max(1, prev - 5))}
                      className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <button
                      onClick={() => setSearchRadius((prev) => prev + 5)}
                      className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setFilterActive(!filterActive)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 transition-all ${
                  filterActive
                    ? "bg-red-50 border-red-500 text-red-600"
                    : "border-gray-100 text-gray-700 hover:border-gray-200"
                }`}
              >
                <FaFilter className={filterActive ? "text-red-500" : "text-gray-400"} />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Options */}
            {filterActive && (
              <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline-block mr-2 text-red-500" /> Date
                  </label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="w-full p-2.5 rounded-lg border-2 border-gray-100 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBoxOpen className="inline-block mr-2 text-red-500" /> Load Type
                  </label>
                  <select
                    value={filters.loadType}
                    onChange={(e) => setFilters({ ...filters, loadType: e.target.value })}
                    className="w-full p-2.5 rounded-lg border-2 border-gray-100 focus:border-red-500"
                  >
                    <option value="">All Types</option>
                    {getUniqueLoadTypes().map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Price Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMoneyBillWave className="inline-block mr-2 text-red-500" /> Price Range (₹)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <FaRupeeSign className="absolute left-3 top-3 text-gray-400 text-sm" />
                      <input
                        type="number"
                        placeholder="Min"
                        className="pl-8 pr-2 py-2.5 w-full rounded-lg border-2 border-gray-100 focus:border-red-500"
                        value={filters.priceMin}
                        onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <FaRupeeSign className="absolute left-3 top-3 text-gray-400 text-sm" />
                      <input
                        type="number"
                        placeholder="Max"
                        className="pl-8 pr-2 py-2.5 w-full rounded-lg border-2 border-gray-100 focus:border-red-500"
                        value={filters.priceMax}
                        onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleResetFilters}
                    className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 transition rounded-lg flex items-center justify-center gap-2"
                  >
                    <FiTrash className="text-gray-500" /> Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {filteredBookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-red-50 rounded-t-lg px-4 py-2 flex justify-between">
                  <span className="text-red-600 font-semibold flex items-center text-sm">
                    <FaMoneyBillWave className="mr-1" /> Price Range
                  </span>
                  <span className="text-lg font-bold">{formatPriceRange(b.priceRange)}</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">{b.id}</span>
                    <span className="text-sm text-gray-500">{formatDate(b.date)}</span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">{b.pickup}</h4>
                        <p className="text-sm text-gray-500">Pickup Location</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">{b.delivery}</h4>
                        <p className="text-sm text-gray-500">Delivery Location</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" /> {b.distance}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" /> {b.expectedDuration}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <FaBoxOpen className="text-gray-400" /> {b.loadType} ({b.weight})
                    </div>
                  </div>
                  <button
                    className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-2"
                    onClick={() => {
                      localStorage.setItem("selectedBooking", JSON.stringify(b));
                      navigate(`/booking/${b.id}`);
                    }}
                  >
                    View Details <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default AvailableBookings;
