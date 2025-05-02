import React, { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomTooltip = ({ active, payload, label, theme }) => {
  if (!active || !payload?.length) return null;
  
  const { invested, current, gain } = payload[0].payload;
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const fg = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const bd = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`${bg} ${fg} p-3  border ${bd} rounded shadow-lg`}>
      <p className="font-medium">{label}</p>
      <p className="text-blue-600 font-medium">
        Invested: ₹{invested.toLocaleString("en-IN")}
      </p>
      <p className={current >= invested ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
        Current: ₹{current.toLocaleString("en-IN")}
      </p>
      <p className={gain >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
        {gain >= 0 ? "↑" : "↓"} {Math.abs(gain).toFixed(2)}%
      </p>
    </div>
  );
};

function PortfolioChart({ theme }) {
  const [chartData, setChartData] = useState([]);
  const [currentVal, setCurrentVal] = useState({ amount: 0, profitPct: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Generate more dynamic portfolio data with realistic fluctuations
  const generatePortfolioData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 days back
    
    let invested = 50000;
    let current = 51000;
    
    for (let i = 0; i <= 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Simulate market movements with more volatility
      const dailyChange = (Math.random() - 0.45) * 0.03; // -3% to +3% daily change
      current = current * (1 + dailyChange);
      
      // Add investments periodically
      if (i % 5 === 0 && i !== 0) {
        const investment = 10000 + Math.random() * 20000;
        invested += investment;
        // Investment bump affects current value
        current += investment * (0.9 + Math.random() * 0.2);
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        invested: Math.round(invested),
        current: Math.round(current),
        gain: ((current - invested) / invested) * 100
      });
    }
    
    return data;
  };

  useEffect(() => {
    const data = generatePortfolioData();
    
    const processedData = data.map((item) => {
      const date = new Date(item.date);
      return {
        formattedDate: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        invested: item.invested,
        current: item.current,
        gain: item.gain,
        isProfit: item.gain >= 0
      };
    });
    
    setChartData(processedData);
    
    if (processedData.length > 0) {
      const lastEntry = processedData[processedData.length - 1];
      setCurrentVal({
        amount: lastEntry.current,
        profitPct: lastEntry.gain
      });
    }
    
    setIsLoading(false);
  }, []);

  // Chart styling
  const grid = theme === "dark" ? "#374151" : "#E5E7EB";
  const txt = theme === "dark" ? "#9CA3AF" : "#6B7280";
  const profitColor = "#22C55E";
  const lossColor = "#EF4444";
  const invColor = "#3B82F6";
  
  // Determine if overall portfolio is in profit
  const isOverallProfit = currentVal.profitPct >= 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading portfolio data…</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
     
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            
            <XAxis
              dataKey="formattedDate"
              tick={{ fill: txt, fontSize: 12 }}
              axisLine={{ stroke: grid }}
              tickLine={{ stroke: grid }}
              tickMargin={10}
              interval={Math.floor(chartData.length / 7)}
            />

            <YAxis
              tick={{ fill: txt, fontSize: 12 }}
              axisLine={{ stroke: grid }}
              tickLine={{ stroke: grid }}
              tickFormatter={(v) => `₹${v / 1000}k`}
              domain={['auto', 'auto']}
              tickMargin={10}
            />

            <Tooltip content={<CustomTooltip theme={theme} />} />
            
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />

            {/* Invested Amount Line (dashed) */}
            <Line
              type="monotone"
              dataKey="invested"
              stroke={invColor}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Invested Amount"
              activeDot={{ r: 6 }}
            />

            {/* Current Value Line (solid) - color changes based on profit/loss */}
            <Line
              type="monotone"
              dataKey="current"
              stroke={isOverallProfit ? profitColor : lossColor}
              strokeWidth={3}
              dot={false}
              name="Current Value"
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      
    </div>
  );
}

export default PortfolioChart;