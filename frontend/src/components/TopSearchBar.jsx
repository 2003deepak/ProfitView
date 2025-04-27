import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faCog, faSignOutAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import themeStore from "../store/themeStore";
import { useNavigate } from 'react-router-dom';

const TopSearchBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = themeStore((state) => state);
  const navigate = useNavigate();

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setIsUserMenuOpen(false);
  };

  return (
    <div className={`
      flex flex-col md:flex-row justify-between items-center w-[95%] px-4 py-3 md:py-4
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
      sticky top-0 z-40 pl-24
    `}>
      

      {/* Search Bar */}
      <form 
        onSubmit={handleSearch}
        className={`relative flex items-center w-full md:w-1/2 lg:w-1/3 my-3 md:my-0 mx-0 md:mx-4`}
      >
        <input
          type="text"
          placeholder="Search stocks, ETFs, crypto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`
            w-full px-4 py-2 pl-10 pr-4 rounded-lg 
            ${theme === 'dark' ? 
              'bg-gray-800 text-white placeholder-gray-400 border-gray-700' : 
              'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'}
            border focus:outline-none focus:ring-2 
            ${theme === 'dark' ? 'focus:ring-blue-600' : 'focus:ring-blue-500'}
            transition-all duration-200
          `}
        />
        <FontAwesomeIcon
          icon={faSearch}
          className={`
            absolute left-3 
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
          `}
        />
      </form>

      {/* User Controls */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button - Mobile */}
        <button
          onClick={toggleTheme}
          className={`md:hidden p-2 rounded-full ${theme === 'dark' ? 'text-yellow-300' : 'text-gray-600'}`}
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full
              ${theme === 'dark' ? 
                'bg-gray-800 hover:bg-gray-700 text-gray-300' : 
                'bg-gray-100 hover:bg-gray-200 text-gray-700'}
              transition-colors duration-200
              focus:outline-none focus:ring-2 
              ${theme === 'dark' ? 'focus:ring-blue-600' : 'focus:ring-blue-500'}
            `}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>

          {isUserMenuOpen && (
            <div className={`
              absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50
              ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              border overflow-hidden
            `}>
              <ul>
                <li>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsUserMenuOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 text-left flex items-center
                      ${theme === 'dark' ? 
                        'hover:bg-gray-700 text-gray-300' : 
                        'hover:bg-gray-100 text-gray-700'}
                      transition-colors
                    `}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-3" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setIsUserMenuOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 text-left flex items-center
                      ${theme === 'dark' ? 
                        'hover:bg-gray-700 text-gray-300' : 
                        'hover:bg-gray-100 text-gray-700'}
                      transition-colors
                    `}
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-3" />
                    Settings
                  </button>
                </li>
                <li className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className={`
                      w-full px-4 py-3 text-left flex items-center
                      ${theme === 'dark' ? 
                        'hover:bg-red-900/20 text-red-400' : 
                        'hover:bg-red-50 text-red-600'}
                      transition-colors
                    `}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopSearchBar;