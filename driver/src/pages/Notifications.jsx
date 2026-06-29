import { useState, useEffect } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      text: "New booking request from Salt Lake to Park Street",
      time: "Just now",
      read: false,
      icon: <FaMapMarkerAlt className="text-green-500 text-2xl" />,
    },
    {
      id: 2,
      type: "payment",
      text: "Payment of ₹1,200 has been credited to your account",
      time: "2 hours ago",
      read: false,
      icon: <FaMoneyBillWave className="text-blue-500 text-2xl" />,
    },
    {
      id: 3,
      type: "rating",
      text: "You received a 5-star rating from your last trip",
      time: "1 day ago",
      read: false,
      icon: <FaStar className="text-yellow-500 text-2xl" />,
    },
  ]);

  useEffect(() => {
    document.title = "Notifications | Shiftly";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-20 md:ml-22 lg:ml-24">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <FaBell className="text-3xl text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm text-red-500 hover:text-red-600 flex items-center space-x-1"
          >
            <FaCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl shadow-md p-6 flex justify-between items-start transition-all duration-300 hover:shadow-lg ${
                !notification.read ? "border-l-8 border-red-500" : "border-l-8 border-gray-200"
              }`}
            >
              <div className="flex items-start space-x-5">
                <div className="mt-1">{notification.icon}</div>
                <div>
                  <p className="text-lg text-gray-800 font-medium leading-relaxed">
                    {notification.text}
                  </p>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-500 hover:text-blue-600"
                    title="Mark as read"
                  >
                    <FaCheck className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Delete notification"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <FaBell className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notifications to show</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

