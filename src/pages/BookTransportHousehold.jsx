import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../components/booking/StepProgress";
import AddressStep from "../components/booking/AddressStep";
import GoodsStep from "../components/booking/GoodsStep";
import VehicleStep from "../components/booking/VehicleStep";
import ScheduleStep from "../components/booking/ScheduleStep";
import ConfirmationModal from "../components/booking/ConfirmationModal";
import BookingSuccess from "../components/booking/BookingSuccess";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import { calculateBookingPrice } from "../utils/priceCalculator";
import { FaExclamationCircle } from "react-icons/fa";

const BookTransport = () => {
  const navigate = useNavigate();

  // Simulate profile check hook
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [user, setUser] = useState({ username: "demoUser" });
  const [loading, setLoading] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Address details
    pickupAddressId: "",
    pickupStreet: "",
    pickupCity: "",
    pickupState: "",
    pickupPincode: "",
    pickupLandmark: "",
    deliveryStreet: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryPincode: "",
    deliveryLandmark: "",

    // Goods details
    goodsType: "household_small",
    items: {},
    additionalItems: "",

    // Vehicle details
    vehicleType: "",

    // Schedule details
    date: "",
    time: "",
    urgency: "standard",
    insurance: "none",
    specialInstructions: "",
  });

  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    document.title =
      "Book Transport | Request a Service | Shiftly - A Seamless Transport System";
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

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1: // Address Step
        if (!formData.pickupAddressId) {
          if (!formData.pickupStreet) {
            newErrors.pickupStreet = "Address Line 1 is required for pickup";
          }
          if (!formData.pickupCity) {
            newErrors.pickupCity = "City is required for pickup";
          }
          if (!formData.pickupState) {
            newErrors.pickupState = "State is required for pickup";
          }
          if (!formData.pickupPincode) {
            newErrors.pickupPincode = "PIN Code is required for pickup";
          }
        }
        if (!formData.deliveryStreet) {
          newErrors.deliveryStreet = "Address Line 1 is required for delivery";
        }
        if (!formData.deliveryCity) {
          newErrors.deliveryCity = "City is required for delivery";
        }
        if (!formData.deliveryState) {
          newErrors.deliveryState = "State is required for delivery";
        }
        if (!formData.deliveryPincode) {
          newErrors.deliveryPincode = "PIN Code is required for delivery";
        }
        break;

      case 2: // Goods Step
        if (Object.keys(formData.items).length === 0) {
          newErrors.items = "Please select at least one item to transport";
        }
        break;

      case 3: // Vehicle Step
        if (!formData.vehicleType) {
          newErrors.vehicleType = "Please select a vehicle type";
        }
        break;

      case 4: // Schedule Step
        if (!formData.date) {
          newErrors.date = "Please select a pickup date";
        }
        if (!formData.time) {
          newErrors.time = "Please select a pickup time";
        }
        if (!formData.urgency) {
          newErrors.urgency = "Please select urgency level";
        }
        if (!formData.insurance) {
          newErrors.insurance = "Please select insurance coverage";
        }
        break;
    }
    return newErrors;
  };

  const calculateDistance = async () => {
    try {
      // For frontend-only project, simulate distance (random 10–100 km)
      const simulatedDistance = Math.floor(Math.random() * 90) + 10;
      console.log("Simulated distance:", simulatedDistance, "km");
      return simulatedDistance;
    } catch (error) {
      console.error("Error calculating distance:", error);
      return 50;
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      const allErrors = {};
      let hasErrors = false;
      for (let step = 1; step <= 4; step++) {
        const stepErrors = validateStep(step);
        if (Object.keys(stepErrors).length > 0) {
          hasErrors = true;
          Object.assign(allErrors, stepErrors);
        }
      }
      setErrors(allErrors);

      if (!hasErrors) {
        try {
          const calculatedDistance = await calculateDistance();
          if (calculatedDistance) {
            setDistance(calculatedDistance);
            setShowConfirmation(true);
          } else {
            throw new Error("Could not calculate distance");
          }
        } catch (error) {
          console.error("Error calculating distance:", error);
          setDistance(50);
          setShowConfirmation(true);
        }
      }
    }
  };

  const getFormattedAddress = (prefix) => {
    return `${formData[`${prefix}Street`] || ""}, 
            ${formData[`${prefix}City`] || ""}, 
            ${formData[`${prefix}State`] || ""} - 
            ${formData[`${prefix}Pincode`] || ""}
            ${
              formData[`${prefix}Landmark`]
                ? `, ${formData[`${prefix}Landmark`]}`
                : ""
            }`.trim();
  };

  const getBookingDetails = () => {
    return {
      ...formData,
      pickupAddress: getFormattedAddress("pickup"),
      deliveryAddress: getFormattedAddress("delivery"),
      distance: distance,
    };
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingDetails = getBookingDetails();
      const priceDetails = calculateBookingPrice(bookingDetails);

      // Simulate bookingId
      const fakeBookingId = "BOOK-" + Date.now();

      // Simulated booking data (for console log only)
      const bookingData = {
        ...bookingDetails,
        estimatedPrice: {
          min: priceDetails.lowerRange,
          max: priceDetails.upperRange,
        },
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      console.log("Booking created (simulated):", bookingData);

      setBookingId(fakeBookingId);
      setShowConfirmation(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.message || "Failed to create booking. Please try again.");
    }
  };

  const goToProfile = () => {
    if (user && user.username) {
      navigate(`/user/${user.username}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 mt-20 md:ml-20 lg:ml-24">
      {!loading && !isProfileComplete && !showProfileModal ? (
        <div className="max-w-6xl mx-auto mt-5">
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
                    Please update your mobile number in your profile to book
                    transport services.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="ml-1 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none cursor-pointer hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-red-300"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Book Transport
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <StepProgress
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-lg">
            <div className="p-6">
              {currentStep === 1 && (
                <AddressStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  savedAddresses={savedAddresses}
                  setSavedAddresses={setSavedAddresses}
                />
              )}
              {currentStep === 2 && (
                <GoodsStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 3 && (
                <VehicleStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 4 && (
                <ScheduleStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className={`px-6 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 ${
                currentStep === 1 ? "ml-auto" : ""
              }`}
            >
              {currentStep === 4 ? "Book Now" : "Next"}
            </button>
          </div>

          {showConfirmation && (
            <ConfirmationModal
              isOpen={showConfirmation}
              onClose={() => setShowConfirmation(false)}
              onConfirm={handleConfirmBooking}
              bookingDetails={getBookingDetails()}
            />
          )}
          {showSuccess && <BookingSuccess bookingId={bookingId} />}
        </div>
      )}

      {!loading && user && (
        <ProfileUpdateModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          username={user.username}
        />
      )}
    </div>
  );
};

export default BookTransport;
