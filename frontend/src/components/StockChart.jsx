import React, { useState, useEffect } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import useStockStore from '../store/stockStore';

const StockChart = ({ timeframe = '1D', theme = 'light' }) => {
  const { stocks } = useStockStore();
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('Angel One');
  const [isPositive, setIsPositive] = useState(true);
  const [startPrice, setStartPrice] = useState(null);

  const liveStock = stocks[selectedSymbol];

  useEffect(() => {
    // Initialize time slots when component mounts
    const initializeTimeSlots = () => {
      const now = new Date();
      const slots = [];
      // Generate fixed time slots for the chart (e.g., for a day view)
      // This creates a stable x-axis that won't shift
      for (let i = 0; i < 100; i++) {
        const slotTime = new Date(now.getTime() - (99 - i) * 60000); // One point per minute
        slots.push({
          time: slotTime,
          formattedDate: slotTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          price: null // Will be filled with actual values as they come in
        });
      }
      return slots;
    };
    
    const initialSlots = initializeTimeSlots();
    setPriceHistory(initialSlots);
  }, [timeframe]); // Re-initialize when timeframe changes

  useEffect(() => {
    if (liveStock && priceHistory.length > 0) {
      // Set initial price reference point if not set
      if (startPrice === null) {
        setStartPrice(liveStock.price);
      }

      // Update only the latest time slot with new price
      setPriceHistory(prev => {
        const now = new Date();
        const newHistory = [...prev];
        
        // Find the slot that's closest to current time
        const currentSlotIndex = newHistory.findIndex(slot => 
          slot.time > now || 
          (slot === newHistory[newHistory.length - 1])  // or use the last slot if we're past all slots
        );
        
        const indexToUpdate = currentSlotIndex === -1 ? newHistory.length - 1 : Math.max(0, currentSlotIndex - 1);
        
        // Only update if the price has changed
        if (newHistory[indexToUpdate].price !== liveStock.price) {
          newHistory[indexToUpdate] = {
            ...newHistory[indexToUpdate],
            price: liveStock.price
          };
          
          // Interpolate missing values (fill gaps)
          let lastKnownPrice = null;
          for (let i = 0; i < newHistory.length; i++) {
            if (newHistory[i].price !== null) {
              lastKnownPrice = newHistory[i].price;
            } else if (lastKnownPrice !== null) {
              newHistory[i].price = lastKnownPrice;
            }
          }
          
          // Check if price is positive compared to start of the day
          setIsPositive(liveStock.price >= startPrice);
        }
        
        return newHistory;
      });
    }
  }, [liveStock, startPrice, priceHistory.length]);

  const chartColor = isPositive
    ? theme === 'dark' ? '#4ade80' : '#16a34a'
    : theme === 'dark' ? '#f87171' : '#dc2626';

  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';
  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  if (!liveStock) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        Loading stock data...
      </div>
    );
  }

  // Filter out any data points without prices
  const validPriceHistory = priceHistory.filter(point => point.price !== null);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
    const valueColor = payload[0].value >= startPrice ? "text-green-500" : "text-red-500";

    return (
      <div className={`${bgColor} ${textColor} p-3 border ${borderColor} rounded-lg shadow-lg text-sm`}>
        <p className="font-medium">{payload[0].payload.formattedDate}</p>
        <p className={valueColor}>₹{payload[0].value.toFixed(2)}</p>
        <p className="text-xs opacity-75">
          {payload[0].value >= startPrice ? "+" : ""}
          {(payload[0].value - startPrice).toFixed(2)} (
          {(((payload[0].value - startPrice) / startPrice) * 100).toFixed(2)}%)
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className={`h-96 w-full ${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-4 shadow border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={validPriceHistory}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
              strokeOpacity={0.5}
            />

            <XAxis
              dataKey="formattedDate"
              minTickGap={40}
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
                strokeDasharray: "3 3"
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
              activeDot={{
                r: 5,
                stroke: theme === "dark" ? "#1f2937" : "#f3f4f6",
                strokeWidth: 2,
                fill: chartColor
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;