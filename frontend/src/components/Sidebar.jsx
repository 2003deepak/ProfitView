import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import themeStore from "../store/themeStore";
import useAuthStore from '../store/authStore';
import useStockStore from '../store/stockStore';
import axios from 'axios';
import {
  ChevronDown,
  ChevronUp,
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  TrendingUp,
  PieChart,
  BarChart2,
  DollarSign,
  Bell,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const { disconnectSSE } = useStockStore();
  const { setLogOut } = useAuthStore();
  const { theme, changeTheme, isSidebarOpen, changeSidebarOpen } = themeStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    changeSidebarOpen();
  };

  const toggleDropdown = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/logout', {}, { withCredentials: true });
      if (response.data.status === 'success') {
        disconnectSSE();
        toast.success(response.data.message);
        setTimeout(() => setLogOut(), 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const navigation = [
    { label: 'Dashboard', icon: Home, to: '/user/dashboard' },
    {
      label: 'Market Data',
      icon: BarChart2,
      dropdown: true,
      items: [
        { label: 'Top Gainers', to: '/user/top-gainers' },
        { label: 'Top Losers', to: '/user/top-losers' },
        { label: 'Most Active', to: '/user/most-active' },
      ]
    },
    { label: 'Portfolio', icon: PieChart, to: '/user/portfolio' },
    {
      label: 'Top Stocks',
      icon: TrendingUp,
      dropdown: true,
      items: [
        { label: 'V40 Stocks', to: '/user/v40' },
        { label: 'V40 Next', to: '/user/v40-next' },
      ]
    },
    { label: 'Order', icon: Bell, to: '/user/order' },
    { label: 'Profile', icon: User, to: '/user/profile' },
    { label: 'Settings', icon: Settings, to: '/user/settings' }
  ];

  return (
    <>
      {/* Mobile Overlay - using will-change for better performance */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden will-change-transform"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - using transform instead of width for smoother animation */}
      <div className={`
        fixed h-full z-50 transition-all duration-800
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        ${theme === "dark" ? "bg-gray-900" : "bg-white"}
        shadow-xl
        will-change-transform
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 border-b
          ${theme === "dark" ? "border-gray-800" : "border-gray-100"}
          ${!isSidebarOpen ? 'justify-center' : ''}
        `}>
          {isSidebarOpen && (
            <Link to="/" className="flex items-center">
              <p>📈</p>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                ProfitView
              </span>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className={`
              p-2 rounded-lg transition-colors
              ${theme === "dark" ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}
              focus:outline-none
            `}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation - using overflow-hidden to prevent janky scrollbar appearance */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-150px)] overflow-x-hidden">
          {navigation.map((item, idx) => (
            <div key={idx}>
              {item.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`
                      flex items-center w-full p-3 rounded-lg transition-all
                      ${activeDropdown === item.label ?
                        (theme === "dark" ? "bg-gray-800 text-blue-400" : "bg-blue-50 text-blue-600") :
                        (theme === "dark" ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700")}
                      ${!isSidebarOpen ? 'justify-center' : ''}
                      focus:outline-none
                    `}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left whitespace-nowrap">{item.label}</span>
                        {activeDropdown === item.label ? (
                          <ChevronUp className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 flex-shrink-0" />
                        )}
                      </>
                    )}
                  </button>
                  {activeDropdown === item.label && isSidebarOpen && (
                    <div className={`mt-1 ml-8 space-y-1 ${theme === "dark" ? "border-l border-gray-800" : "border-l border-gray-200"}`}>
                      {item.items.map((subItem, subIdx) => (
                        <Link
                          key={subIdx}
                          to={subItem.to}
                          className={`
                            block px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap
                            ${theme === "dark" ? "hover:bg-gray-800 hover:text-blue-400 text-gray-400" : "hover:bg-gray-100 hover:text-blue-600 text-gray-600"}
                          `}
                          onClick={() => isMobile && toggleSidebar()}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.to}
                  className={`
                    flex items-center w-full p-3 rounded-lg transition-colors whitespace-nowrap
                    ${theme === "dark" ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"}
                    ${!isSidebarOpen ? 'justify-center' : ''}
                  `}
                  onClick={() => isMobile && toggleSidebar()}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`
          absolute bottom-0 w-full p-4 border-t
          ${theme === "dark" ? "border-gray-800" : "border-gray-100"}
        `}>
          <button
            onClick={() => changeTheme()}
            className={`
              flex items-center w-full p-3 rounded-lg transition-colors whitespace-nowrap
              ${theme === "dark" ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"}
              ${!isSidebarOpen ? 'justify-center' : ''}
              focus:outline-none
            `}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 flex-shrink-0" />
            )}
            {isSidebarOpen && <span className="ml-3">Toggle Theme</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full p-3 rounded-lg transition-colors mt-2 whitespace-nowrap
              ${theme === "dark" ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"}
              ${!isSidebarOpen ? 'justify-center' : ''}
              focus:outline-none
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
};

export default Sidebar;