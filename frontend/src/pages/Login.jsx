import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/login", { username, password })
      .then((res) => {
        onLogin(res.data.user);
        toast.success("Login successful!"); // Success
      })
      .catch(() => {
        toast.error("Invalid credentials!"); // Error
      });
  };

  return (
    <div className="min-h-screen bg-[#0f1c35] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#223b61] rounded-lg shadow-lg border border-sky-500">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-[#1e2c47] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#1e2c47] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Login
          </button>
        </form>
      </div>

      {/* Toastify Container */}
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Login;
