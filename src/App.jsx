import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ✅ renamed import
import BookTransportHousehold from "./pages/BookTransportHousehold";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import MyBookings from "./pages/MyBookings";
import BookingDetailPage from "./pages/BookingDetailPage";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import ConditionalRoute from "./components/ConditionalRoute";
import { isDashboardPath } from "./utils/routeUtils";
import TrackingPage from "./pages/TrackingPage";
import CustomerTrackingPage from "./pages/CustomerTrackingPage";
import ProfilePage from "./pages/ProfilePage";
import { ProfileProvider } from "./context/ProfileContext";
import Settings from "./pages/Settings";
import NotificationsPage from "./pages/NotificationsPage";
import PublicRoute from "./components/PublicRoute";
import { WebSocketProvider } from "./context/WebSocketContext";
import { Toaster } from "react-hot-toast";
import HowItWorks from "./pages/HowItWorks";
import CalculatePricePage from "./pages/CalculatePricePage";
import AboutUs from "./pages/About";
import ContactUs from "./pages/Contact";
import Services from "./pages/Services";
import PrivacyPolicy from "./pages/Privacypolicy";
import TermsandConditions from "./pages/TermsConditions";
import FAQsPage from "./pages/FAQsPage";

// ✅ Import HaveAQuestion
import HaveAQuestion from "./components/HaveAQuestion";
import TransactionHistory from "./pages/TransactionHistory";
import { useEffect } from "react";

// ✅ NEW: Import shifting pages
import ShiftingOptions from "./pages/ShiftingOptions";

// ✅ NEW: Import DriverLogin
import OfficeShiftingPrice from "./Myfiles/OfficeShiftingPrice";
import AdminApp from "../admin/App";
import DriverApp from "../driver/src/App";

const AppWrapper = () => {
  const location = useLocation();

  // ✅ Store a demo bookingId in localStorage if none exists
  useEffect(() => {
    if (!localStorage.getItem("lastTrackingId")) {
      localStorage.setItem("lastTrackingId", "demo123");
    }
  }, []);

  const isDashboardRoute =
    isDashboardPath(location.pathname) ||
    location.pathname.startsWith("/payment/") ||
    location.pathname.startsWith("/user/") ||
    location.pathname.startsWith("/track/") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/driver");

  const verifyEmail = new URLSearchParams(location.search).get("email");
  const resetToken = new URLSearchParams(location.search).get("token");

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/driver" element={<Navigate to="/driver/login" replace />} />
        <Route path="/driver/*" element={<DriverApp />} />

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/calculate-price" element={<CalculatePricePage />} />
        <Route path="/office-shifting-price" element={<OfficeShiftingPrice />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/terms-and-conditions" element={<TermsandConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/tracking/:bookingId" element={<TrackingPage />} />

        {/* ✅ New Help Center Route */}
        <Route path="/help" element={<HaveAQuestion />} />

        {/* ✅ New Shifting Pages */}
        <Route path="/ShiftingOptions" element={<ShiftingOptions />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <ConditionalRoute
              element={
                <PublicRoute>
                  <VerifyEmail />
                </PublicRoute>
              }
              condition={!!verifyEmail}
              redirectTo="/signup"
            />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ConditionalRoute
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
              condition={!!resetToken}
              redirectTo="/forgot-password"
            />
          }
        />
        
        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/*" element={<Dashboard />} />

          {/* ✅ updated route element */}
          <Route path="/book-transport/*" element={<BookTransportHousehold />} />

          <Route path="/my-bookings/*" element={<MyBookings />} />
          <Route path="/my-bookings/:bookingId" element={<BookingDetailPage />} />
          <Route path="/track/:bookingId" element={<CustomerTrackingPage />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/user/:username" element={<ProfilePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Route>
        
       </Routes>
       {!isDashboardRoute && <Footer />}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              border: "1px solid #10B981",
              borderLeft: "4px solid #10B981",
            },
          },
          error: {
            style: {
              border: "1px solid #EF4444",
              borderLeft: "4px solid #EF4444",
            },
          },
        }}
      />
    </>
  );
};

export default function App() {
  return (
    <ProfileProvider>
      <WebSocketProvider>
        <Router>
          <AppWrapper />
        </Router>
      </WebSocketProvider>
    </ProfileProvider>
  );
}





// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Footer from "./components/Footer";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";

// export default function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }
