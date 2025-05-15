import { React, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import useStockStore from "../store/stockStore.js";
import DashboardHeader from "../components/DashboardHeader";
import { useNavigate } from "react-router";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Search,
  Star,

} from "lucide-react";
import StockDisplay from "../components/StockDisplay.jsx";

const V40NextStocks = () => {

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
    { name: "Sun TV Network", symbol: "SUNTV", price: "₹547.20" , change: "+1.2%" },
    { name: "Radico Khaitan", symbol: "RADICO", price: "₹1,144.35" , change: "+1.2%"},
    { name: "United Spirits", symbol: "UNITEDSPIRITS", price: "₹865.40" , change: "+1.2%" },
    { name: "Eicher Motors", symbol: "EICHERMOT", price: "₹3,293.15" , change: "+1.2%"},
    { name: "Bosch", symbol: "BOSCHLTD", price: "₹18,453.50" , change: "+1.2%" },
    { name: "TTK Prestige", symbol: "TTKPRESTIG", price: "₹9,875.00" , change: "+1.2%" },
    { name: "V Guard Industries", symbol: "VGUARD", price: "₹275.45" , change: "+1.2%" },
    { name: "Symphony", symbol: "SYMPHONY", price: "₹1,152.65" , change: "+1.2%"},
    { name: "Sheela Foam", symbol: "SFL", price: "₹2,980.30" , change: "+1.2%"},
    { name: "Relaxo Footwears", symbol: "RELAXO", price: "₹948.15"  , change: "+1.2%"},
    { name: "Rajesh Exports", symbol: "RAJESHEXPO", price: "₹774.45" , change: "+1.2%"},
    { name: "Polycab India", symbol: "POLYCAB", price: "₹4,026.50" , change: "+1.2%"},
    { name: "Lux Industries", symbol: "LUXIND", price: "₹2,033.75" , change: "+1.2%"},
    { name: "Honeywell Automation India", symbol: "HONAUT", price: "₹39,800.00" , change: "+1.2%"},
    { name: "Cera Sanitaryware", symbol: "CERA", price: "₹7,234.80" , change: "+1.2%" },
    { name: "Dixon Technologies", symbol: "DIXON", price: "₹4,123.25" , change: "+1.2%"},
    { name: "Finolex Cables", symbol: "FINCABLES", price: "₹826.15"  , change: "+1.2%"},
    { name: "Godrej Consumer Products", symbol: "GODREJCP", price: "₹995.60"  , change: "+1.2%"},
    { name: "3M India", symbol: "3MINDIA", price: "₹26,734.00"  , change: "+1.2%"},
    { name: "Kansai Nerolac Paints", symbol: "KANSAINER", price: "₹402.50" , change: "+1.2%"},
    { name: "Indigo Paints", symbol: "INDIGOPNTS", price: "₹1,396.00" , change: "+1.2%"},
    { name: "Vinati Organics", symbol: "VINATIORGA", price: "₹1,890.10" , change: "+1.2%"},
    { name: "Caplin Point Laboratories", symbol: "CAPLIPOINT", price: "₹740.25" , change: "+1.2%" },
    { name: "Fine Organic Industries", symbol: "FINEORG", price: "₹5,394.50" , change: "+1.2%"},
    { name: "Dr Lal PathLabs", symbol: "LALPATHLAB", price: "₹2,260.40"  , change: "+1.2%"},
    { name: "Bayer Cropscience", symbol: "BAYERCROP", price: "₹4,800.20"  , change: "+1.2%"},
    { name: "Astrazeneca Pharma India", symbol: "ASTRAZEN", price: "₹3,300.75" , change: "+1.2%"},
    { name: "SIS", symbol: "SIS", price: "₹417.20"  , change: "+1.2%"},
    { name: "TeamLease Services", symbol: "TEAMLEASE", price: "₹2,473.00"  , change: "+1.2%"},
    { name: "Tata Elxsi", symbol: "TATAELXSI", price: "₹7,023.10"  , change: "+1.2%"},
    { name: "Oracle Financial Services Software", symbol: "OFSS", price: "₹3,525.50" , change: "+1.2%"},
    { name: "Multi Commodity Exchange of India", symbol: "MCX", price: "₹1,594.60" , change: "+1.2%"},
  ];

  const marketIndices = [
    { 
      name: "Nifty 50", 
      value: stocks["Nifty 50"]?.price || "N/A", 
      change: stocks["Nifty 50"]?.percentageChange ? 
        `${stocks["Nifty 50"].percentageChange > 0 ? '+' : ''}${stocks["Nifty 50"].percentageChange.toFixed(2)}%` : "N/A", 
      isPositive: stocks["Nifty 50"]?.percentageChange >= 0 
    },
    { 
      name: "Nifty Bank", 
      value: stocks["Nifty Bank"]?.price || "N/A", 
      change: stocks["Nifty Bank"]?.percentageChange ? 
        `${stocks["Nifty Bank"].percentageChange > 0 ? '+' : ''}${stocks["Nifty Bank"].percentageChange.toFixed(2)}%` : "N/A", 
      isPositive: stocks["Nifty Bank"]?.percentageChange >= 0 
    },
    { 
      name: "SENSEX", 
      value: stocks["SENSEX"]?.price || "N/A", 
      change: stocks["SENSEX"]?.percentageChange ? 
        `${stocks["SENSEX"].percentageChange > 0 ? '+' : ''}${stocks["SENSEX"].percentageChange.toFixed(2)}%` : "N/A", 
      isPositive: stocks["SENSEX"]?.percentageChange >= 0 
    },
    { 
      name: "Russell 2000", 
      value: "2,042.51", 
      change: "+0.72%", 
      isPositive: true 
    }
  ];

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
            <DashboardHeader PageTitle = "V40 Next Stocks" Message = "Comprehensive view of the V40 Next stock portfolio" />

            {/* Market Indices Section */}
            <div className={`rounded-xl shadow-sm pt-2 pb-6`}>
              <h2 className="text-xl font-semibold mb-4 px-4">Market Indices</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketIndices.map((index, i) => (
                  <StockDisplay 
                    key={i}
                    stockName={index.name}
                    currentPrice={index.value}
                    change={index.change}
                    isPositive={index.isPositive}
                  />
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
                          const isPositive = stocks[stock.name]?.price > stocks[stock.name]?.previousClosingPrice;
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
                                {stocks[stock.name] ? `₹${stocks[stock.name]?.price}` : "N/A" }
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
                                  {stocks[stock.name]?.percentageChange}
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

export default V40NextStocks;