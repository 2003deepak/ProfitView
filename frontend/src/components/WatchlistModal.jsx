import { useState } from "react"
import { X } from "lucide-react"

export default function WatchlistModal({ onClose, onSave, theme }) {
  const [watchlistName, setWatchlistName] = useState("")
  const [error, setError] = useState("")

  // Theme classes
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white"
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900"
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200"
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500"
  const overlayBgColor = theme === "dark" ? "bg-black/50" : "bg-black/25"

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!watchlistName.trim()) {
      setError("Please enter a watchlist name")
      return
    }

    onSave(watchlistName)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`fixed inset-0 ${overlayBgColor}`} onClick={onClose}></div>

      <div className={`relative ${bgColor} ${textColor} rounded-lg shadow-xl w-full max-w-md mx-4 p-6`}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Create New Watchlist</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="watchlistName" className={`block mb-2 text-sm font-medium ${mutedTextColor}`}>
              Watchlist Name
            </label>
            <input
              type="text"
              id="watchlistName"
              className={`w-full p-3 rounded-lg border ${borderColor} bg-transparent focus:ring-[#0B72E7] focus:border-[#0B72E7] outline-none`}
              placeholder="My Watchlist"
              value={watchlistName}
              onChange={(e) => {
                setWatchlistName(e.target.value)
                setError("")
              }}
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className={`px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0B72E7] text-white rounded-lg hover:bg-[#0A65CF] transition-colors"
            >
              Create Watchlist
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
