/**
 * Global configuration for the Admin app
 */

const config = {
  // API endpoints
  API_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",

  // WebSocket configuration
  WEBSOCKET_URL: import.meta.env.VITE_WS_URL || "ws://localhost:5000",

  // App configuration
  APP_NAME: "Shiftly Admin",
  VERSION: "1.0.0",
};

export default config;

