import { React, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import { ArrowDown, ArrowUp, Clock, Star } from "lucide-react";
import StockChart from "../components/StockChart";
import BuySellPanel from "../components/BuySellPanel";
import { useParams } from "react-router";
import useStockStore from '../store/stockStore';

const StockDetail = () => {
  const { theme } = themeStore((state) => state);
  const { stocks } = useStockStore();
  const { symbol } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [stockData, setStockData] = useState(null);

  // Theme classes
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const activeButtonBg = theme === "dark" ? "bg-blue-600" : "bg-blue-500";
  const inactiveButtonBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

  useEffect(() => {
    const fetchStockData = () => {
      setLoading(true);
      try {
        const liveStock = stocks[symbol];
        
        if (liveStock) {
          // Generate mock fundamental data based on the live stock
          const mockFundamentals = {
            open: liveStock.price * (1 + (Math.random() * 0.02 - 0.01)), // ±1% from current
            high: liveStock.price * (1 + Math.random() * 0.03), // Up to 3% higher
            low: liveStock.price * (1 - Math.random() * 0.03), // Up to 3% lower
            volume: `${(Math.random() * 50 + 5).toFixed(1)}M`, // 5-55M volume
            marketCap: `${(liveStock.price * (Math.random() * 10 + 1) / 1000).toFixed(2)}T`, // Random market cap
            peRatio: (Math.random() * 30 + 10).toFixed(2), // PE between 10-40
            dividendYield: (Math.random() * 3).toFixed(2), // Yield 0-3%
            eps: (liveStock.price / (Math.random() * 30 + 10)).toFixed(2), // Random EPS
            beta: (Math.random() * 1.5 + 0.5).toFixed(2), // Beta 0.5-2.0
            yearHigh: liveStock.price * (1 + Math.random() * 0.3), // Up to 30% higher
            yearLow: liveStock.price * (1 - Math.random() * 0.3), // Up to 30% lower
            avgVolume: `${(Math.random() * 20 + 40).toFixed(1)}M` // 40-60M avg volume
          };

          setStockData({
            symbol: symbol,
            name: liveStock.name,
            currentPrice: liveStock.price,
            change: liveStock.price - liveStock.previousClosingPrice,
            changePercent: liveStock.percentageChange,
            ...mockFundamentals
          });
        } else {
          // Fallback data if stock not found
          setStockData({
            symbol: symbol,
            name: symbol,
            currentPrice: 0,
            change: 0,
            changePercent: 0,
            open: 0,
            high: 0,
            low: 0,
            volume: "0M",
            marketCap: "0T",
            peRatio: 0,
            dividendYield: 0,
            eps: 0,
            beta: 0,
            yearHigh: 0,
            yearLow: 0,
            avgVolume: "0M"
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, stocks]);

  const timeframes = [
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "1Y", value: "1Y" },
    { label: "5Y", value: "5Y" },
    { label: "All", value: "ALL" },
  ];

  if (loading || !stockData) {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-20 transition-all duration-300 overflow-hidden">
        <TopSearchBar />

        <main className={`flex-1 md:ml-48 overflow-y-auto ${textColor} p-4 md:p-6`}>
          <div className="flex flex-col lg:flex-row gap-6 max-w-screen-2xl mx-auto">
            {/* Main content */}
            <div className="w-full lg:w-2/3">
              {/* Stock header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{stockData.name}</h1>
                    <span className={`text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {stockData.symbol}
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
                    <span className="text-3xl font-bold">₹{stockData.currentPrice.toFixed(2)}</span>
                    <span
                      className={`flex items-center ${
                        stockData.change >= 0 ? "text-green-500" : "text-red-500"
                      } text-lg`}
                    >
                      {stockData.change >= 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      ₹{Math.abs(stockData.change).toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart section */}
              <div className={`${cardBg} rounded-xl border ${borderColor} p-4 mb-6`}>
                <div className="flex flex-wrap gap-2 mb-4">
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
                  <StockChart timeframe={selectedTimeframe} theme={theme} />
                </div>
              </div>

              {/* Stock info */}
              <div className={`${cardBg} rounded-xl border ${borderColor} p-6 mb-6`}>
                <h2 className="text-xl font-bold mb-4">Key Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>Open</p>
                    <p className="font-medium">₹{stockData.open.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>High</p>
                    <p className="font-medium">₹{stockData.high.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>Low</p>
                    <p className="font-medium">₹{stockData.low.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>Volume</p>
                    <p className="font-medium">{stockData.volume}</p>
                  </div>
                </div>
              </div>

              {/* Fundamentals */}
              <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
                <h2 className="text-xl font-bold mb-4">Fundamentals</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>Market Cap</p>
                    <p className="font-medium">₹{stockData.marketCap}</p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>P/E Ratio</p>
                    <p className="font-medium">{stockData.peRatio}</p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>Dividend Yield</p>
                    <p className="font-medium">{stockData.dividendYield}%</p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>EPS</p>
                    <p className="font-medium">₹{stockData.eps}</p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>Beta</p>
                    <p className="font-medium">{stockData.beta}</p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>52-Week Range</p>
                    <p className="font-medium">
                      ₹{stockData.yearLow.toFixed(2)} - ₹{stockData.yearHigh.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className={`${secondaryTextColor} text-sm mb-1`}>Avg. Volume</p>
                    <p className="font-medium">{stockData.avgVolume}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buy/Sell panel */}
            <div className="w-full lg:w-1/3">
              <BuySellPanel stockName={symbol} theme={theme} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockDetail;