import { React, useState, useEffect, useMemo, useRef } from "react"; // Import useRef
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import { ArrowDown, ArrowUp, Clock } from "lucide-react"; // Removed Star if not used
import StockChart from "../components/StockChart";
import BuySellPanel from "../components/BuySellPanel";
import { useParams } from "react-router";
import useStockStore from '../store/stockStore';

const StockDetail = () => {
  const { theme } = themeStore(state => state);
  const { symbol } = useParams();

  // Select specific stock data from the store
  const liveStockData = useStockStore(state => state.stocks[symbol]);

  // Local state for selected timeframe
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  // Local state for mock fundamentals (should update only when symbol changes)
  const [fundamentals, setFundamentals] = useState(null);

  // Loading state - true initially, true when symbol changes, false when live data arrives
  const [isLoading, setIsLoading] = useState(true);


  // Effect 1: Handle symbol change and initial data availability
  useEffect(() => {
      setIsLoading(true); // Assume loading whenever symbol changes

      // Check if the live data for the new symbol is available in the store immediately
      if (liveStockData) {
          // Data is available, set loading to false
          setIsLoading(false);

          // Generate fundamentals ONLY when liveStockData for the current symbol is found
          // This runs on mount for the initial symbol, and whenever symbol changes
          // *and* data is available. This ensures fundamentals are generated once *per stock*.
          const mockFundamentals = { /* ... generate mock data using liveStockData.price ... */ };
          setFundamentals(mockFundamentals);

      } else {
         // Data not immediately available for the new symbol.
         // Stay in loading state. The useEffect below will handle when it arrives.
         setFundamentals(null); // Clear old fundamentals if symbol changes and data is not ready
         // TODO: Consider a timeout here to show "not found" if data never arrives.
      }

  }, [symbol, liveStockData]); // Depend on symbol to reset state, depend on liveStockData to know when data arrives


  // Theme classes (kept for clarity)
const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
const secondaryTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
const activeButtonBg = theme === "dark" ? "bg-blue-600" : "bg-blue-500";
const inactiveButtonBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";


  // Effect 2: (Optional but good for clarity) Handle the case where live data arrives *later*
  // This effect is redundant if Effect 1 is sufficient, let's rethink Effect 1's dependencies.

  // Simpler approach for Effect 1: React only to symbol change for fundamentals and loading
  // React to liveStockData separately for derived values.

  // Let's try this structure:
  // - Effect 1: Reacts to `symbol`. Sets `isLoading` true, clears `fundamentals`.
  // - Effect 2: Reacts to `liveStockData`. If `liveStockData` is available, set `isLoading(false)`.
  // - Effect 3: Reacts to `symbol` and `liveStockData`. *If* `liveStockData` is available *and* `fundamentals` is null (or the symbol in fundamentals doesn't match), generate and set `fundamentals`.

  // Even better: Combine the loading and fundamentals generation.
  // The main `useEffect` should react to `symbol`. Inside, *if* `liveStockData` is *already* there, generate fundamentals and set loading to false.
  // If `liveStockData` is *not* there, `isLoading` remains true initially. A subsequent render (triggered by `liveStockData` arriving via the store) will re-run the effect, find `liveStockData`, generate fundamentals, and set `isLoading` to false.

  useEffect(() => {
      // Reset state when symbol changes
      setIsLoading(true);
      setFundamentals(null); // Clear old fundamentals

      // Wait for liveStockData to become available for the new symbol
      // The component will re-render when liveStockData changes.
  }, [symbol]); // Only react when the symbol changes

  // Effect to handle data arrival and set fundamentals *only once*
  useEffect(() => {
      if (liveStockData && fundamentals === null) { // Check if live data is here AND fundamentals haven't been set for THIS symbol yet
          setIsLoading(false); // Data arrived, stop loading

           // Generate mock fundamental data using liveStockData.price
           const mockFundamentals = {
             open: (liveStockData.price || 0) * (1 + (Math.random() * 0.02 - 0.01)),
             high: (liveStockData.price || 0) * (1 + Math.random() * 0.03),
             low: (liveStockData.price || 0) * (1 - Math.random() * 0.03),
             volume: `${(Math.random() * 50 + 5).toFixed(1)}M`,
             marketCap: `${((liveStockData.price || 0) * (Math.random() * 10 + 1) / 1000).toFixed(2)}T`,
             peRatio: (Math.random() * 30 + 10).toFixed(2),
             dividendYield: (Math.random() * 3).toFixed(2),
             eps: (liveStockData.price && (Math.random() * 30 + 10)) ? ((liveStockData.price || 0) / (Math.random() * 30 + 10)).toFixed(2) : 'N/A',
             beta: (Math.random() * 1.5 + 0.5).toFixed(2),
             yearHigh: (liveStockData.price || 0) * (1 + Math.random() * 0.3),
             yearLow: (liveStockData.price || 0) * (1 - Math.random() * 0.3),
             avgVolume: `${(Math.random() * 20 + 40).toFixed(1)}M`
           };
           setFundamentals(mockFundamentals);
      } else if (!liveStockData && !isLoading) {
          // If live data disappears after being loaded, maybe set isLoading back to true?
          // Or show an error message. For now, let's rely on the initial load handling.
           // If liveStockData is null/undefined and we aren't already in a loading state
           // This might indicate the stock was removed or an error occurred.
           // Let's set loading to true and clear fundamentals so the loading state is shown.
           // However, this effect runs whenever liveStockData changes, including when it becomes null.
           // Let's refine the loading logic.
      }
  }, [liveStockData, fundamentals, isLoading]); // Depend on liveStockData to trigger when it arrives

   // Let's consolidate the loading logic.
   // Loading is true initially and when symbol changes.
   // Loading becomes false *only* when liveStockData for the *current* symbol is available.

   useEffect(() => {
       // When symbol changes, reset loading state and fundamentals
       setIsLoading(true);
       setFundamentals(null);
   }, [symbol]); // React only to symbol changes

   useEffect(() => {
       // When liveStockData changes *for the current symbol*
       if (liveStockData) {
           // Data is available! Stop loading.
           setIsLoading(false);

           // Generate fundamentals ONLY if they haven't been generated for this symbol yet.
           // How to know if they haven't been generated for THIS symbol?
           // We cleared them when the symbol changed in the effect above.
           // So, if liveStockData is available and fundamentals are null, generate them.
           if (fundamentals === null) {
                const mockFundamentals = { /* ... generate mock data using liveStockData.price ... */ };
                setFundamentals(mockFundamentals);
           }
       } else {
           // If liveStockData becomes null/undefined, it means the data for this stock is gone.
           // Stay in loading state, or transition to an error/not found state after a timeout.
           // For now, let's just stay loading. The initial render will handle the !liveStockData case.
       }
   }, [liveStockData, symbol, fundamentals]); // Depend on symbol and fundamentals state to ensure it triggers correctly


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


  // Check if data is ready to render the main content
  // Ready if NOT loading AND we have liveStockData AND we have fundamentals
   const isDataReady = !isLoading && liveStockData !== null && fundamentals !== null;

   

  // --- Loading/Error State Render ---
  if (!isDataReady) {
    // Check the specific state to show appropriate message
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
        // Not loading, but data not ready means liveStockData or fundamentals are null/undefined
        // This indicates the stock was not found in the store after loading finished.
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

  // --- Main Content Render (only if data is ready) ---
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
                  <StockChart symbol={symbol} timeframe={selectedTimeframe} theme={theme} />
                </div>
              </div>

              {/* Stock info (Key Statistics) */}
              {/* Only render fundamentals section if fundamentals data is available */}
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
              <BuySellPanel stockName={symbol} theme={theme} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockDetail;