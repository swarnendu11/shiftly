import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  PersonalDetails,
  BankDetails,
  VehicleDetails,
} from "../components/profile";
import TabNavigation from "../components/profile/TabNavigation";
import {
  FaCamera,
  FaCheck,
  FaUser,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import ImageViewModal from "../components/profile/ImageViewModal";

const DriverProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "Swarnendu Das",
    username: "swarnendu",
    email: "",
    phone: "",
    profileImage: "",
    isVerified: true,
    totalTrips: 10,
    rating: "4.8",
    joinedDate: "2023-06-15",
    personalDetails: {
      isEditing: false,
      fullName: "Swarnendu Das",
      firstName: "Swarnendu",
      middleName: "",
      lastName: "Das",
      dateOfBirth: "",
      gender: "",
      contact: {
        mobile: "",
        alternateMobile: "",
        email: "",
        isMobileVerified: false,
        isEmailVerified: false,
      },
      address: {
        current: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
        },
      },
      documents: {
        drivingLicense: { number: "", file: null, status: "pending" },
        aadhaar: { number: "", file: null, status: "pending" },
        panCard: { number: "", file: null, status: "pending" },
      },
    },
    bankDetails: {
      isEditing: false,
      accountHolder: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
      ifscCode: "",
      branchDetails: "",
      payoutFrequency: "monthly",
      isVerified: false,
      documents: { passbook: { file: null, status: "pending" } },
    },
    vehicleDetails: {
      isEditing: false,
      basic: { type: "", make: "", model: "", year: "", color: "" },
      registration: {
        number: "",
        date: "",
        rcFront: null,
        rcBack: null,
        rcFrontStatus: "pending",
        rcBackStatus: "pending",
        fitnessExpiryDate: "",
        permitType: "",
        isVerified: false,
      },
      specifications: {
        loadCapacity: "",
        dimensions: { length: "", width: "", height: "" },
        photos: { front: "", back: "", left: "", right: "", interior: "" },
        features: [],
        fuelType: "",
      },
      insurance: {
        provider: "",
        policyNumber: "",
        expiryDate: "",
        document: null,
        documentStatus: "pending",
        isVerified: false,
      },
      maintenance: { lastServiceDate: "", nextServiceDue: "", odometer: "", healthScore: 0 },
    },
  });

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleSectionEdit = (section, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], isEditing: value },
    }));
  };

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      toast.success("Profile photo updated successfully");
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePhoto = () => {
    setFormData((prev) => ({ ...prev, profileImage: "" }));
    toast.success("Profile photo removed successfully");
  };

  const handleTabChange = (newTab) => {
    const isEditing = formData[`${activeTab}Details`]?.isEditing;
    if (isEditing) {
      setShowWarningModal(true);
      setPendingTabChange(newTab);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleModalConfirm = () => {
    setFormData((prev) => ({
      ...prev,
      [`${activeTab}Details`]: { ...prev[`${activeTab}Details`], isEditing: false },
    }));
    setActiveTab(pendingTabChange);
    setShowWarningModal(false);
  };

  const handleModalCancel = () => {
    setShowWarningModal(false);
    setPendingTabChange(null);
  };

  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);

  useEffect(() => {
    document.title = "Driver Profile | Shiftly";
    window.scrollTo(0, 0);
  }, []);

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="h-40 bg-gradient-to-r from-red-800 to-blue-900"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col items-center -mt-24">
                <div className="relative">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                    {formData.profileImage ? (
                      <div
                        className="relative group cursor-pointer"
                        onClick={openImageModal}
                      >
                        <img
                          src={formData.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          View Photo
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FaUser className="text-5xl md:text-6xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePhotoUpload}
                      disabled={isUploadingImage}
                    />
                    <div className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform group-hover:scale-110">
                      {isUploadingImage ? (
                        <FaSpinner className="text-lg animate-spin" />
                      ) : (
                        <FaCamera className="text-lg" />
                      )}
                    </div>
                  </label>
                </div>
                <div className="mt-4 text-center">
                  <h1 className="text-2xl font-bold text-gray-900">{formData.fullName}</h1>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-gray-600 text-lg font-semibold">@{formData.username}</span>
                    {formData.isVerified && (
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FaCheck className="text-green-500" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-xl text-center">
                    <p className="text-sm text-blue-600">Total Trips</p>
                    <p className="text-xl font-semibold text-blue-700">{formData.totalTrips}</p>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-xl text-center">
                    <p className="text-sm text-green-600">Rating</p>
                    <p className="text-xl font-semibold text-green-700">{formData.rating}</p>
                  </div>
                  <div className="bg-purple-50 px-4 py-2 rounded-xl text-center">
                    <p className="text-sm text-purple-600">Member Since</p>
                    <p className="text-xl font-semibold text-purple-700">{new Date(formData.joinedDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />

          {/* Warning Modal */}
          {showWarningModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 no-scroll">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Unsaved Changes</h3>
                <p className="text-gray-600 mb-6">
                  You have unsaved changes. If you leave this tab, your changes will be lost. Do you want to proceed?
                </p>
                <div className="flex justify-end gap-4">
                  <button onClick={handleModalCancel} className="px-4 py-2 bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-300 rounded-lg">Cancel</button>
                  <button onClick={handleModalConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Leave Without Saving</button>
                </div>
              </div>
            </div>
          )}

          {/* Sections */}
          <div className="mt-8 space-y-8">
            {activeTab === "personal" && (
              <PersonalDetails
                data={formData.personalDetails}
                onEdit={(v) => handleSectionEdit("personalDetails", v)}
                onUpdate={(d) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullName: d.fullName,
                    personalDetails: d,
                    phone: d.contact.mobile,
                  }))
                }
              />
            )}
            {activeTab === "bank" && (
              <BankDetails data={formData.bankDetails} onEdit={(v) => handleSectionEdit("bankDetails", v)} onUpdate={(d) => setFormData((prev) => ({ ...prev, bankDetails: d }))} />
            )}
            {activeTab === "vehicle" && (
              <VehicleDetails data={formData.vehicleDetails} onEdit={(v) => handleSectionEdit("vehicleDetails", v)} onUpdate={(d) => setFormData((prev) => ({ ...prev, vehicleDetails: d }))} />
            )}
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-700 flex items-start gap-2">
              <FaExclamationTriangle className="text-yellow-500 mt-0.5" />
              Please ensure all necessary documents are uploaded and verified. Your profile completion and verification status depends on the submission of valid documents.
            </p>
          </div>
        </div>
      </div>

      {showImageModal && formData.profileImage && (
        <ImageViewModal
          image={formData.profileImage}
          fullName={formData.fullName}
          onClose={closeImageModal}
          onDelete={handleRemoveProfilePhoto}
          onUpload={handleProfilePhotoUpload}
        />
      )}
    </DashboardLayout>
  );
};

export default DriverProfile;
