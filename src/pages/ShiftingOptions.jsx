import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";

export default function ShiftingOptions() {
  // Sidebar collapsed by default
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();



  const cards = [
    {
      title: "Household Shifting",
      caption: "Safe and reliable moving for your home belongings.",
      color: "bg-blue-500",
      link: "/book-transport",
    },
    {
      title: "Office Shifting",
      caption: "Efficient relocation services for your workspace.",
      color: "bg-purple-500",
      link: "#",
    },
    {
      title: "Industrial Shifting",
      caption: "Heavy-duty logistics for factories and warehouses.",
      color: "bg-green-500",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar toggleSidebar={toggleSidebar} />

      {/* Sidebar is fixed, so give main content a left margin */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main
        className={`p-6 md:p-10 mt-20 transition-all duration-200 ${
          isSidebarOpen ? "ml-[200px]" : "ml-[94px]"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Select Shifting Type
          </h1>

          {/* Top two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.slice(0, 2).map((c) => (
              <div
                key={c.title}
                onClick={() => c.link !== "#" && navigate(c.link)}
                className={`cursor-pointer rounded-xl p-6 text-white shadow-md hover:shadow-xl transition ${c.color}`}
              >
                <h2 className="text-xl font-bold mb-2">{c.title}</h2>
                <p className="text-sm opacity-90">{c.caption}</p>
              </div>
            ))}
          </div>

          {/* Bottom centered card */}
          <div className="mt-6 flex justify-center">
            <div
              onClick={() =>
                cards[2].link !== "#" && navigate(cards[2].link)
              }
              className={`cursor-pointer rounded-xl p-6 text-white shadow-md hover:shadow-xl transition ${cards[2].color} w-full md:w-1/2`}
            >
              <h2 className="text-xl font-bold mb-2">{cards[2].title}</h2>
              <p className="text-sm opacity-90">{cards[2].caption}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
