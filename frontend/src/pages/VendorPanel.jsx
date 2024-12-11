import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VendorPanel = ({ user }) => {
  const [events, setEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState("");
  const [ticketsToAdd, setTicketsToAdd] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/events")
      .then((res) => setEvents(res.data))
      .catch((err) =>
        toast.error("Failed to load events. Please try again later.")
      );
  }, [analyticsData]);

  const handleAddTickets = () => {
    axios
      .post("http://localhost:5000/events/add", {
        eventId: selectedEvent,
        ticketsToAdd: parseInt(ticketsToAdd),
      })
      .then((res) => {
        toast.success(res.data.message);
        setTicketsToAdd(0); // Reset
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to add tickets.")
      );
  };

  const fetchAnalytics = () => {
    if (!selectedEvent) {
      toast.warn("Select an event to view analytics!");
      return;
    }
    axios
      .get(`http://localhost:5000/analytics/${selectedEvent}`)
      .then((res) => setAnalyticsData(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to fetch analytics.")
      );
  };

  const chartData = {
    labels: analyticsData ? Object.keys(analyticsData) : [],
    datasets: [
      {
        label: "Tickets Sold",
        data: analyticsData ? Object.values(analyticsData) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Ticket Sales Over Time" },
    },
  };

  return (
    <div className="min-h-screen bg-[#0f1c35] py-8 px-4 sm:px-10 lg:px-8">
      <ToastContainer theme="dark" />
      <h2 className="text-3xl font-bold text-center text-white mb-8">
        Welcome, {user.username}
      </h2>
      <h2 className="text-xl font-semibold text-center text-gray-300 mb-4">Admin</h2>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Add Tickets Section */}
        <div className="bg-[#223b61] p-6 rounded-lg shadow-lg border border-sky-500">
          <h3 className="text-xl font-semibold text-white mb-4">
            Add Tickets to Event
          </h3>
          <select
            onChange={(e) => setSelectedEvent(e.target.value)}
            value={selectedEvent}
            className="w-full bg-[#1e2c47] text-white p-3 rounded-lg mb-4"
          >
            <option value="">Select an event</option>
            {Object.values(events).map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Tickets to Add"
            value={ticketsToAdd}
            onChange={(e) => setTicketsToAdd(e.target.value)}
            className="w-full bg-[#1e2c47] text-white p-3 rounded-lg mb-4"
          />
          <button
            onClick={handleAddTickets}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Add Tickets
          </button>
        </div>

        {/* Analytics Section */}
        <div className="bg-[#223b61] p-6 rounded-lg shadow-lg border border-sky-500">
          <h3 className="text-xl font-semibold text-white mb-4">
            Sales Analytics
          </h3>
          <button
            onClick={fetchAnalytics}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-6"
          >
            View Analytics
          </button>
          {analyticsData ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p className="text-gray-300">Select an event to view analytics.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPanel;
