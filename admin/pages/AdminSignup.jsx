import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaSpinner, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [adminCodeError, setAdminCodeError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Set dynamic page title when component mounts
  useEffect(() => {
    document.title = "Admin Registration | Shiftly Admin Panel";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validatePassword = (value) => {
    const digitPattern = new RegExp('\\d');
    const letterPattern = new RegExp('[a-zA-Z]');
    const specialChars = '!@#$%^&*(),.?":{}|<>';
    
    const hasNumber = digitPattern.test(value);
    const hasLetter = letterPattern.test(value);
    const hasSpecialChar = value.split('').some(char => specialChars.includes(char));
    
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else if (!hasNumber || !hasLetter) {
      setPasswordError("Password must contain at least 1 number and 1 letter");
    } else if (!hasSpecialChar) {
      setPasswordError("Password must contain at least 1 special character");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const validateAdminCode = (value) => {
    const validCodes = ["ADMIN2024", "SUPERADMIN2024"];
    if (value && !validCodes.includes(value)) {
      setAdminCodeError("Invalid admin registration code");
    } else {
      setAdminCodeError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setError("Please accept the terms and conditions.");
      return;
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    if (adminCode !== "ADMIN2024" && adminCode !== "SUPERADMIN2024") {
      setAdminCodeError("Invalid admin registration code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock admin registration
      const adminRole = adminCode === "SUPERADMIN2024" ? "superadmin" : "admin";
      
      localStorage.setItem("adminToken", "admin-jwt-token");
      localStorage.setItem("adminEmail", email);
      localStorage.setItem("adminName", fullName);
      localStorage.setItem("adminRole", adminRole);
      
      navigate("/admin/dashboard");
    } catch {
      setError("Failed to create admin account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
        <div className="w-full max-w-md bg-[#151616af] p-8 rounded-lg shadow-lg mx-4 mt-29 mb-8">
        <div className="text-center mb-6">
          <FaShieldAlt className="text-4xl text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Admin Registration</h1>
          <p className="text-gray-300 mt-2">Create admin account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-base font-medium text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-base font-medium text-white mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="admin@shiftly.com"
              required
            />
          </div>

          {/* Admin Code */}
          <div>
            <label className="block text-base font-medium text-white mb-2">
              Admin Registration Code
            </label>
            <input
              type="text"
              value={adminCode}
              onChange={(e) => {
                setAdminCode(e.target.value);
                validateAdminCode(e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter admin code"
              required
            />
            {adminCodeError && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {adminCodeError}
              </p>
            )}
            {!adminCodeError && adminCode && (
              <p className="text-green-400 text-sm mt-1 flex items-center">
                <FaCheck className="mr-1" /> Valid admin code
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/10 text-white placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter secure password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {passwordError}
              </p>
            )}
            {!passwordError && password.length > 0 && (
              <p className="text-green-400 text-sm mt-1 flex items-center">
                <FaCheck className="mr-1" /> Strong password
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-base font-medium text-white mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/10 text-white placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {confirmPasswordError}
              </p>
            )}
            {!confirmPasswordError && confirmPassword.length > 0 && (
              <p className="text-green-400 text-sm mt-1 flex items-center">
                <FaCheck className="mr-1" /> Passwords match
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2 cursor-pointer mt-1"
              required
            />
            <span className="text-sm text-white">
              I accept the{" "}
              <Link to="/terms-and-conditions" target="_blank" className="text-red-400 hover:underline">
                terms and conditions
              </Link>{" "}
              and understand the admin responsibilities
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin h-5 w-5 mr-3 text-white" />
                Creating Admin Account...
              </div>
            ) : (
              <div className="flex items-center">
                <FaShieldAlt className="text-lg mr-2" />
                Create Admin Account
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-600">
          <p className="text-center text-sm text-gray-400">
            Valid Admin Codes:
          </p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>ADMIN2024 - Regular Admin</p>
            <p>SUPERADMIN2024 - Super Admin</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white text-sm">
            Already have an admin account?{" "}
            <Link to="/admin/login" className="text-red-400 hover:underline">
              Login here
            </Link>
          </p>
          <Link
            to="/"
            className="text-red-400 hover:text-red-300 text-sm underline mt-2 block"
          >
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;

