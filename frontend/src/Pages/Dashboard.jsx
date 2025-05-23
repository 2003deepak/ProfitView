import { React, useState, Suspense, lazy } from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Edit,
  Plus,
  Trash2,
  Star,
  TrendingUp,
  LineChart
} from "lucide-react";

import useUserStore from "../store/userStore.js";

// Lazy loaded components
const WatchlistModal = lazy(() => import("../components/WatchlistModal.jsx"));
const PortfolioChart = lazy(() => import("../components/PortfolioChart"));
const DashboardHeader = lazy(() => import("../components/DashboardHeader"));
const StockDisplay = lazy(() => import("../components/StockDisplay.jsx"));

const Dashboard = () => {
  const { theme } = themeStore((state) => state);
  const { totalInvestment, portfolioPerformance } = useUserStore((state) => state);

  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [watchlists, setWatchlists] = useState([
    {
      id: 1,
      name: "My Watchlist",
      stocks: [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 178.72,
          change: 2.35,
          changePercent: 1.33,
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corporation",
          price: 329.37,
          change: -1.25,
          changePercent: -0.38,
        },
        {
          symbol: "TSLA",
          name: "Tesla, Inc.",
          price: 215.49,
          change: 7.82,
          changePercent: 3.76,
        },
      ],
    },
    {
      id: 2,
      name: "Tech Giants",
      stocks: [
        {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          price: 142.65,
          change: 0.87,
          changePercent: 0.61,
        },
        {
          symbol: "AMZN",
          name: "Amazon.com, Inc.",
          price: 178.15,
          change: 3.22,
          changePercent: 1.84,
        },
        {
          symbol: "META",
          name: "Meta Platforms, Inc.",
          price: 472.22,
          change: -1.98,
          changePercent: -0.42,
        },
      ],
    },
  ]);
  const [activeWatchlist, setActiveWatchlist] = useState(1);
  const [editingWatchlist, setEditingWatchlist] = useState(null);
  const marketIndices = ["Nifty 50", "Nifty Bank", "SENSEX"];


   // Theme colors

  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-slate-100";
  const textColor = theme === "dark" ? "text-gray-100" : "text-slate-900";
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-slate-300";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-slate-600";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-slate-200";



  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-44 transition-all duration-300">
        <TopSearchBar />
        <main className={`flex-1 p-4 md:p-6 overflow-auto ${textColor}`}>
          <div className="container mx-auto flex flex-col gap-4">
            
              <DashboardHeader 
                PageTitle="Dashboard" 
                Message="Welcome back, John! Here's what's happening with your portfolio today." 
              />
            

            {/* Market Indices Section */}
            <div className={`rounded-xl shadow-sm pt-2 pb-6`}>
              <h2 className="text-xl font-semibold mb-4 px-4">Market Indices</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketIndices.map((index, i) => (
                  
                    <StockDisplay key = {i} stockName={index} />
                 
                ))}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Portfolio Value Card */}
                <div className={`${cardBgColor} rounded-xl border ${borderColor} p-6`}>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                    <div>
                      <h2 className={`text-lg font-medium ${mutedTextColor}`}>Portfolio Value</h2>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold">
                          Rs {totalInvestment.toLocaleString("en-US")}
                        </span>
                        <span className={`flex items-center ${
                          portfolioPerformance >= 0 ? "text-green-500" : "text-red-500"
                        } text-lg`}>
                          {portfolioPerformance >= 0 ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          {portfolioPerformance}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Deposit
                      </button>
                      <button className={`px-4 py-2 border ${borderColor} rounded-lg ${hoverBgColor} transition-colors`}>
                        Withdraw
                      </button>
                    </div>
                  </div>

                  
                  <PortfolioChart theme={theme} />
                  
                </div>

               
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Watchlists Card */}
                <div className={`${cardBgColor} rounded-xl border ${borderColor} p-6`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Watchlists</h2>
                    <button
                      className="text-blue-600 hover:underline flex items-center text-sm"
                      onClick={() => setShowWatchlistModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New Watchlist
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {watchlists.map((watchlist) => (
                        <div key={watchlist.id} className="relative group">
                          <button
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              activeWatchlist === watchlist.id
                                ? "bg-blue-600 text-white"
                                : `${borderColor} border hover:bg-gray-200 dark:hover:bg-gray-700`
                            } flex items-center`}
                            onClick={() => setActiveWatchlist(watchlist.id)}
                          >
                            {watchlist.name}
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {watchlists
                      .find((watchlist) => watchlist.id === activeWatchlist)
                      ?.stocks.map((stock) => (
                        <Link
                          to={`/stocks/${stock.symbol}`}
                          key={stock.symbol}
                          className={`block p-3 rounded-lg border ${borderColor} hover:border-blue-600 transition-colors`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{stock.symbol}</h3>
                                <Star className="h-4 w-4 ml-2 text-yellow-500 hover:text-yellow-600" />
                                <Trash2 className="h-4 w-4 ml-1 text-gray-400 hover:text-gray-500" />
                              </div>
                              <p className={`text-sm ${mutedTextColor}`}>{stock.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${stock.price.toFixed(2)}</p>
                              <p className={`text-sm ${
                                stock.change >= 0 ? "text-green-500" : "text-red-500"
                              } flex items-center justify-end`}>
                                {stock.change >= 0 ? (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                {stock.changePercent.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}

                    <button
                      className={`w-full p-3 rounded-lg border ${borderColor} flex items-center justify-center ${hoverBgColor} transition-colors`}
                      onClick={() => alert("Add stocks to watchlist")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Watchlist Modal */}
            {showWatchlistModal && (
              <Suspense fallback={<div>Loading modal...</div>}>
                <WatchlistModal 
                  onClose={() => setShowWatchlistModal(false)} 
                  onSave={(name) => {
                    const newWatchlist = {
                      id: watchlists.length + 1,
                      name,
                      stocks: [],
                    };
                    setWatchlists([...watchlists, newWatchlist]);
                    setActiveWatchlist(newWatchlist.id);
                    setShowWatchlistModal(false);
                  }} 
                  theme={theme} 
                />
              </Suspense>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;