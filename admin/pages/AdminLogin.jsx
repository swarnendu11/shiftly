import { useState, useEffect } from "react";
import { FaTimes, FaSpinner, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailError("");
    setPasswordError("");

    try {
      const result = await login(email, password);
      
      if (result.success) {
        localStorage.setItem("rememberMe", rememberMe);
        navigate("/admin/dashboard");
      } else {
        setError(result.error || "Invalid admin credentials. Please check your email and password.");
      }
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Set dynamic page title
  useEffect(() => {
    document.title = "Admin Login | Shiftly Admin Panel";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-redirect if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
        <div className="w-full max-w-md bg-[#151616af] p-8 rounded-lg shadow-lg mx-4 mt-29 mb-10">
        <div className="text-center mb-6">
          <FaShieldAlt className="text-4xl text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-300 mt-2">Access the admin control panel</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
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
            {emailError && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {emailError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/10 text-white placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-lg" />
                ) : (
                  <FaEye className="text-lg" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {passwordError}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 cursor-pointer"
            />
            <span className="text-sm text-white">Remember me</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-lg" />
                Signing in...
              </>
            ) : (
              <>
                <FaShieldAlt className="text-lg" />
                Access Admin Panel
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-600">
          <p className="text-center text-sm text-gray-400">
            Demo Credentials:
          </p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>Email: admin@shiftly.com | Password: admin123</p>
            <p>Email: superadmin@shiftly.com | Password: superadmin123</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-red-400 hover:text-red-300 text-sm underline"
          >
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


