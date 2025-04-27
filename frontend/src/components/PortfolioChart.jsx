import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Generate mock data for portfolio chart
const generatePortfolioData = () => {
  const data = []
  let value = 15000
  const volatility = 200
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    // Generate a value with some randomness but with an upward trend
    const randomFactor = (Math.random() - 0.3) * volatility
    value = value + randomFactor
    if (i > 20) value = value + 20 // Create an uptrend at the end

    data.push({
      date: date.toISOString(),
      value: value,
      formattedDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    })
  }

  return data
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white"
    const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900"
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200"

    return (
      <div className={`${bgColor} ${textColor} p-3 border ${borderColor} rounded shadow-lg`}>
        <p className="font-medium">{payload[0].payload.formattedDate}</p>
        <p className="text-[#0B72E7] font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    )
  }

  return null
}

export default function PortfolioChart({ theme }) {
  const [chartData, setChartData] = useState([])
  const [isPositive, setIsPositive] = useState(true)

  useEffect(() => {
    const data = generatePortfolioData()
    setChartData(data)

    // Determine if the trend is positive
    setIsPositive(data[data.length - 1].value >= data[0].value)
  }, [])

  const gradientOffset = () => {
    if (chartData.length === 0) return 0

    const dataMax = Math.max(...chartData.map((i) => i.value))
    const dataMin = Math.min(...chartData.map((i) => i.value))

    if (dataMax <= 0) return 0
    if (dataMin >= 0) return 1

    return dataMax / (dataMax - dataMin)
  }

  const chartColor = isPositive ? "#22C55E" : "#EF4444" // Green for positive, red for negative
  const gridColor = theme === "dark" ? "#374151" : "#E5E7EB"
  const textColor = theme === "dark" ? "#9CA3AF" : "#6B7280"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset={gradientOffset()} stopColor={chartColor} stopOpacity={0.3} />
            <stop offset={gradientOffset()} stopColor={chartColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="formattedDate"
          tick={{ fill: textColor }}
          axisLine={{ stroke: gridColor }}
          tickLine={{ stroke: gridColor }}
          tickFormatter={(value) => value}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fill: textColor }}
          axisLine={{ stroke: gridColor }}
          tickLine={{ stroke: gridColor }}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
        />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={chartColor}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
