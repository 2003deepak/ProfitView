import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Edit, Mail, User, Wallet, Clock, LineChart, Settings, TrendingUp, ArrowDown, ArrowUp } from "lucide-react"
import Sidebar from "../components/Sidebar"
import TopSearchBar from "../components/TopSearchBar"
import themeStore from "../store/themeStore"
import useStockStore from "../store/stockStore"
import useUserStore from "../store/userStore"
import { toast, ToastContainer } from 'react-toastify'
import useOrderStore from "../store/orderStore";

export default function Profile() {
  const { theme } = themeStore((state) => state)
  const [isEditing, setIsEditing] = useState(false)
  const [portfolioChangePercent, setPortfolioChangePercent] = useState(2.22)
  
  const orders = useOrderStore(state => state.orders)
  
  // Use user store
  const {
    firstName,
    lastName,
    email,
    username,
    balance,
    profileImage,
    joinedAt,
    portfolioPerformance,
    fetchUserData,
    updateUserData,
    setUserField
  } = useUserStore()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })

  // Initialize form data when component mounts or user data changes
  useEffect(() => {
    fetchUserData()
    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
    })
  }, [fetchUserData, firstName, lastName, email])

  // Theme classes
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50"
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900"
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white"
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200"
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500"
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-50"
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
  const buttonHoverColor = theme === "dark" ? "hover:bg-blue-700" : "hover:bg-blue-600"

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      
      // Then trigger the API update
      await updateUserData(formData.firstName , formData.lastName)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
    })
    setIsEditing(false)
  }


  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      
      <ToastContainer position="top-right" />

      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-44 transition-all duration-300">
        <TopSearchBar />

        <main className={`flex-1 p-4 md:p-6 overflow-auto ${textColor}`}>
          <div className="container mx-auto flex flex-col gap-4">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="text-blue-500 hover:underline flex items-center transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Link>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Link
                  to="/settings"
                  className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBgColor} transition-colors flex items-center gap-2 hover:border-blue-500 hover:text-blue-500`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Profile summary */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${cardBgColor} rounded-xl border ${borderColor} p-6 shadow-sm`}
                >
                  <div className="flex flex-col items-center text-center">
                    
                    <div className="relative mb-4 group">
                      <div className="w-24 h-24 rounded-full border-2 border-blue-500 bg-blue-100 flex justify-center items-center shadow-md transition-transform duration-200 ease-in-out group-hover:scale-105">
                        <p className="text-5xl font-extrabold text-blue-700 select-none">
                          {username.charAt(0).toUpperCase()}
                        </p>
                      </div>
                    </div>


                    <h1 className="text-xl font-bold mb-1">
                      {firstName} {lastName}
                    </h1>
                    <p className={`${mutedTextColor} mb-4`}>@{username}</p>

                    <div className={`w-full p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-sm mb-4 ${theme === 'dark' ? 'bg-blue-900 bg-opacity-20 border-blue-800 text-blue-200' : ''}`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-medium text-base ${textColor}`}>Available Balance:</span>
                        <span className={`font-medium text-base ${textColor}`}>
                          ₹{balance}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <button
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${buttonHoverColor} transition-colors flex-1 mr-2 shadow-md`}
                        onClick={() => alert("Deposit funds")}
                      >
                        Deposit
                      </button>
                      <button
                        className={`px-4 py-2 border ${borderColor} rounded-lg ${hoverBgColor} transition-colors flex-1 ml-2 hover:border-blue-500 hover:text-blue-500`}
                        onClick={() => alert("Withdraw funds")}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`${cardBgColor} rounded-xl border ${borderColor} p-6 shadow-sm`}
                >
                  <h2 className="text-lg font-medium mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    Account Statistics
                  </h2>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${borderColor} hover:border-blue-500 transition-colors`}>
                      <p className={`text-sm ${mutedTextColor} mb-1 flex items-center`}>
                        <Clock className="h-4 w-4 mr-2" />
                        Member Since
                      </p>
                      <p className="font-medium">{joinedAt}</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${borderColor} hover:border-blue-500 transition-colors`}>
                      <p className={`text-sm ${mutedTextColor} mb-1 flex items-center`}>
                        <LineChart className="h-4 w-4 mr-2" />
                        Trades Completed
                      </p>
                      <p className="font-medium">{orders.allOrders.length}</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${borderColor} hover:border-blue-500 transition-colors`}>
                      <p className={`text-sm ${mutedTextColor} mb-1 flex items-center`}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Portfolio Performance
                      </p>
                      <p className={`font-medium ${portfolioChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {portfolioPerformance}
                        {portfolioChangePercent >= 0 ? (
                          <ArrowUp className="h-4 w-4 inline ml-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 inline ml-1" />
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>

               
              </div>

              {/* Right column - Profile details */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`${cardBgColor} rounded-xl border ${borderColor} p-6 mb-6 shadow-sm`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      Profile Information
                    </h2>
                    {!isEditing ? (
                      <button
                        className="text-blue-500 hover:text-blue-600 flex items-center transition-colors"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        className="text-gray-500 hover:text-gray-600 flex items-center transition-colors"
                        onClick={handleCancel}
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="firstName" className={`block text-sm font-medium ${mutedTextColor} mb-2`}>
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`block w-full p-3 rounded-lg ${inputBgColor} border ${borderColor} focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className={`block text-sm font-medium ${mutedTextColor} mb-2`}>
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`block w-full p-3 rounded-lg ${inputBgColor} border ${borderColor} focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className={`block text-sm font-medium ${mutedTextColor} mb-2`}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className={`block w-full p-3 rounded-lg ${inputBgColor} border ${borderColor} focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="username" className={`block text-sm font-medium ${mutedTextColor} mb-2`}>
                              Username
                            </label>
                            <input
                              type="text"
                              id="username"
                              value={username}
                              className={`block w-full p-3 rounded-lg ${inputBgColor} border ${borderColor} bg-opacity-50 cursor-not-allowed`}
                              disabled
                            />
                            <p className="mt-1 text-xs text-amber-500">Username cannot be changed</p>
                          </div>
                          <div>
                            <label htmlFor="joinDate" className={`block text-sm font-medium ${mutedTextColor} mb-2`}>
                              Member Since
                            </label>
                            <input
                              type="text"
                              id="joinDate"
                              value={joinedAt}
                              className={`block w-full p-3 rounded-lg ${inputBgColor} border ${borderColor} bg-opacity-50 cursor-not-allowed`}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className={`px-4 py-2 border ${borderColor} rounded-lg ${hoverBgColor} transition-colors hover:border-blue-500 hover:text-blue-500`}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${buttonHoverColor} transition-colors shadow-md`}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-4 rounded-lg border ${borderColor} hover:border-blue-500 transition-colors`}>
                          <div className="flex items-center mb-2">
                            <User className={`h-5 w-5 mr-2 text-blue-500`} />
                            <p className={`text-sm ${mutedTextColor}`}>First Name</p>
                          </div>
                          <p className="font-medium text-lg">{firstName}</p>
                        </div>
                        <div className={`p-4 rounded-lg border ${borderColor} hover:border-blue-500 transition-colors`}>
                          <div className="flex items-center mb-2">
                            <User className={`h-5 w-5 mr-2 text-blue-500`} />
                            <p className={`text-sm ${mutedTextColor}`}>Last Name</p>
                          </div>
                          <p className="font-medium text-lg">{lastName}</p>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${borderColor} hover:border-blue-500 transition-colors`}>
                        <div className="flex items-center mb-2">
                          <Mail className={`h-5 w-5 mr-2 text-blue-500`} />
                          <p className={`text-sm ${mutedTextColor}`}>Email Address</p>
                        </div>
                        <p className="font-medium text-lg">{email}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-4 rounded-lg border ${borderColor} hover:border-blue-500 transition-colors`}>
                          <div className="flex items-center mb-2">
                            <User className={`h-5 w-5 mr-2 text-blue-500`} />
                            <p className={`text-sm ${mutedTextColor}`}>Username</p>
                          </div>
                          <p className="font-medium text-lg">@{username}</p>
                        </div>
                        <div className={`p-4 rounded-lg border ${borderColor} hover:border-blue-500 transition-colors`}>
                          <div className="flex items-center mb-2">
                            <Wallet className={`h-5 w-5 mr-2 text-blue-500`} />
                            <p className={`text-sm ${mutedTextColor}`}>Account Balance</p>
                          </div>
                          <p className="font-medium text-lg">
                            ₹{balance}
                          </p>
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
  )
}