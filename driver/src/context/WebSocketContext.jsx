import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

/**
 * Frontend-only WebSocket mock context
 * Prevents real socket errors when no backend exists.
 */

const WebSocketContext = createContext({
  isConnected: true, // always "connected" in frontend mode
  on: () => {},
  off: () => {},
  send: () => {},
  placeBid: async () => ({ success: true, message: "Mock bid placed" }),
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [isConnected] = useState(true);

  // Mock send method
  const send = useCallback((eventType, data) => {
    console.log(`[Mock WebSocket] Sent ${eventType}:`, data);
    return true;
  }, []);

  // Mock event handlers
  const on = useCallback((eventType, handler) => {
    console.log(`[Mock WebSocket] Listening for ${eventType}`);
    return () => {};
  }, []);

  const off = useCallback((eventType, handler) => {
    console.log(`[Mock WebSocket] Stopped listening for ${eventType}`);
  }, []);

  // Mock bid placement
  const placeBid = useCallback(async (bookingId, amount, note) => {
    console.log(`[Mock WebSocket] Placing bid for booking ${bookingId}`);
    toast.success("Bid placed successfully (mock)");
    return {
      success: true,
      message: "Mock bid placed successfully",
      bookingId,
      amount,
      note,
    };
  }, []);

  const contextValue = {
    isConnected,
    on,
    off,
    send,
    placeBid,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
