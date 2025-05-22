import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router";
import themeStore from "../store/themeStore";
import useStockStore from "../store/stockStore";
import { Skeleton, SkeletonCircle,SkeletonText, VStack, HStack, Box } from "@chakra-ui/react";

const StockDisplay = ({ stockName, isLoading }) => {
  const { theme } = themeStore((state) => state);
  const navigate = useNavigate();
  const stockData = useStockStore((state) => state.stocks[stockName]);

  if (isLoading || !stockData) {
  return (
    <Box 
      p={4} 
      borderRadius="lg" 
      borderWidth="1px"
      bg={theme === 'dark' ? 'gray.700' : 'gray.50'}
      borderColor={theme === 'dark' ? 'gray.600' : 'gray.200'}
    >
      <VStack align="stretch" spacing={3}>
        {/* Stock name and indicator */}
        <HStack justifyContent="space-between" width="full" mb={2}>
          <Skeleton 
            height="16px" 
            width="70px" 
            borderRadius="md"
          />
          <SkeletonCircle size="20px" />
        </HStack>
        
        {/* Price */}
        <SkeletonText noOfLines={2} />
        
      </VStack> 
    </Box>
  );
}


  const currentPrice = stockData?.price || 0;
  const percantageChange = stockData?.percentageChange || 0;
  const isPositive = percantageChange > 0;

  // Theme-based styles
  const cardBg = theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const indicatorBg = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200';
  const changeColor = isPositive ? "text-green-500" : "text-red-500";
  const ArrowIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <div 
      className={`p-4 rounded-lg transition-all duration-200 ${cardBg} border ${borderColor} shadow-xs`} 
      onClick={() => navigate(`/user/stock/${stockName}`)}
    >
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
          {percantageChange}%
        </span>
      </div>
    </div>
  );
};

export default StockDisplay;