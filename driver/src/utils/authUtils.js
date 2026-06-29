/**
 * Checks if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if token is expired or invalid, false otherwise
 */
/**
 * Checks if a token is expired (frontend-safe mock version)
 * For real JWTs, it decodes normally; for mock tokens, it returns false (not expired).
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  // If we're using a mock token, just treat it as valid
  if (token === "mock.header.payload" || token.startsWith("mock")) {
    return false;
  }

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.warn("Skipping token decode (invalid or mock token):", error);
    return false; // Treat any unparsable token as valid in frontend-only mode
  }
};

  
  /**
   * Clears all driver auth data from localStorage
   */
  export const clearDriverAuth = () => {
    localStorage.removeItem('driverToken');
    localStorage.removeItem('driverName');
    localStorage.removeItem('driverUsername');
    localStorage.removeItem('driverId');
    localStorage.removeItem('rememberMe');
  };