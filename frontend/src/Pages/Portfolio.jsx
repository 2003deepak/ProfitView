import { React, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronRight,
  Clock,
  Compass,
  Home,
  LineChart,
  Menu,
  Moon,
  PieChart,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";

const Portfolio = () => {
  const { theme } = themeStore((state) => state);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState("");

  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const portfolioData = [
    {
      id: 1,
      name: "Tesla Inc.",
      symbol: "TSLA",
      allocation: 28,
      price: 214.55,
      change: 2.73,
      value: 6436.5,
      profit: 2552.7,
      profitPercentage: 65.73,
      color: "#FF6B6B",
    },
    {
      id: 2,
      name: "Apple Inc.",
      symbol: "AAPL",
      allocation: 42,
      price: 188.5,
      change: 0.66,
      value: 12950.0,
      profit: 1141.0,
      profitPercentage: 9.66,
      color: "#4ECDC4",
    },
    {
      id: 3,
      name: "Microsoft Corp.",
      symbol: "MSFT",
      allocation: 23,
      price: 387.8,
      change: -1.84,
      value: 7175.6,
      profit: -134.4,
      profitPercentage: -1.84,
      color: "#FFD166",
    },
    {
      id: 4,
      name: "Amazon.com Inc.",
      symbol: "AMZN",
      allocation: 7,
      price: 178.25,
      change: 1.21,
      value: 2245.0,
      profit: 345.2,
      profitPercentage: 18.16,
      color: "#06D6A0",
    },
  ];

  const totalValue = portfolioData.reduce((sum, stock) => sum + stock.value, 0);
  const totalProfit = portfolioData.reduce((sum, stock) => sum + stock.profit, 0);
  const totalProfitPercentage = (totalProfit / (totalValue - totalProfit)) * 100;

  // Theme classes
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardSecondaryBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-20 transition-all duration-300">
        <TopSearchBar />

        <main className={`flex-1 md:ml-44 min-h-screen ${textColor}`}>
          <div className="container mx-auto p-4 md:p-6">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl font-bold">My Portfolio</h1>
              <p className={secondaryTextColor}>Track and manage your investment portfolio</p>
            </div>

            {/* Portfolio Summary */}
            <div className={`rounded-xl overflow-hidden mb-6 md:mb-8 ${cardBg} shadow-lg`}>
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Portfolio Overview</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Total Value Card */}
                  <div className={`p-4 md:p-5 rounded-xl ${cardSecondaryBg}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${secondaryTextColor}`}>Total Value</p>
                        <h3 className="text-2xl font-bold mt-1">₹{totalValue.toLocaleString()}</h3>
                      </div>
                      <div className={`p-2 rounded-lg ${cardBg}`}>
                        <PieChart size={20} className="text-emerald-500" />
                      </div>
                    </div>
                    <div className={`mt-4 pt-4 border-t border-dashed ${borderColor}`}>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm ${totalProfitPercentage >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {totalProfitPercentage >= 0 ? (
                            <ArrowUp size={14} className="inline mr-1" />
                          ) : (
                            <ArrowDown size={14} className="inline mr-1" />
                          )}
                          {Math.abs(totalProfitPercentage).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Value Card */}
                  <div className={`p-4 md:p-5 rounded-xl ${cardSecondaryBg}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${secondaryTextColor}`}>Current Value</p>
                        <h3
                          className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? "text-emerald-500" : "text-red-500"}`}
                        >
                          {totalProfit >= 0 ? "+" : ""}₹{totalProfit.toLocaleString()}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-lg ${cardBg}`}>
                        <LineChart
                          size={20}
                          className={totalProfit >= 0 ? "text-emerald-500" : "text-red-500"}
                        />
                      </div>
                    </div>
                    <div className={`mt-4 pt-4 border-t border-dashed ${borderColor}`}>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm ${totalProfitPercentage >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {totalProfitPercentage >= 0 ? "+" : ""}₹{Math.abs(totalProfit).toLocaleString()} (
                          {Math.abs(totalProfitPercentage).toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profit/Loss Card */}
                  <div className={`p-4 md:p-5 rounded-xl ${cardSecondaryBg}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${secondaryTextColor}`}>Total Profit/Loss</p>
                        <h3
                          className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? "text-emerald-500" : "text-red-500"}`}
                        >
                          {totalProfit >= 0 ? "+" : ""}₹{totalProfit.toLocaleString()}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-lg ${cardBg}`}>
                        <BarChart3
                          size={20}
                          className={totalProfit >= 0 ? "text-emerald-500" : "text-red-500"}
                        />
                      </div>
                    </div>
                    <div className={`mt-4 pt-4 border-t border-dashed ${borderColor}`}>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm ${totalProfitPercentage >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {totalProfitPercentage >= 0 ? "+" : ""}₹{Math.abs(totalProfit).toLocaleString()} (
                          {Math.abs(totalProfitPercentage).toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Tabs */}
            <div className="mb-4 md:mb-6 overflow-x-auto">
              <div className={`flex border-b ${borderColor} min-w-max`}>
                <button
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "overview"
                      ? theme === "dark"
                        ? "text-white border-b-2 border-emerald-500"
                        : "text-gray-900 border-b-2 border-emerald-600"
                      : secondaryTextColor
                  } ${hoverBg}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "holdings"
                      ? theme === "dark"
                        ? "text-white border-b-2 border-emerald-500"
                        : "text-gray-900 border-b-2 border-emerald-600"
                      : secondaryTextColor
                  } ${hoverBg}`}
                  onClick={() => setActiveTab("holdings")}
                >
                  Holdings
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "transactions"
                      ? theme === "dark"
                        ? "text-white border-b-2 border-emerald-500"
                        : "text-gray-900 border-b-2 border-emerald-600"
                      : secondaryTextColor
                  } ${hoverBg}`}
                  onClick={() => setActiveTab("transactions")}
                >
                  Transactions
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "performance"
                      ? theme === "dark"
                        ? "text-white border-b-2 border-emerald-500"
                        : "text-gray-900 border-b-2 border-emerald-600"
                      : secondaryTextColor
                  } ${hoverBg}`}
                  onClick={() => setActiveTab("performance")}
                >
                  Performance
                </button>
              </div>
            </div>

            {/* Portfolio Holdings */}
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {portfolioData.map((stock) => (
                <div
                  key={stock.id}
                  className={`rounded-xl overflow-hidden ${cardBg} shadow-md transition-all ${hoverBg}`}
                >
                  <div className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: stock.color }}
                        >
                          <span className="text-white font-bold">{stock.symbol.substring(0, 1)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{stock.name}</h3>
                          <p className={`text-sm ${secondaryTextColor}`}>{stock.symbol}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-3">
                        <div className="min-w-[100px]">
                          <p className={`text-xs ${secondaryTextColor}`}>Current Price</p>
                          <div className="flex items-center gap-1 md:gap-2">
                            <p className="font-medium">₹{stock.price.toLocaleString()}</p>
                            <span
                              className={`text-xs px-1 py-0.5 rounded ${
                                stock.change >= 0
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {stock.change >= 0 ? "+" : ""}
                              {stock.change}%
                            </span>
                          </div>
                        </div>

                        <div className="min-w-[80px]">
                          <p className={`text-xs ${secondaryTextColor}`}>Value</p>
                          <p className="font-medium">₹{stock.value.toLocaleString()}</p>
                        </div>

                        <div className="min-w-[120px]">
                          <p className={`text-xs ${secondaryTextColor}`}>Profit/Loss</p>
                          <p className={`font-medium ${stock.profit >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {stock.profit >= 0 ? "+" : ""}₹{stock.profit.toLocaleString()}
                            <span className="text-xs ml-1">
                              ({stock.profit >= 0 ? "+" : ""}
                              {stock.profitPercentage.toFixed(2)}%)
                            </span>
                          </p>
                        </div>

                        <div className="min-w-[80px]">
                          <p className={`text-xs ${secondaryTextColor}`}>Allocation</p>
                          <p className="font-medium">{stock.allocation}%</p>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="h-1" style={{ backgroundColor: stock.color }}></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;