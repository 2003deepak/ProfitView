import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Lock,
  LogOut,
  Moon,
  Palette,
  Shield,
  Sun,
  User,
  Wallet,
  Camera,
  Edit,
  Mail,
  Settings,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import useStockStore from "../store/stockStore";

export default function SettingsPage() {
  const { theme, changeTheme } = themeStore((state) => state);
  const [activeSection, setActiveSection] = useState("security");
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    priceAlerts: true,
    newsUpdates: false,
    tradeConfirmations: true,
    marketingSurveys: false,
  });
  const { stocks } = useStockStore((state) => state);
  const [isEditing, setIsEditing] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(342.18);
  const [portfolioChangePercent, setPortfolioChangePercent] = useState(2.22);
  const [marketStatus, setMarketStatus] = useState("open");

  // Theme classes
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  const toggleTheme = () => {
    changeTheme();
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const settingsSections = [
    { id: "security", label: "Security", icon: <Shield className="h-5 w-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="h-5 w-5" /> },
    { id: "payment", label: "Payment Methods", icon: <Wallet className="h-5 w-5" /> },
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-44 transition-all duration-300">
        <TopSearchBar />

        <main className={`flex-1 p-4 md:p-6 overflow-auto ${textColor}`}>
          <div className="container mx-auto flex flex-col gap-4">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="text-[#0B72E7] hover:underline flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Link>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Link
                  to="/user/profile"
                  className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBgColor} transition-colors flex items-center gap-2`}
                >
                  <User className="h-4 w-4" />
                  View Profile
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left column - Settings navigation */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${cardBgColor} rounded-xl border ${borderColor} p-4 mb-6`}
                >
                  <nav>
                    <ul className="space-y-1">
                      {settingsSections.map((section) => (
                        <li key={section.id}>
                          <button
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                              activeSection === section.id
                                ? "bg-[#0B72E7] text-white"
                                : `${hoverBgColor} ${textColor}`
                            }`}
                            onClick={() => setActiveSection(section.id)}
                          >
                            <span className="mr-3">{section.icon}</span>
                            <span>{section.label}</span>
                          </button>
                        </li>
                      ))}
                     
                    </ul>
                  </nav>
                </motion.div>
              </div>

              {/* Right column - Settings content */}
              <div className="lg:col-span-3">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${cardBgColor} rounded-xl border ${borderColor} p-6`}
                >
              
                  {/* Security Settings */}
                  {activeSection === "security" && (
                    <div>
                      <h2 className="text-xl font-bold mb-6">Security Settings</h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Change Password</h3>
                          <div className="space-y-4">
                            <div>
                              <label
                                htmlFor="currentPassword"
                                className={`block text-sm font-medium ${mutedTextColor} mb-2`}
                              >
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  type="password"
                                  id="currentPassword"
                                  className={`block w-full p-3 rounded-lg ${inputBgColor} border ${borderColor} focus:ring-[#0B72E7] focus:border-[#0B72E7] outline-none`}
                                  placeholder="••••••••"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="newPassword" className={`block text-sm font-medium ${mutedTextColor} mb-2`}>
                                New Password
                              </label>
                              <div className="relative">
                                <input
                                  type="password"
                                  id="newPassword"
                                  className={`block w-full p-3 rounded-lg ${inputBgColor} border ${borderColor} focus:ring-[#0B72E7] focus:border-[#0B72E7] outline-none`}
                                  placeholder="••••••••"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                  <EyeOff className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="confirmPassword"
                                className={`block text-sm font-medium ${mutedTextColor} mb-2`}
                              >
                                Confirm New Password
                              </label>
                              <div className="relative">
                                <input
                                  type="password"
                                  id="confirmPassword"
                                  className={`block w-full p-3 rounded-lg ${inputBgColor} border ${borderColor} focus:ring-[#0B72E7] focus:border-[#0B72E7] outline-none`}
                                  placeholder="••••••••"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                  <EyeOff className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                          <div className={`p-4 rounded-lg border ${borderColor}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Lock className="h-5 w-5 mr-3 text-[#0B72E7]" />
                                <div>
                                  <p className="font-medium">Two-Factor Authentication</p>
                                  <p className={`text-sm ${mutedTextColor}`}>
                                    Add an extra layer of security to your account
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Sessions</h3>
                          <div className={`p-4 rounded-lg border ${borderColor}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Shield className="h-5 w-5 mr-3 text-[#0B72E7]" />
                                <div>
                                  <p className="font-medium">Active Sessions</p>
                                  <p className={`text-sm ${mutedTextColor}`}>Manage your active sessions</p>
                                </div>
                              </div>
                              <button className="text-[#0B72E7] hover:underline">Manage Sessions</button>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="px-4 py-2 bg-[#0B72E7] text-white rounded-lg hover:bg-[#0A65CF] transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeSection === "notifications" && (
                    <div>
                      <h2 className="text-xl font-bold mb-6">Notification Settings</h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                          <div className="space-y-4">
                            <div className={`p-4 rounded-lg border ${borderColor}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Email Alerts</p>
                                  <p className={`text-sm ${mutedTextColor}`}>Receive important account alerts via email</p>
                                </div>
                                <div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={notifications.emailAlerts}
                                      onChange={() => handleNotificationChange("emailAlerts")}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className={`p-4 rounded-lg border ${borderColor}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Price Alerts</p>
                                  <p className={`text-sm ${mutedTextColor}`}>
                                    Get notified when stocks hit your target price
                                  </p>
                                </div>
                                <div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={notifications.priceAlerts}
                                      onChange={() => handleNotificationChange("priceAlerts")}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className={`p-4 rounded-lg border ${borderColor}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">News Updates</p>
                                  <p className={`text-sm ${mutedTextColor}`}>Receive news about stocks in your watchlist</p>
                                </div>
                                <div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={notifications.newsUpdates}
                                      onChange={() => handleNotificationChange("newsUpdates")}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Trading Notifications</h3>
                          <div className="space-y-4">
                            <div className={`p-4 rounded-lg border ${borderColor}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Trade Confirmations</p>
                                  <p className={`text-sm ${mutedTextColor}`}>Get notified when your trades are executed</p>
                                </div>
                                <div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={notifications.tradeConfirmations}
                                      onChange={() => handleNotificationChange("tradeConfirmations")}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className={`p-4 rounded-lg border ${borderColor}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Marketing & Surveys</p>
                                  <p className={`text-sm ${mutedTextColor}`}>
                                    Receive updates about new features and surveys
                                  </p>
                                </div>
                                <div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={notifications.marketingSurveys}
                                      onChange={() => handleNotificationChange("marketingSurveys")}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="px-4 py-2 bg-[#0B72E7] text-white rounded-lg hover:bg-[#0A65CF] transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeSection === "appearance" && (
                    <div>
                      <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Theme</h3>
                          <div className={`p-4 rounded-lg border ${borderColor}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {theme === "light" ? (
                                  <Sun className="h-5 w-5 mr-3 text-[#0B72E7]" />
                                ) : (
                                  <Moon className="h-5 w-5 mr-3 text-[#0B72E7]" />
                                )}
                                <div>
                                  <p className="font-medium">Theme Mode</p>
                                  <p className={`text-sm ${mutedTextColor}`}>
                                    {theme === "light" ? "Light mode is currently active" : "Dark mode is currently active"}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  onChange={toggleTheme}
                                  // checked={theme === "dark"} 
                                />

                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods Settings */}
                  {activeSection === "payment" && (
                    <div>
                      <h2 className="text-xl font-bold mb-6">Payment Methods</h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Connected Payment Methods</h3>
                          <div className={`p-4 rounded-lg border ${borderColor} flex items-center justify-between`}>
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 dark:text-blue-300 font-bold">V</span>
                              </div>
                              <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className={`text-sm ${mutedTextColor}`}>Expires 12/2025</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="text-[#0B72E7] hover:underline">Edit</button>
                              <button className="text-red-500 hover:underline">Remove</button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            className="px-4 py-2 border border-[#0B72E7] text-[#0B72E7] rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center"
                          >
                            <span className="mr-2">+</span> Add Payment Method
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}