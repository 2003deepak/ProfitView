import { useState, useEffect, useMemo} from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import useStockStore from "../store/stockStore"
import useThemeStore from "../store/themeStore"
import { useParams } from "react-router"

const StockChart = () => {
  const { stocks } = useStockStore()
  const { theme } = useThemeStore()
  const stockName = useParams()
  const [priceHistory, setPriceHistory] = useState([])
  const [selectedSymbol, setSelectedSymbol] = useState(stockName.symbol)
  const [isPositive, setIsPositive] = useState(true)
  const [startPrice, setStartPrice] = useState(null)
  const [marketOpen, setMarketOpen] = useState(false)


  const liveStock = stocks[selectedSymbol]

  // Check if current time is within market hours (9:30 AM to 3:30 PM)
  const checkMarketHours = () => {
    const now = new Date()
    const marketStart = new Date(now)
    marketStart.setHours(9, 30, 0, 0)
    const marketEnd = new Date(now)
    marketEnd.setHours(15, 30, 0, 0)

    return now >= marketStart && now <= marketEnd
  }

  // Generate time slots from 9:30 AM to 3:30 PM with 2-second intervals
  const generateTimeSlots = () => {
    const now = new Date()
    const slots = []
    const marketStart = new Date(now)
    marketStart.setHours(9, 30, 0, 0)
    const marketEnd = new Date(now)
    marketEnd.setHours(15, 30, 0, 0)

    // Check if market is open
    const isMarketOpen = checkMarketHours()
    setMarketOpen(isMarketOpen)

    // Calculate total seconds between 9:30 AM and 3:30 PM
    // 6 hours = 21,600 seconds
    // With 2-second intervals, we need 10,800 slots
    const totalSeconds = 6 * 60 * 60
    const interval = 2 // 2-second intervals
    const totalSlots = totalSeconds / interval

    for (let i = 0; i <= totalSlots; i++) {
      const slotTime = new Date(marketStart.getTime() + i * interval * 1000)
      if (slotTime <= marketEnd) {
        slots.push({
          time: slotTime,
          timestamp: slotTime.getTime(),
          formattedTime: slotTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          price: null,
        })
      }
    }
    return slots
  }

  // Initialize price history on component mount
  useEffect(() => {
    const initialSlots = generateTimeSlots()
    setPriceHistory(initialSlots)

    // Set market open status
    setMarketOpen(checkMarketHours())

    // Check market hours every minute
    const marketCheckInterval = setInterval(() => {
      setMarketOpen(checkMarketHours())
    }, 60000)

    return () => clearInterval(marketCheckInterval)
  }, [])

  // Update price history when stock data changes
  useEffect(() => {
    if (!liveStock) return

    // Set initial price reference point if not set
    if (startPrice === null) {
      setStartPrice(liveStock.price)
    }

    // Only update if market is open
    if (!marketOpen) return

    const now = new Date()
    const currentTimestamp = now.getTime()

    // Find the closest time slot to the current time
    setPriceHistory((prev) => {
      const newHistory = [...prev]

      // Find the nearest 2-second slot to current time
      const currentSlotIndex = newHistory.findIndex((slot) => slot.timestamp >= currentTimestamp)

      // Use the previous slot or last slot if not found
      const indexToUpdate = currentSlotIndex === -1 ? newHistory.length - 1 : Math.max(0, currentSlotIndex - 1)

      // Update the price at the current time slot
      if (indexToUpdate >= 0 && indexToUpdate < newHistory.length) {
        newHistory[indexToUpdate] = {
          ...newHistory[indexToUpdate],
          price: liveStock.price,
        }

        // Fill in any gaps with the last known price (for a continuous line)
        let lastKnownPrice = null
        for (let i = 0; i < newHistory.length; i++) {
          if (newHistory[i].price !== null) {
            lastKnownPrice = newHistory[i].price
          } else if (i < indexToUpdate && lastKnownPrice !== null) {
            // Only fill gaps up to the current time
            newHistory[i].price = lastKnownPrice
          }
        }
      }

      // Check if price is positive compared to start price
      setIsPositive(liveStock.price >= startPrice)

      return newHistory
    })
  }, [liveStock, startPrice, marketOpen])

  // Filter data to only show up to current time
  const filteredPriceHistory = useMemo(() => {
    const now = new Date()
    return priceHistory.filter((point) => point.time <= now && point.price !== null)
  }, [priceHistory])

  const chartColor = isPositive ? (theme === "dark" ? "#4ade80" : "#16a34a") : theme === "dark" ? "#f87171" : "#dc2626"

  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
  const axisColor = theme === "dark" ? "#9ca3af" : "#6b7280"

  if (!liveStock) {
    return <div className="h-96 flex items-center justify-center text-gray-500">Loading stock data...</div>
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null

    const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white"
    const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900"
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200"
    const valueColor = payload[0].value >= startPrice ? "text-green-500" : "text-red-500"

    return (
      <div className={`${bgColor} ${textColor} p-3 border ${borderColor} rounded-lg shadow-lg text-sm`}>
        <p className="font-medium">{payload[0].payload.formattedTime}</p>
        <p className={valueColor}>₹{payload[0].value.toFixed(2)}</p>
        <p className="text-xs opacity-75">
          {payload[0].value >= startPrice ? "+" : ""}
          {(payload[0].value - startPrice).toFixed(2)} (
          {(((payload[0].value - startPrice) / startPrice) * 100).toFixed(2)}%)
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        className={`h-96 w-full ${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-4 shadow border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
      >
        {!marketOpen && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} shadow-lg`}>
              <p className={theme === "dark" ? "text-gray-200" : "text-gray-700"}>
                Market is currently closed. Trading hours: 9:30 AM - 3:30 PM
              </p>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredPriceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} strokeOpacity={0.5} />

            <XAxis
              dataKey="formattedTime"
              minTickGap={60}
              tick={{ fill: axisColor, fontSize: 12 }}
              tickMargin={10}
              axisLine={{ stroke: gridColor }}
              tickLine={{ stroke: gridColor }}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: axisColor, fontSize: 12 }}
              tickMargin={10}
              axisLine={{ stroke: gridColor }}
              tickLine={{ stroke: gridColor }}
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
              width={60}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: gridColor,
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              animationDuration={300}
              connectNulls={true}
              activeDot={{
                r: 5,
                stroke: theme === "dark" ? "#1f2937" : "#f3f4f6",
                strokeWidth: 2,
                fill: chartColor,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StockChart
