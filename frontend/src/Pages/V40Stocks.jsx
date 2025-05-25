import { React, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import useStockStore from "../store/stockStore.js";
import { useNavigate } from "react-router";
import DashboardHeader from "../components/DashboardHeader";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Search,
  Star
} from "lucide-react";
import StockDisplay from "../components/StockDisplay.jsx";

const V40Stocks = () => {

  const { theme, setTheme } = themeStore((state) => state);
  const { stocks } = useStockStore((state) => state);
  const [searchText, setSearchText] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [marketStatus, setMarketStatus] = useState("open"); 

  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const allStocks = [
    { name: "Eris Lifesciences", symbol: "ERIS", price: "₹1,266.30", change: "+1.2%" },
    { name: "ICICI Securities", symbol: "ICICISEC", price: "₹796.65", change: "-0.5%" },
    { name: "Angel One", symbol: "ANGELONE", price: "₹2,525.30", change: "+2.1%" },
    { name: "Nippon India ETF Bank BeES", symbol: "BANKBEES", price: "₹498.82", change: "+0.8%" },
    { name: "Nippon India ETF Nifty 50 BeES", symbol: "NIFTYBEES", price: "₹257.91", change: "+0.3%" },
    { name: "Bajaj Finance", symbol: "BAJFINANCE", price: "₹7,291.65", change: "-1.2%" },
    { name: "Bajaj Holdings & Investment", symbol: "BAJAJHLDNG", price: "₹10,797.00", change: "+0.7%" },
    { name: "Bajaj Finserv", symbol: "BAJAJFINSV", price: "₹1,717.00", change: "+0.4%" },
    { name: "ICICI Lombard General Insurance Company", symbol: "ICICIGI", price: "₹1,902.50", change: "-0.3%" },
    { name: "ICICI Prudential Life Insurance Company", symbol: "ICICIPRULI", price: "₹635.55", change: "+1.5%" },
    { name: "HDFC Life Insurance Company", symbol: "HDFCLIFE", price: "₹624.00", change: "+0.9%" },
    { name: "Bajaj Auto", symbol: "BAJAJ-AUTO", price: "₹8,468.55", change: "-0.8%" },
    { name: "Akzo Nobel India", symbol: "AKZOINDIA", price: "₹3,812.35", change: "+1.1%" },
    { name: "Berger Paints India", symbol: "BERGEPAINT", price: "₹475.20", change: "+0.6%" },
    { name: "Asian Paints", symbol: "ASIANPAINT", price: "₹2,260.35", change: "-0.4%" },
    { name: "Pfizer", symbol: "PFIZER", price: "₹4,944.50", change: "+0.3%" },
    { name: "Abbott India", symbol: "ABBOTINDIA", price: "₹21,522.50", change: "+2.1%" },
    { name: "GlaxoSmithKline Pharmaceuticals", symbol: "GLAXO", price: "₹1,360.20", change: "-0.5%" },
    { name: "Whirlpool Of India", symbol: "WHIRLPOOL", price: "₹1,710.40", change: "+0.7%" },
    { name: "Havells India", symbol: "HAVELLS", price: "₹1,322.65", change: "+0.2%" },
    { name: "Bata India", symbol: "BATAINDIA", price: "₹1,498.35", change: "-0.9%" },
    { name: "Page Industries", symbol: "PAGEIND", price: "₹38,004.85", change: "+1.8%" },
    { name: "Titan Company", symbol: "TITAN", price: "₹3,186.20", change: "+0.5%" },
    { name: "ITC", symbol: "ITC", price: "₹384.45", change: "-0.2%" },
    { name: "Marico", symbol: "MARICO", price: "₹503.15", change: "+0.4%" },
    { name: "Gillette India", symbol: "GILLETTE", price: "₹6,158.25", change: "+1.2%" },
    { name: "Dabur India", symbol: "DABUR", price: "₹517.65", change: "-0.3%" },
    { name: "Colgate-Palmolive (India)", symbol: "COLPAL", price: "₹1,698.85", change: "+0.7%" },
    { name: "Pidilite Industries", symbol: "PIDILITIND", price: "₹2,462.35", change: "+0.9%" },
    { name: "Procter & Gamble Hygiene & Health Care", symbol: "PGHH", price: "₹12,498.15", change: "+0.6%" },
    { name: "Nestle India", symbol: "NESTLEIND", price: "₹20,415.30", change: "+1.1%" },
    { name: "Hindustan Unilever", symbol: "HINDUNILVR", price: "₹2,642.10", change: "-0.4%" },
    { name: "Infosys", symbol: "INFY", price: "₹1,324.55", change: "+0.8%" },
    { name: "TCS", symbol: "TCS", price: "₹3,255.20", change: "+0.3%" },
    { name: "HCL Technologies", symbol: "HCLTECH", price: "₹1,232.80", change: "-0.2%" },
    { name: "HDFC Bank", symbol: "HDFCBANK", price: "₹1,587.40", change: "+0.5%" },
    { name: "Axis Bank", symbol: "AXISBANK", price: "₹931.25", change: "+0.7%" },
    { name: "ICICI Bank", symbol: "ICICIBANK", price: "₹1,021.85", change: "+0.4%" },
    { name: "Kotak Mahindra Bank", symbol: "KOTAKBANK", price: "₹1,765.35", change: "-0.1%" },
    { name: "JSW Energy", symbol: "JSW", price: "₹34,434.00", change: "+2.3%" },
  ];

  const marketIndices = ["Nifty 50", "Nifty Bank", "SENSEX"];


  // Theme colors
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardSecondaryBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const tableRowHover = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const tableBorder = theme === "dark" ? "border-gray-700" : "border-gray-200";

  useEffect(() => {
    // Initialize with all stocks when component mounts
    setFilteredStocks(allStocks);
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredStocks(allStocks);
    } else {
      const filtered = allStocks.filter(stock => 
        stock.name.toLowerCase().includes(searchText.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredStocks(filtered);
    }
  }, [searchText]);

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-44 transition-all duration-300">
        <TopSearchBar />

        <main className={`flex-1 p-4 md:p-6 overflow-auto ${textColor}`}>
          <div className="container mx-auto flex flex-col gap-4">
            
            
              
              {/* Page Header */}
              <DashboardHeader PageTitle = "V40 Stocks" Message = "Comprehensive view of the V40 stock portfolio" />

            
            

            {/* Market Indices Section */}
            <div className={`rounded-xl shadow-sm pt-2 pb-6`}>
              <h2 className="text-xl font-semibold mb-4 px-4">Market Indices</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {marketIndices.map((index, i) => (
                  
                    <StockDisplay key = {i} stockName={index} />
                 
                ))}

              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 gap-6">
              {/* Stocks Table Section */}
              <div className={`rounded-xl shadow-sm overflow-hidden border ${borderColor} ${cardBg}`}>
                <div className="p-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">V40 Stocks List</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${mutedTextColor}`} />
                      <input
                        type="text"
                        placeholder="Search stocks..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className={`pl-10 pr-4 py-2 rounded-lg ${cardSecondaryBg} ${textColor} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                   
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${tableHeaderBg}`}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Symbol</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Change</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredStocks.length > 0 ? (
                        filteredStocks.map((stock, index) => {
                          
                          const isPositive = stocks[stock.name] ? stocks[stock.name].price > stocks[stock.name].previousClosingPrice : "NA";

                          return (
                            <tr key={index} className={`${tableRowHover} transition-colors`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-300 font-medium">
                                      {stock.symbol.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium">{stock.name}</div>
                                    <div className={`text-sm ${mutedTextColor}`}>{stock.symbol}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium">{stock.symbol}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {stocks[stock.name]?.price ? `₹${stocks[stock.name]?.price}` : "N/A" }
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                <div className="flex items-center justify-end">
                                  {isPositive ? (
                                    <ArrowUp className="h-4 w-4 mr-1" />
                                  ) : (
                                    <ArrowDown className="h-4 w-4 mr-1" />
                                  )}
                                  {stocks[stock.name] ? stocks[stock.name]?.percentageChange : "NA"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    className={`p-2 rounded-lg ${cardSecondaryBg} ${hoverBgColor} text-blue-600 dark:text-blue-400`}
                                    title="Add to watchlist"
                                  >
                                    <Star className="h-4 w-4" />
                                  </button>
                                  <button
                                    className={`p-2 rounded-lg ${cardSecondaryBg} ${hoverBgColor} text-green-600 dark:text-green-400`}
                                    title="View details"
                                    onClick={()=> navigate (`/user/stock/${stock.name}`)}
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center">
                            No stocks found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table footer with pagination */}
                <div className={`px-6 py-3 flex items-center justify-between border-t ${tableBorder}`}>
                  <div className={`text-sm ${mutedTextColor}`}>
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredStocks.length}</span> of <span className="font-medium">{allStocks.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      disabled
                      className={`px-3 py-1 rounded-md ${cardSecondaryBg} ${mutedTextColor} cursor-not-allowed`}
                    >
                      Previous
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md ${cardSecondaryBg} ${hoverBgColor} font-medium`}
                    >
                      1
                    </button>
                    <button
                      disabled
                      className={`px-3 py-1 rounded-md ${cardSecondaryBg} ${mutedTextColor} cursor-not-allowed`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default V40Stocks;