import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import themeStore from "../store/themeStore"

const ResetPassword = () => {

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [confirmation, setConfirmation] = useState("")

  const { theme } = themeStore((state) => state)
  const navigate = useNavigate()
  const token = useParams().token

  if (!token) {
    navigate("/login")
    
  }

  const handlePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePassword()) return

    setIsSubmitting(true)
    setError("")
    setConfirmation("")

    try {
      const resp = await axios.post(
        `http://localhost:3000/api/resetPassword/${token}`,
        { 
          newPassword: formData.password 
        },
        
      )

      if (resp.data.status === "success") {
        setConfirmation("Password has been reset successfully. You can now login with your new password.")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(resp.data.message || "Failed to reset password.")
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
    <div className={`min-h-screen flex flex-col transition-colors ${theme === "dark" ? "bg-[#121212]" : "bg-white"}`}>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>

          <motion.div
            className={`p-8 rounded-xl shadow-lg border transition-colors ${
              theme === "dark"
                ? "bg-[#1f1f1f] text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-100"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-gray-500 mt-2">Enter your new password</p>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {confirmation && <p className="text-green-500 text-center mb-4">{confirmation}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={passwordVisible.password ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <FontAwesomeIcon
                    icon={passwordVisible.password ? faEyeSlash : faEye}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                      theme === "dark" ? "text-white" : "text-gray-700"
                    }`}
                    onClick={() => handlePasswordVisibility("password")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={passwordVisible.confirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="Confirm your new password"
                  />
                  <FontAwesomeIcon
                    icon={passwordVisible.confirmPassword ? faEyeSlash : faEye}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                      theme === "dark" ? "text-white" : "text-gray-700"
                    }`}
                    onClick={() => handlePasswordVisibility("confirmPassword")}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium flex items-center justify-center gap-2"
                disabled={isSubmitting}
                whileHover={{ backgroundColor: "#2563EB" }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isSubmitting ? "Processing..." : "Reset Password"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Profit View. All rights reserved.
      </footer>
    </div>
  )
}

export default ResetPassword