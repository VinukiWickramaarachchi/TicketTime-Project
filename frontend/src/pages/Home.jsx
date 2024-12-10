import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:5000");

const Home = ({ user }) => {
  const [events, setEvents] = useState({});
  const [quantities, setQuantities] = useState({}); // Track quantities for each event

  useEffect(() => {
    axios.get("http://localhost:5000/events").then((res) => {
      setEvents(res.data);
    });

    socket.on("ticketsUpdated", (updatedEvents) => {
      setEvents(updatedEvents);
    });

    return () => {
      socket.disconnect();
    };
  }, [events]);

  const handleQuantityChange = (eventId, value) => {
    // Allow empty input or only parse numbers
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setQuantities((prev) => ({
        ...prev,
        [eventId]: value === "" ? "" : Math.max(0, Number(value)),
      }));
    }
  };

  const purchaseTicket = (eventId) => {
    const maxTickets = user.isVIP ? 50 : 5;
    const quantity = quantities[eventId] || 1;

    if (quantity > maxTickets) {
      toast.error(`You can only buy up to ${maxTickets} tickets!`);
      return;
    }

    axios
      .post("http://localhost:5000/tickets/purchase", {
        eventId,
        userId: user.id,
        quantity,
      })
      .then((res) => toast.success(res.data.message))
      .catch((err) =>
        toast.error(err.response?.data?.message || "An error occurred")
      );
  };

  return (
    <div className="min-h-screen bg-[#0f1c35] py-8 px-4 sm:px-10 lg:px-8">
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />

      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Welcome, To TicketTime!
      </h1>
      <h2 className="text-xl font-semibold text-center text-gray-300 mb-4">
        {user.isVIP ? "VIP User" : "Normal User"}
      </h2>

      <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {Object.values(events).map((event) => (
          <div
            key={event.id}
            className="bg-[#223b61] shadow-lg rounded-lg overflow-hidden border border-[#1e2c47] hover:scale-105 hover:shadow-xl"
          >
            <img
              src={event.image || "https://via.placeholder.com/400x200"}
              alt={event.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-300 mb-4">
                {event.description || "No description available."}
              </p>
              <p className="text-gray-200 mb-2">
                <span className="font-medium">Price:</span> ${event.price}
              </p>
              <p className="text-gray-200 mb-4">
                <span className="font-medium">Tickets Remaining:</span>{" "}
                {event.tickets}
              </p>
              <input
                type="number"
                min="1"
                max={user.isVIP ? 50 : 5}
                value={quantities[event.id] || ""}
                onChange={(e) => handleQuantityChange(event.id, e.target.value)}
                placeholder="Enter ticket quantity"
                className="w-full mb-4 p-2 text-black text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />

              <button
                onClick={() => purchaseTicket(event.id)}
                disabled={event.tickets <= 0}
                className={`w-full py-2 px-4 rounded-lg font-medium ${
                  event.tickets > 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-gray-800"
                }`}
              >
                {event.tickets > 0 ? "Buy Ticket" : "Sold Out"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
