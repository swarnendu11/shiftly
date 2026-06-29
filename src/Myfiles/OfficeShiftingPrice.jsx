import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import worldMap from "../assets/worldmap.png";
import {
  FaCalculator,
  FaRoad,
  FaBoxOpen,
  FaTruck,
  FaShippingFast,
  FaShieldAlt,
} from "react-icons/fa";

const OfficeShiftingPrice = () => {
  const [distance, setDistance] = useState(0);
  const [goodsType, setGoodsType] = useState("workstations");
  const [vehicleType, setVehicleType] = useState("tempo");
  const [urgency, setUrgency] = useState("standard");
  const [insurance, setInsurance] = useState("none");
  const [priceRange, setPriceRange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [distanceError, setDistanceError] = useState("");
  const [vehicleError, setVehicleError] = useState("");
  const [activeSection, setActiveSection] = useState("calculator");

  useEffect(() => {
    document.title =
      "Office Shifting Price | Shiftly - A Seamless Transport System";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (goodsType === "servers_racks" && vehicleType === "mini") {
      setVehicleError("Mini Truck is not suitable for server racks. Select Tempo or larger.");
    } else if (goodsType === "conference_tables" && vehicleType === "mini") {
      setVehicleError("Mini Truck may not fit conference tables. Choose Tempo or larger.");
    } else {
      setVehicleError("");
    }
  }, [goodsType, vehicleType]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const calculatePrice = () => {
    if (distance < 1) {
      setDistanceError("Please enter a valid distance greater than 1 km.");
      return;
    }
    if (vehicleError) return;
    setDistanceError("");

    const baseFareTable = {
      mini: [360, 540, 720],
      tempo: [540, 720, 900],
      large: [900, 980, 1250],
      container: [1150, 1350, 1700],
    };

    const costPerKmTable = {
      mini: [14, 20, 18],
      tempo: [18, 24, 22],
      large: [31, 29, 27],
      container: [36, 34, 31],
    };

    let rateIndex = 0;
    if (distance > 50 && distance <= 300) rateIndex = 1;
    else if (distance > 300) rateIndex = 2;

    const baseFare = baseFareTable[vehicleType][rateIndex];
    const costPerKm = costPerKmTable[vehicleType][rateIndex];
    const distanceCharge = costPerKm * distance;

    const goodsFeeTable = {
      workstations: 500,
      computers_it: 600,
      conference_tables: 800,
      documents_files: 350,
      servers_racks: 1200,
    };
    const goodsFee = goodsFeeTable[goodsType];

    const urgencyMultiplier = {
      standard: 1,
      express: 1.1,
      priority: 1.2,
    }[urgency];

    const insuranceCost = {
      none: 0,
      basic: 150,
      full: 300,
    }[insurance];

    const subtotal =
      (baseFare + distanceCharge + goodsFee) * urgencyMultiplier + insuranceCost;

    const gstAmount = subtotal * 0.18;
    const totalPrice = subtotal + gstAmount;

    const roundedTotal = Math.floor(totalPrice / 100) * 100;
    const lowerRange = roundedTotal;
    const upperRange = roundedTotal + 1800;

    setPriceRange({ lower: lowerRange, upper: upperRange });
    setIsModalOpen(true);
  };

  return (
    <>
      <main className="pt-20">
        <motion.section
          className="bg-gradient-to-r from-gray-900 to-body-dark py-20 px-6 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-cover bg-center opacity-10"></div>
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Office Shifting Price Calculator
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Get instant estimates for relocating your office — from workstations and
              computers to servers and files — with minimal downtime.
            </motion.p>
          </div>
        </motion.section>

        <section className="bg-white border-b border-gray-200 top-20 z-30">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center">
              <button
                onClick={() => setActiveSection("calculator")}
                className={`px-6 py-4 text-lg font-medium transition-all cursor-pointer ${
                  activeSection === "calculator"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <FaCalculator className="inline mr-2 mb-1" />
                Price Calculator
              </button>
              <button
                onClick={() => setActiveSection("factors")}
                className={`px-6 py-4 text-lg font-medium transition-all cursor-pointer ${
                  activeSection === "factors"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <FaBoxOpen className="inline mr-2 mb-1" />
                Pricing Factors
              </button>
              <button
                onClick={() => setActiveSection("faq")}
                className={`px-6 py-4 text-lg font-medium transition-all cursor-pointer ${
                  activeSection === "faq"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <FaShippingFast className="inline mr-2 mb-1" />
                Shipping FAQ
              </button>
            </div>
          </div>
        </section>

        {activeSection === "calculator" && (
        <motion.section
          className="py-16 px-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 opacity-100">
            <img src={worldMap} alt="World Map" className="w-full h-full object-contain" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                    Estimate Your Office Relocation Cost
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Enter the details below to get an accurate estimate tailored for office relocation.
                  </p>

                  <form>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaRoad className="inline mr-2 text-primary" />
                        Distance (km)
                      </label>
                      <input
                        type="number"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || !isNaN(value)) {
                            setDistance(value === "" ? 0 : Number(value));
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter distance in kilometers"
                      />
                      {distanceError && (
                        <p className="text-red-500 text-sm mt-2">{distanceError}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaBoxOpen className="inline mr-2 text-primary" />
                        Office Items Category
                      </label>
                      <select
                        value={goodsType}
                        onChange={(e) => setGoodsType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white [&>option]:text-black"
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E%29",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1rem",
                        }}
                      >
                        <option value="workstations">Workstations & Chairs</option>
                        <option value="computers_it">Computers & IT Peripherals</option>
                        <option value="conference_tables">Conference Tables & Cabinets</option>
                        <option value="documents_files">Documents & Files (Boxed)</option>
                        <option value="servers_racks">Servers & Rack Equipment</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaTruck className="inline mr-2 text-primary" />
                        Vehicle Type
                      </label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white [&>option]:text-black"
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E%29",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1rem",
                        }}
                      >
                        <option value="mini">Mini Truck (Small Loads)</option>
                        <option value="tempo">Tempo (Office Moves)</option>
                        <option value="large">Large Truck (14ft)</option>
                        <option value="container">Container Truck (20-32ft)</option>
                      </select>
                      {vehicleError && (
                        <p className="text-red-500 text-sm mt-2">{vehicleError}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaShippingFast className="inline mr-2 text-primary" />
                        Urgency Level
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="radio"
                            value="standard"
                            checked={urgency === "standard"}
                            onChange={() => setUrgency("standard")}
                            className="absolute opacity-0"
                          />
                          <span
                            className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                              urgency === "standard" ? "bg-primary border-primary" : "bg-white"
                            }`}
                          ></span>
                          <div>
                            <p className="font-medium text-gray-800">Standard</p>
                            <p className="text-xs text-gray-500">Regular delivery time</p>
                          </div>
                        </label>
                        <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="radio"
                            value="express"
                            checked={urgency === "express"}
                            onChange={() => setUrgency("express")}
                            className="absolute opacity-0"
                          />
                          <span
                            className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                              urgency === "express" ? "bg-primary border-primary" : "bg-white"
                            }`}
                          ></span>
                          <div>
                            <p className="font-medium text-gray-800">Express</p>
                            <p className="text-xs text-gray-500">+10% faster delivery</p>
                          </div>
                        </label>
                        <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="radio"
                            value="priority"
                            checked={urgency === "priority"}
                            onChange={() => setUrgency("priority")}
                            className="absolute opacity-0"
                          />
                          <span
                            className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                              urgency === "priority" ? "bg-primary border-primary" : "bg-white"
                            }`}
                          ></span>
                          <div>
                            <p className="font-medium text-gray-800">Priority</p>
                            <p className="text-xs text-gray-500">+20% premium service</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaShieldAlt className="inline mr-2 text-primary" />
                        Insurance Option
                      </label>
                      <div className="grid grid-cols-1 gap-4">
                        <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="radio"
                            value="none"
                            checked={insurance === "none"}
                            onChange={() => setInsurance("none")}
                            className="absolute opacity-0"
                          />
                          <span
                            className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                              insurance === "none" ? "bg-primary border-primary" : "bg-white"
                            }`}
                          ></span>
                          <div>
                            <p className="font-medium text-gray-800">No Insurance</p>
                            <p className="text-xs text-gray-500">Standard shipping without additional protection</p>
                          </div>
                        </label>
                        <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="radio"
                            value="basic"
                            checked={insurance === "basic"}
                            onChange={() => setInsurance("basic")}
                            className="absolute opacity-0"
                          />
                          <span
                            className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                              insurance === "basic" ? "bg-primary border-primary" : "bg-white"
                            }`}
                          ></span>
                          <div>
                            <p className="font-medium text-gray-800">Basic Insurance</p>
                            <p className="text-xs text-gray-500">Covers minor damage, up to ₹15,000</p>
                          </div>
                        </label>
                        <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="radio"
                            value="full"
                            checked={insurance === "full"}
                            onChange={() => setInsurance("full")}
                            className="absolute opacity-0"
                          />
                          <span
                            className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                              insurance === "full" ? "bg-primary border-primary" : "bg-white"
                            }`}
                          ></span>
                          <div>
                            <p className="font-medium text-gray-800">Full Coverage</p>
                            <p className="text-xs text-gray-500">Covers all damages, up to ₹75,000</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={calculatePrice}
                      className="w-full bg-gradient-to-br from-red-500 to-pink-600 text-white py-3 px-4 md:py-4 md:px-6 rounded-lg md:text-lg font-semibold hover:bg-primary-dark transition-colors duration-300 cursor-pointer shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Calculate My Price
                    </motion.button>
                  </form>

                  <p className="text-gray-500 text-sm mt-4 text-center">
                    *The generated price is an estimation. Actual price may vary based on site access, lift availability, and packing needs.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Why Shift Offices with Us?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 mt-1.5">Minimal downtime, weekend options</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 mt-1.5">IT equipment handling expertise</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 mt-1.5">Transparent pricing with GST</p>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  className="bg-transparent bg-opacity-10 p-6 rounded-xl shadow-lg border border-primary border-opacity-30"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="text-xl font-bold text-primary mb-4">Need Help?</h3>
                  <p className="text-gray-700 mb-4">
                    Our support team can help you plan your office move and choose the right vehicle.
                  </p>
                  <Link
                    to="/contact-us"
                    className="block w-full py-3 bg-gradient-to-br from-red-500 to-pink-600 text-white text-center rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 hover:scale-105 cursor-pointer  hover:shadow-lg hover:shadow-red-300"
                  >
                    Contact Support
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
        )}

        {activeSection === "factors" && (
        <motion.section
          className="py-16 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Pricing Factors for Office Shifting
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Your estimate considers distance, vehicle type, category of office items, urgency,
                insurance and on-site constraints like floors/lifts and packing needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-blue-500"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <FaRoad className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Distance</h3>
                <p className="text-gray-600">
                  Longer road distance increases fuel, time and toll costs. Rates vary by band
                  (0-50km, 51-300km, 300km+).
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-green-500"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <FaTruck className="text-2xl text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Vehicle Type</h3>
                <p className="text-gray-600">
                  Mini for small moves, Tempo for typical offices, Large/Container for bulk or
                  rack equipment; bigger vehicles cost more but fit better.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-purple-500"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <FaBoxOpen className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Office Items</h3>
                <p className="text-gray-600">
                  Workstations are easier than conference tables or server racks which need
                  special handling and add higher fees.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-red-500"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <FaShippingFast className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Urgency</h3>
                <p className="text-gray-600">
                  Express (+10%) or Priority (+20%) options increase price to ensure faster slots
                  and additional resources.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-amber-500"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <FaShieldAlt className="text-2xl text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Insurance</h3>
                <p className="text-gray-600">
                  Optional coverage protects equipment during transit and slightly increases the
                  final estimate.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-gray-500"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3a1 1 0 01.894.553l6 12A1 1 0 0116 17H4a1 1 0 01-.894-1.447l6-12A1 1 0 0110 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Site Constraints</h3>
                <p className="text-gray-600">
                  Floor access, availability of lifts, tight staircases, or extra packing impacts
                  the on-site effort and cost.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
        )}

        {activeSection === "faq" && (
        <motion.section
          className="py-16 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Office Shifting FAQ</h2>
              <p className="text-gray-600">Common questions about estimates, vehicles, and move-day logistics.</p>
            </div>

            <div className="space-y-6">
              <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">How accurate is the estimate?</h3>
                  <p className="text-gray-600">Estimates are typically close if inputs are accurate. Final pricing may vary based on floor access, packing needs, and waiting time on the day.</p>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Which vehicle should I choose?</h3>
                  <p className="text-gray-600">For most offices, a Tempo works well. Choose Large/Container for bulk furniture or servers. Mini is suitable only for small offices and limited items.</p>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Do you handle IT equipment and servers?</h3>
                  <p className="text-gray-600">Yes. Please select the appropriate category (Computers & IT or Servers & Racks) so we can include special handling and correct vehicle sizing.</p>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Is packing included?</h3>
                  <p className="text-gray-600">Basic loading/unloading is included. Packing, dismantling/reassembly, and special materials may add to the price depending on your needs.</p>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">What about GST and invoices?</h3>
                  <p className="text-gray-600">All estimates include 18% GST. We provide invoices suitable for business accounting and claim purposes.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
        )}

        <section className="bg-gradient-to-r from-gray-900 to-body-dark py-16 px-6 relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Shift Your Office?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Book a reliable office relocation with experienced drivers and real-time tracking.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-primary-dark transition-all shadow-lg cursor-pointer hover:scale-105"
              >
                Sign Up & Book
              </Link>
              <Link
                to="/how-it-works"
                className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-body-dark transition-colors cursor-pointer"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50 p-4 overflow-y-auto no-scrollbar">
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md my-8 mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ maxHeight: "90vh" }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 32px)" }}>
              <div className="text-center mb-4">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
                  <FaCalculator className="text-2xl sm:text-3xl text-green-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Estimated Price Range</h3>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-primary">
                  ₹{priceRange?.lower} - ₹{priceRange?.upper}
                </div>
              </div>

              <div className="space-y-3 text-gray-700 mb-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">Distance:</span>
                  <span className="font-medium text-sm sm:text-base">{distance} km</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">Category:</span>
                  <span className="font-medium text-sm sm:text-base">
                    {goodsType === "workstations" ? "Workstations & Chairs" :
                    goodsType === "computers_it" ? "Computers & IT Peripherals" :
                    goodsType === "conference_tables" ? "Conference Tables & Cabinets" :
                    goodsType === "documents_files" ? "Documents & Files" : "Servers & Rack Equipment"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">Vehicle:</span>
                  <span className="font-medium text-sm sm:text-base">
                    {vehicleType === "mini" ? "Mini Truck" : vehicleType === "tempo" ? "Tempo" : vehicleType === "large" ? "Large Truck" : "Container Truck"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">Urgency:</span>
                  <span className="font-medium text-sm sm:text-base">
                    {urgency === "standard" ? "Standard" : urgency === "express" ? "Express" : "Priority"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">Insurance:</span>
                  <span className="font-medium text-sm sm:text-base">
                    {insurance === "none" ? "No Insurance" : insurance === "basic" ? "Basic" : "Full Coverage"}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-700 mb-4">
                <p className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Estimate includes GST. Final price may vary based on floor access, dismantling, packing, and waiting time.</span>
                </p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer">
                  Close
                </button>
                <Link to="/login" className="flex-1 bg-gradient-to-br from-red-500 to-pink-600 text-white p-3 rounded-lg hover:bg-primary-dark transition-colors font-medium text-center cursor-pointer">
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default OfficeShiftingPrice;
