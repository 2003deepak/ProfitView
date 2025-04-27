import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router";
import themeStore from "../store/themeStore"; 

const StockDisplay = ({ stockName, currentPrice, change, isPositive }) => {
  const { theme } = themeStore((state) => state);
  const navigate = useNavigate();
  
  // Theme-based styles
  const cardBg = theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const indicatorBg = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200';
  
  // Change colors
  const changeColor = isPositive ? "text-green-500" : "text-red-500";
  const ArrowIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <div className={`p-4 rounded-lg transition-all duration-200 ${cardBg} border ${borderColor} shadow-xs`} 
          onClick={ () => navigate(`/user/stock/${stockName}`)}>

      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm font-medium ${mutedTextColor}`}>{stockName}</p>
        <div className={`p-1 rounded-full ${indicatorBg}`}>
          <ArrowIcon className="h-3 w-3 ${changeColor}" />
        </div>
      </div>
      
      <p className={`text-2xl font-bold ${textColor} mb-1`}>
        {currentPrice}
      </p>
      
      <div className="flex items-center">
        <span className={`text-sm font-medium ${changeColor}`}>
          {change}
        </span>
        <span className={`text-xs ml-2 ${mutedTextColor}`}>
          Today
        </span>
      </div>
    </div>
  );
};

export default StockDisplay;