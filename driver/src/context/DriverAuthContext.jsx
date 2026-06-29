import { createContext, useContext, useState, useCallback } from "react";

/**
 * Driver Authentication Context
 * Simplified for frontend-only (no backend, no JWT decoding)
 */
const DriverAuthContext = createContext();

export const DriverAuthProvider = ({ children }) => {
  // Check if user is already logged in
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("driverToken"));
  const [driverId, setDriverId] = useState(() => {
    const token = localStorage.getItem("driverToken");
    return token ? "mockDriverId" : null; // fixed for frontend-only use
  });

  // Get the current auth token
  const getToken = useCallback(() => {
    return localStorage.getItem("driverToken");
  }, []);

  // Login function - saves token & updates auth state
  const login = useCallback((token, id = "mockDriverId") => {
    localStorage.setItem("driverToken", token);
    setIsAuth(true);
    setDriverId(id);
  }, []);

  // Logout function - clears auth data
  const logout = useCallback(() => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverName");
    localStorage.removeItem("driverUsername");
    localStorage.removeItem("driverId");
    localStorage.removeItem("driverBids");
    localStorage.removeItem("rememberMe");
    setIsAuth(false);
    setDriverId(null);
  }, []);

  return (
    <DriverAuthContext.Provider
      value={{
        isAuth,
        driverId,
        getToken,
        login,
        logout,
      }}
    >
      {children}
    </DriverAuthContext.Provider>
  );
};

// Custom hook to use the driver auth context
export const useDriverAuth = () => {
  const context = useContext(DriverAuthContext);
  if (!context) {
    throw new Error("useDriverAuth must be used within a DriverAuthProvider");
  }
  return context;
};

export default DriverAuthProvider;
