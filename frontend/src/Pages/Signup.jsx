import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import themeStore from "../store/themeStore"

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [confirmation, setConfirmation] = useState("")

  const { theme } = themeStore((state) => state)
  const navigate = useNavigate()

  const handlePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setConfirmation("")

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setIsSubmitting(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setIsSubmitting(false)
      return
    }

    try {
      const resp = await axios.post("http://localhost:3000/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      if (resp.data.status === "success") {
        setConfirmation(resp.data.message)
        setTimeout(() => {
          navigate("/login")
        }, 1000)
      } else {
        setError(resp.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses = `w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
    theme === "dark"
      ? "bg-[#1f1f1f] text-white border-[#444] focus:ring-[#6a4dfa]"
      : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
  }`

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${theme === "dark" ? "bg-[#121212]" : "bg-gray-50"}`}>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <Link 
              to="/" 
              className={`inline-flex items-center transition-colors ${
                theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </Link>
          </div>

          <motion.div
            className={`p-6 sm:p-8 rounded-xl shadow-lg border transition-colors ${
              theme === "dark"
                ? "bg-[#1f1f1f] text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-100"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold">Create your account</h1>
              <p className={`text-sm sm:text-base mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Start your trading journey with Profit View
              </p>
            </div>

            {error && (
              <p className={`text-red-500 text-center mb-4 text-sm sm:text-base ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}>
                {error}
              </p>
            )}
            {confirmation && (
              <p className={`text-green-500 text-center mb-4 text-sm sm:text-base ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}>
                {confirmation}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label 
                  htmlFor="username" 
                  className={`block text-sm sm:text-base font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Username
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className={`block text-sm sm:text-base font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className={`block text-sm sm:text-base font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="Create a password"
                  />
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                    onClick={handlePasswordVisibility}
                  />
                </div>
                <p className={`mt-1 text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-600"
                }`}>
                  Password must be at least 6 characters
                </p>
              </div>

              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className={`block text-sm sm:text-base font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Confirm Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="Confirm your password"
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                    className={`h-4 w-4 rounded ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "border-gray-300 focus:ring-blue-500 text-blue-600"
                    }`}
                  />
                </div>
                <label 
                  htmlFor="agreeTerms" 
                  className={`ml-3 text-xs sm:text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  I agree to the{" "}
                  <Link to="#" className={`${
                    theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                  }`}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className={`${
                    theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                  }`}>
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <motion.button
                type="submit"
                className={`w-full py-2 sm:py-3 rounded-md font-medium flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? theme === "dark" 
                      ? "bg-blue-800" 
                      : "bg-blue-400"
                    : theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-600 hover:bg-blue-700"
                } text-white transition-colors`}
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting && (
                  <span className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin`}></span>
                )}
                <span className="text-sm sm:text-base">
                  {isSubmitting ? "Processing..." : "Create Account"}
                </span>
              </motion.button>
            </form>

            <div className={`mt-4 sm:mt-6 text-center text-xs sm:text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              <span>Already have an account?</span>{" "}
              <Link 
                to="/login" 
                className={`font-medium transition-colors ${
                  theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
}

export default Signup