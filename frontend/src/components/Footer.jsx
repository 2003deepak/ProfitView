import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Social Media Icons
import { Link } from 'react-router-dom';
import themeStore from '../store/themeStore';

const Footer = () => {
  // Theme Switcher (Got Values from themeStore (Zustand))
  const { theme } = themeStore((state) => state);

  return (
    <footer
      className={`w-full py-8 px-10 border-t transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#121212] border-gray-600 text-white'
          : 'bg-white border-gray-200 text-black'
      }`}
    >
      <div className="max-w-[85%] mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Description */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold">TradingTick</h1>
          <p
            className={`mt-2 transition-colors ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Your trusted partner in trading insights.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          <Link
            to="/"
            className={`transition-colors duration-300 ease-in-out ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`transition-colors duration-300 ease-in-out ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            About
          </Link>
          <Link
            to="/signup"
            className={`transition-colors duration-300 ease-in-out ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className={`transition-colors duration-300 ease-in-out ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Login
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4 mt-6 md:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ease-in-out ${
              theme === 'dark' ? 'text-gray-400 hover:text-[#6a4dfa]' : 'text-gray-600 hover:text-[#6a4dfa]'
            }`}
          >
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ease-in-out ${
              theme === 'dark' ? 'text-gray-400 hover:text-[#6a4dfa]' : 'text-gray-600 hover:text-[#6a4dfa]'
            }`}
          >
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ease-in-out ${
              theme === 'dark' ? 'text-gray-400 hover:text-[#6a4dfa]' : 'text-gray-600 hover:text-[#6a4dfa]'
            }`}
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ease-in-out ${
              theme === 'dark' ? 'text-gray-400 hover:text-[#6a4dfa]' : 'text-gray-600 hover:text-[#6a4dfa]'
            }`}
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div
        className={`mt-8 pt-4 text-center transition-colors duration-300 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        © {new Date().getFullYear()} TradingTick. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
