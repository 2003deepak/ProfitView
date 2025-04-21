import React, { useState,useEffect } from "react";
import { TrendingUp, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import useStockStore from "../store/stockStore";

const V40Stocks = () => {
  const { theme } = themeStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  const { stocks } = useStockStore((state) => state);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isDark = theme === "dark";

  const v40stocks = [
    { name: "Eris Lifesciences", symbol: "ERIS", price: "₹1,266.30" },
    { name: "ICICI Securities", symbol: "ICICISEC", price: "₹796.65" },
    { name: "Angel One", symbol: "ANGELONE", price: "₹2,525.30" },
    { name: "Nippon India ETF Bank BeES", symbol: "BANKBEES", price: "₹498.82" },
    { name: "Nippon India ETF Nifty 50 BeES", symbol: "NIFTYBEES", price: "₹257.91" },
    { name: "Bajaj Finance", symbol: "BAJFINANCE", price: "₹7,291.65" },
    { name: "Bajaj Holdings & Investment", symbol: "BAJAJHLDNG", price: "₹10,797.00" },
    { name: "Bajaj Finserv", symbol: "BAJAJFINSV", price: "₹1,717.00" },
    { name: "ICICI Lombard General Insurance Company", symbol: "ICICIGI", price: "₹1,902.50" },
    { name: "ICICI Prudential Life Insurance Company", symbol: "ICICIPRULI", price: "₹635.55" },
    { name: "HDFC Life Insurance Company", symbol: "HDFCLIFE", price: "₹624.00" },
    { name: "Bajaj Auto", symbol: "BAJAJ-AUTO", price: "₹8,468.55" },
    { name: "Akzo Nobel India", symbol: "AKZOINDIA", price: "₹3,812.35" },
    { name: "Berger Paints India", symbol: "BERGEPAINT", price: "₹475.20" },
    { name: "Asian Paints", symbol: "ASIANPAINT", price: "₹2,260.35" },
    { name: "Pfizer", symbol: "PFIZER", price: "₹4,944.50" },
    { name: "Abbott India", symbol: "ABBOTINDIA", price: "₹21,522.50" },
    { name: "GlaxoSmithKline Pharmaceuticals", symbol: "GLAXO", price: "₹1,360.20" },
    { name: "Whirlpool Of India", symbol: "WHIRLPOOL", price: "₹1,710.40" },
    { name: "Havells India", symbol: "HAVELLS", price: "₹1,322.65" },
    { name: "Bata India", symbol: "BATAINDIA", price: "₹1,498.35" },
    { name: "Page Industries", symbol: "PAGEIND", price: "₹38,004.85" },
    { name: "Titan Company", symbol: "TITAN", price: "₹3,186.20" },
    { name: "ITC", symbol: "ITC", price: "₹384.45" },
    { name: "Marico", symbol: "MARICO", price: "₹503.15" },
    { name: "Gillette India", symbol: "GILLETTE", price: "₹6,158.25" },
    { name: "Dabur India", symbol: "DABUR", price: "₹517.65" },
    { name: "Colgate-Palmolive (India)", symbol: "COLPAL", price: "₹1,698.85" },
    { name: "Pidilite Industries", symbol: "PIDILITIND", price: "₹2,462.35" },
    { name: "Procter & Gamble Hygiene & Health Care", symbol: "PGHH", price: "₹12,498.15" },
    { name: "Nestle India", symbol: "NESTLEIND", price: "₹20,415.30" },
    { name: "Hindustan Unilever", symbol: "HINDUNILVR", price: "₹2,642.10" },
    { name: "Infosys", symbol: "INFY", price: "₹1,324.55" },
    { name: "TCS", symbol: "TCS", price: "₹3,255.20" },
    { name: "HCL Technologies", symbol: "HCLTECH", price: "₹1,232.80" },
    { name: "HDFC Bank", symbol: "HDFCBANK", price: "₹1,587.40" },
    { name: "Axis Bank", symbol: "AXISBANK", price: "₹931.25" },
    { name: "ICICI Bank", symbol: "ICICIBANK", price: "₹1,021.85" },
    { name: "Kotak Mahindra Bank", symbol: "KOTAKBANK", price: "₹1,765.35" },
    {name : "JSW Energy" , symbol : "JSW" , price : "Rs 34434"}
  ];


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content - Dynamic margin based on sidebar state */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col overflow-hidden transition-all duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}>
        {/* Top Search Bar - Fixed at top of main content */}
        <div className="sticky top-0 z-10">
          <TopSearchBar />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-8 pt-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              V40 Stocks Dashboard
            </h1>
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border w-full transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
                }`}
              />
            </div>
          </div>

          {/* Stocks Table Section */}
          <div className="p-8">
            <div className={`rounded-2xl shadow-lg overflow-hidden border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm text-left">
                  <thead>
                    <tr className={`${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                      <th className="px-6 py-4 font-semibold">Stock Name</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      {v40stocks.map((data) => (
                        <tr
                          key={data.name}
                          className={`border-t ${
                            isDark ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <td className="px-6 py-4 font-medium whitespace-nowrap">{data.name}</td>
                          <td className={`px-6 py-4 font-medium whitespace-nowrap ${stocks[data.name]?.price > stocks[data.name]?.previousClosingPrice ? "text-green-600" : "text-red-600"}`}>
                            ₹{stocks[data.name]?.price ? `₹${stocks[data.name].price}` : "N/A" }
                          </td>
                         
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-transform transform hover:-translate-y-1">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default V40Stocks;


