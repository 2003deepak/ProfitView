import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import authStore from "../store/authStore"
import themeStore from "../store/themeStore"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [confirmation, setConfirmation] = useState("")

  const { setLogIn } = authStore((state) => state)
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

    try {
      const resp = await axios.post(
        "http://localhost:3000/api/login",
        { username: formData.username, password: formData.password },
        { withCredentials: true }
      )

      if (resp.data.status === "success") {
        setConfirmation(resp.data.message)
        setLogIn({ user: formData.username, role: "user" })
        setTimeout(() => {
          navigate("/user/dashboard")
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
    <div className={`min-h-screen flex flex-col transition-colors ${theme === "dark" ? "bg-[#121212]" : "bg-white"}`}>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
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
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-gray-500 mt-2">Sign in to your Profit View account</p>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {confirmation && <p className="text-green-500 text-center mb-4">{confirmation}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
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
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
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
                    placeholder="Enter your password"
                  />
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                      theme === "dark" ? "text-white" : "text-gray-700"
                    }`}
                    onClick={handlePasswordVisibility}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm">
                  Remember me
                </label>
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
                {isSubmitting ? "Processing..." : "Sign In"}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Sign up
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Profit View. All rights reserved.
      </footer>
    </div>
  )
}

export default Login
