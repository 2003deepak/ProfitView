import React, { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useStockStore from '../store/stockStore';

const StockChart = ({ timeframe = '1D', theme = 'light' }) => {
  const { stocks } = useStockStore();
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('Angel One');
  const [isPositive, setIsPositive] = useState(true);

  const liveStock = stocks[selectedSymbol];

  useEffect(() => {
    if (liveStock) {
      setPriceHistory(prev => {
        const newHistory = [
          ...prev,
          {
            price: liveStock.price,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            formattedDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            openingPrice: prev.length > 0 ? prev[0].price : liveStock.price
          }
        ].slice(-390); // Keep last 390 data points
        
        // Update trend direction
        if (newHistory.length > 1) {
          setIsPositive(newHistory[newHistory.length - 1].price >= newHistory[0].price);
        }
        
        return newHistory;
      });
    }
  }, [liveStock]);

  // Theme colors based on trend and theme
  const chartColor = isPositive ? 
    (theme === "dark" ? "#4ade80" : "#16a34a") :  // Green (dark/light)
    (theme === "dark" ? "#f87171" : "#dc2626");   // Red (dark/light)
  
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const axisColor = theme === "dark" ? "#9ca3af" : "#6b7280";

  if (!liveStock) {
    return (
      <div className={`h-[400px] flex items-center justify-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Loading stock data...
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
    const valueColor = payload[0].value >= payload[0].payload.openingPrice ? "text-green-500" : "text-red-500";

    return (
      <div className={`${bgColor} ${textColor} p-3 border ${borderColor} rounded-lg shadow-lg text-sm`}>
        <p className="font-medium">{payload[0].payload.formattedDate}</p>
        <p className={valueColor}>₹{payload[0].value.toFixed(2)}</p>
        <p className="text-xs opacity-75">
          {payload[0].value >= payload[0].payload.openingPrice ? "+" : ""}
          {(payload[0].value - payload[0].payload.openingPrice).toFixed(2)} (
          {(((payload[0].value - payload[0].payload.openingPrice) / payload[0].payload.openingPrice) * 100).toFixed(2)}%)
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
     
      {/* Chart container with Recharts implementation */}
      <div className={`h-[400px] w-full ${theme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl p-4 shadow border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={priceHistory}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5
            }}
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
