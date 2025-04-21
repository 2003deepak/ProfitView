import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import themeStore from "../store/themeStore";

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { theme } = themeStore((state) => state);

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const resp = await axios.post("http://localhost:3000/api/register", {
        username,
        password,
        email,
      });

      if (resp.data.status === "success") {
        setConfirmation(resp.data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        setError(resp.data.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen transition-colors ${
        theme === "dark" ? "bg-[#121212]" : "bg-[#f9f9f9]"
      }`}
    >
      <div
        className={`p-10 rounded-lg shadow-lg w-full max-w-md transition-colors ${
          theme === "dark"
            ? "bg-[#1f1f1f] text-white border border-gray-700"
            : "bg-white text-gray-800 border border-gray-300"
        }`}
      >
        <h2 className="text-2xl mb-6 text-center font-semibold">Create an account</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Confirmation Message */}
        {confirmation && (
          <div className="text-green-500 text-center mb-4">
            <span>{confirmation}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className={`w-full p-4 mb-4 rounded-md focus:outline-none focus:ring-2 transition-colors ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444] focus:ring-[#6a4dfa]"
                : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
            value={username}
            onInput={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className={`w-full p-4 mb-4 rounded-md focus:outline-none focus:ring-2 transition-colors ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444] focus:ring-[#6a4dfa]"
                : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
            value={email}
            onInput={(e) => setEmail(e.target.value)}
          />
          <div className="relative mb-6">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Create password"
              required
              className={`w-full p-4 rounded-md focus:outline-none focus:ring-2 transition-colors ${
                theme === "dark"
                  ? "bg-[#2a2a2a] text-white border-[#444] focus:ring-[#6a4dfa]"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
              value={password}
              onInput={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer transition-colors ${
                theme === "dark" ? "text-white" : "text-gray-700"
              }`}
              onClick={handlePasswordVisibility}
              aria-label="Toggle password visibility"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 rounded-md font-medium transition duration-300 ${
              isSubmitting
                ? "cursor-not-allowed"
                : theme === "dark"
                ? "bg-[#6a4dfa] hover:bg-[#4a36c4] text-white"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Processing..." : "Sign up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#6a4dfa] hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
