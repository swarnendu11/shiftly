import { FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";

export default function TransactionHistory() {
  const transactions = [
    { id: 1, title: "Household Goods", status: "pending", date: "2025-09-10" },
    { id: 2, title: "Office Equipment", status: "completed", date: "2025-09-08" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Bigger font + spacing like My Bookings */}
        <h1 className="text-3xl font-bold mb-8">Transaction History</h1>

        {transactions.length === 0 ? (
          <p className="text-gray-600">No transactions found.</p>
        ) : (
          <div className="space-y-6">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <FaTruck className="text-primary text-xl" />
                  <h2 className="font-semibold text-lg">{txn.title}</h2>
                </div>

                {/* Date */}
                <p className="text-gray-500 text-sm mb-2">Date: {txn.date}</p>

                {/* Status */}
                <div className="flex items-center justify-start">
                  {txn.status === "completed" ? (
                    <span className="flex items-center gap-2 text-green-600 font-medium">
                      <FaCheckCircle /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-yellow-600 font-medium">
                      <FaClock /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
