import { useState, useEffect } from "react";
import { FaTimes, FaEye, FaEyeSlash, FaSpinner, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import authBg from "../assets/login-bg.png";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameOrEmailError, setUsernameOrEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Set dynamic page title
  useEffect(() => {
    document.title =
      "Driver Login | Access Your Account | Shiftly - A Seamless Transport System";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    let isValid = true;
    if (!usernameOrEmail) {
      setUsernameOrEmailError("Username or email is required");
      isValid = false;
    } else {
      setUsernameOrEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    // Simulate API delay
    setTimeout(() => {
      // Mock login logic
      if (
        (usernameOrEmail === "swarnendu" || usernameOrEmail === "swarnendu@example.com") &&
        password === "123456"
      ) {
        // Save fake token and driver info to localStorage
        localStorage.setItem("driverToken", "mock-token-123456");
        localStorage.setItem("driverName", "Swarnendu Das");
        localStorage.setItem("driverUsername", "swarnendu");
        localStorage.setItem("rememberMe", rememberMe);
        navigate("/dashboard");
      } else {
        setError("Invalid username/email or password");
      }

      setIsLoading(false);
    }, 1000);
  };

  // Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("driverToken");
    if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={authBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-black/10"></div>
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-md p-8 bg-white/90 rounded-2xl shadow-2xl space-y-6 z-10 mx-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">Welcome!</h1>
          <p className="text-gray-600">Log in to continue to your dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                setUsernameOrEmailError("");
                setError("");
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="Enter your username or email"
              required
            />
            {usernameOrEmailError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {usernameOrEmailError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {passwordError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </div>
            <a
              href="/forgot-password"
              className="text-sm text-red-500 hover:text-red-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] font-medium text-lg shadow-lg cursor-pointer flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin mr-2" />
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-red-500 hover:text-red-600 hover:underline font-medium"
          >
            Create Account
          </Link>
        </p>
         <div className="text-center">
          <button
            onClick={() => (window.location.href = "http://localhost:5175/")}
            className="mt-4 inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:underline font-medium transition-all"
          >
            <FaHome className="text-red-500" />
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
