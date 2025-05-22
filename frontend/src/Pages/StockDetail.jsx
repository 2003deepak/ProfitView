import { React, useState, useEffect, useMemo, useRef } from "react"; 
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import { ArrowDown, ArrowUp, Clock } from "lucide-react"; 
import StockChart from "../components/StockChart";
import BuySellPanel from "../components/BuySellPanel";
import { useParams } from "react-router";
import useStockStore from '../store/stockStore';

const StockDetail = () => {
  const { theme } = themeStore(state => state);
  const { symbol } = useParams();

  const liveStockData = useStockStore(state => state.stocks[symbol]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [isLoading, setIsLoading] = useState(true);

  const fundamentals = {
    open: 10,
    high: 10,
    low: 10,
    volume: `10M`,
    marketCap: `100Cr`,
    peRatio: 10.2,
    dividendYield: `2%`,
    eps: 520.36,
    beta: 10,
    yearHigh: 800520,
    yearLow: 704500,
    avgVolume: '10M',
  };


  // Effect 1: Handle symbol change and initial data availability
  useEffect(() => {
      setIsLoading(true); // Assume loading whenever symbol changes

     
      if (liveStockData) {
          
          setIsLoading(false);

      } 
  }, [symbol, liveStockData]); 


  // Theme classes (kept for clarity)
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const activeButtonBg = theme === "dark" ? "bg-blue-600" : "bg-blue-500";
  const inactiveButtonBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";


  

   // Derived state for display
   const { currentPrice, change, changePercent } = useMemo(() => {

     const price = liveStockData?.price || 0;
     const prevClose = liveStockData?.previousClosingPrice || 0;
     let calculatedChange = 0;
     let calculatedChangePercent = 0;

     if (price > 0 && prevClose > 0) {
         calculatedChange = price - prevClose;
         calculatedChangePercent = (calculatedChange / prevClose) * 100;
     } else if (liveStockData?.percentageChange !== undefined) {
          calculatedChangePercent = liveStockData.percentageChange;
          // No absolute change without prevClose
     }

     return {
       currentPrice: price,
       change: calculatedChange,
       changePercent: calculatedChangePercent,
     };
   }, [liveStockData]); // Only recalculate when liveStockData changes


   const isDataReady = !isLoading && liveStockData !== null && fundamentals !== null;

   

  // --- Loading/Error State Render ---
  if (!isDataReady) {
   
    if (isLoading) {
         // Loading state: Data is either not fetched yet or symbol changed
         return (
             <div className={`min-h-screen w-screen flex items-center justify-center ${bgColor} ${textColor}`}>
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <p className={`mt-4 ${secondaryTextColor}`}>Loading stock data for {symbol}...</p>
                </div>
             </div>
         );
    } else {
       
        return (
             <div className={`min-h-screen w-screen flex items-center justify-center ${bgColor} ${textColor}`}>
                 <div className={`text-red-500 ${textColor}`}>Stock '{symbol}' not found or data unavailable.</div>
             </div>
        );
    }
  }
  // The code below only runs when isDataReady is true.


  const timeframes = [
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "1Y", value: "1Y" },
    { label: "5Y", value: "5Y" },
    { label: "All", value: "ALL" },
  ];

  
  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-20 transition-all duration-300 overflow-hidden">
        <TopSearchBar />

        <main className={`flex-1 md:ml-48 overflow-y-auto ${textColor} p-4 md:p-6`}>
          <div className="flex flex-col lg:flex-row gap-6 max-w-screen-2xl mx-auto">
            {/* Main content area */}
            <div className="w-full lg:w-2/3">
              {/* Stock header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {/* Use liveStockData.name if available, fallback to symbol */}
                    <h1 className="text-2xl font-bold">{liveStockData?.name || symbol}</h1>
                    <span className={`text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className={`text-sm ${secondaryTextColor}`}>
                      <Clock className="inline mr-1 h-4 w-4" />
                      Real-time data
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                  <div className="flex items-baseline gap-2">
                     {/* Use currentPrice from derived state */}
                    <span className="text-3xl font-bold">₹{currentPrice.toFixed(2)}</span>
                    {/* Use change and changePercent from derived state */}
                    <span
                      className={`flex items-center ${
                        change >= 0 ? "text-green-500" : "text-red-500"
                      } text-lg`}
                    >
                      {change >= 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      ₹{Math.abs(change).toFixed(2)} ({changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart section */}
              <div className={`${cardBg} rounded-xl border ${borderColor} p-4 mb-6`}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Pass selectedTimeframe state and setter to the button */}
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe.value}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedTimeframe === timeframe.value
                          ? `${activeButtonBg} text-white`
                          : `${inactiveButtonBg} ${secondaryTextColor} border ${borderColor}`
                      }`}
                      onClick={() => setSelectedTimeframe(timeframe.value)}
                    >
                      {timeframe.label}
                    </button>
                  ))}
                </div>

                <div className="h-[300px] sm:h-[400px]">
                  {/* Pass symbol and potentially live data or let Chart fetch its own */}
                  <StockChart symbol={symbol} timeframe={selectedTimeframe}  />
                </div>
              </div>

              {/* Stock info (Key Statistics) */}

              {fundamentals && (
                <div className={`${cardBg} rounded-xl border ${borderColor} p-6 mb-6`}>
                  <h2 className="text-xl font-bold mb-4">Key Statistics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div>
                      <p className={`${secondaryTextColor} text-sm mb-1`}>Open</p>
                      <p className="font-medium">₹{fundamentals.open}</p>
                    </div>
                    <div>
                      <p className={`${secondaryTextColor} text-sm mb-1`}>High</p>
                      <p className="font-medium">₹{fundamentals.high}</p>
                    </div>
                    <div>
                      <p className={`${secondaryTextColor} text-sm mb-1`}>Low</p>
                      <p className="font-medium">₹{fundamentals.low}</p>
                    </div>
                    <div>
                      <p className={`${secondaryTextColor} text-sm mb-1`}>Volume</p>
                      <p className="font-medium">{fundamentals.volume}</p>
                    </div>
                     {/* Add other key stats from fundamentals */}
                      <div>
                        <p className={`${secondaryTextColor} text-sm mb-1`}>Avg. Volume</p>
                        <p className="font-medium">{fundamentals.avgVolume}</p>
                      </div>
                       {/* Add more if needed */}
                  </div>
                </div>
              )}


              {/* Fundamentals (Financial Ratios etc) */}
               {fundamentals && (
                  <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
                    <h2 className="text-xl font-bold mb-4">Fundamentals</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                      <div>
                        <p className={`${secondaryTextColor} text-sm mb-1`}>Market Cap</p>
                        <p className="font-medium">₹{fundamentals.marketCap}</p>
                      </div>
                      <div>
                        <p className={`${secondaryTextColor} text-sm mb-1`}>P/E Ratio</p>
                        <p className="font-medium">{fundamentals.peRatio}</p>
                      </div>
                      <div>
                        <p className={`${secondaryTextColor} text-sm mb-1`}>Dividend Yield</p>
                        <p className="font-medium">{fundamentals.dividendYield}%</p>
                      </div>
                      <div>
                        <p className={`${secondaryTextColor} text-sm mb-1`}>EPS</p>
                        <p className="font-medium">₹{fundamentals.eps}</p>
                      </div>
                      <div>
                        <p className={`${secondaryTextColor} text-sm mb-1`}>Beta</p>
                        <p className="font-medium">{fundamentals.beta}</p>
                      </div>
                       <div>
                        <p className={`${secondaryTextColor} text-sm mb-1`}>52-Week Range</p>
                        {/* Safely access yearLow/High */}
                        <p className="font-medium">
                          ₹{fundamentals.yearLow?.toFixed(2) || '0.00'} - ₹{fundamentals.yearHigh?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
               )}

            </div>

            {/* Buy/Sell panel */}
            <div className="w-full lg:w-1/3">
              {/* Pass the symbol prop */}
              <BuySellPanel stockName={symbol} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockDetail;