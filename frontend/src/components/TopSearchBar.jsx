import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const TopSearchBar = () => {

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  // Toggle user menu visibility
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <div className="flex justify-between items-center w-full max-w-6xl mx-auto mt-6 p-4">
      {/* Search Bar */}
      <div className="relative flex items-center w-full max-w-xl">
        <input
          type="text"
          placeholder="Search for a stock..."
          className="w-full px-6 py-3 pl-12 text-black rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        />
        {/* Centered Search Icon */}
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-4 text-gray-500 text-xl"
        />

      </div>

      {/* User Menu Dropdown (Top Right) */}
      <div className="relative">
        <button
          onClick={toggleUserMenu}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition-all"
        >
          <img
            src="#" // Replace with actual user logo
            alt="User"
            className="w-10 h-10 rounded-full"
          />
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10 border border-gray-200">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-red-600 text-white transition-all cursor-pointer ">Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSearchBar;
