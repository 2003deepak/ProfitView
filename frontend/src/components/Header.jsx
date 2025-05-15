import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BarChart, Sun, Moon } from 'lucide-react';
import themeStore from '../store/themeStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, changeTheme } = themeStore((state) => state);
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  // Updated with new Tailwind CSS classes
  const background = isScrolled ? (isDark ? 'bg-gray-950' : 'bg-white') : 'bg-transparent';
  const textColor = isScrolled ? (isDark ? 'text-white' : 'text-gray-800') : (isDark ? 'text-white' : 'text-white');
  const hoverTextColor = isScrolled ? (isDark ? 'hover:text-gray-300' : 'hover:text-blue-600') : 'hover:text-blue-200';
  const iconColor = isScrolled ? (isDark ? 'text-white' : 'text-blue-600') : 'text-blue-500';
  const headerPadding = isScrolled ? 'py-6' : 'py-4';
  const headerShadow = isScrolled ? 'shadow-xl' : '';
  const fontSize = isScrolled ? 'text-2xl' : 'text-xl';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${background} ${textColor} ${headerPadding} ${headerShadow}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <BarChart className={`h-10 w-10 ${iconColor}`} strokeWidth={2} />
            <span className={`ml-2 font-bold transition-all duration-300 ${fontSize} ${textColor}`}>
              Profit View
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {['Home', 'Features', 'Testimonials'].map((text) => (
              <Link
                key={text}
                to={text === 'Home' ? '/' : `#${text.toLowerCase()}`}
                className={`px-3 py-2 rounded-md text-[17px] font-medium ${textColor} ${hoverTextColor}`}
              >
                {text}
              </Link>
            ))}
            <Link
              to="/login"
              className={`ml-4 px-4 py-2 rounded-md text-[17px] font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="ml-2 px-4 py-2 rounded-md text-[17px] font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </motion.div>

            <button 
              onClick={changeTheme} 
              className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className={`lg:hidden ${textColor}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden fixed top-[72px] left-0 right-0 max-h-screen overflow-y-auto px-4 py-4 z-40 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-800'} shadow-xl rounded-b-lg`}
          >
            {['Home', 'Features', 'Testimonials'].map((text) => (
              <Link
                key={text}
                to={text === 'Home' ? '/' : `#${text.toLowerCase()}`}
                className={`block px-3 py-2 rounded-md text-base font-medium ${hoverTextColor}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {text}
              </Link>
            ))}
            <Link
              to="/login"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-2 mt-1 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
            <div className="text-center pt-4">
              <button 
                onClick={changeTheme} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;