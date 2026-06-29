import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix map resize when container changes (scroll, sidebar toggle, etc.)
const ResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300); // delay ensures DOM is ready
  }, [map]);
  return null;
};

const LiveTrackingMap = ({ bookingId, initialLocation, isDelivered }) => {
  const [location, setLocation] = useState(initialLocation || null);
  const [route, setRoute] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setError(null);

        if (!import.meta.env.VITE_BACKEND_URL) {
          // ✅ Demo route (Bally → Rishrah)
          const demoRoute = [
            { lat: 22.6504, lng: 88.3410 }, // Bally pickup
            { lat: 22.7312, lng: 88.3456 }, // Rishrah delivery
          ];
          setLocation(demoRoute[0]); // Start at pickup
          setRoute(demoRoute);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/tracking/live/${bookingId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch live location");
        }

        if (data.success && data.location) {
          setLocation(data.location);
          if (data.route) {
            setRoute(data.route);
          }
        } else {
          throw new Error("No live location available");
        }
      } catch (err) {
        console.error("Error fetching live location:", err);
        setError(err.message || "Error loading map");
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600">
        <FaExclamationTriangle className="text-3xl mb-2" />
        <p className="text-center text-sm">Error loading map</p>
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Loading live location...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={location}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <ResizeHandler />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={location} />
        {route.length > 1 && <Polyline positions={route} color="red" />}
      </MapContainer>

      {/* ✅ Buttons */}
      <div className="absolute bottom-4 left-4 flex gap-3 z-[1000]">
        <button
          onClick={() => setLocation(route[0])} // Jump to pickup
          className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
        >
          Find Driver
        </button>
        <button
          onClick={() => setRoute(route.length ? route : [location])}
          className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
        >
          Show Route
        </button>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
