import { React, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import WatchlistModal from "../components/WatchlistModal.jsx";
import { Link } from 'react-router-dom';
import PortfolioChart from "../components/PortfolioChart";
import DashboardHeader from "../components/DashboardHeader";
import useStockStore from "../store/stockStore";
import useUserStore from "../store/userStore.js";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit,
  LineChart,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import StockDisplay from "../components/StockDisplay.jsx";

const Dashboard = () => {
  const { theme, setTheme } = themeStore((state) => state);
  const { totalInvestment, portfolioPerformance } = useUserStore((state) => state);

  const [activeTab, setActiveTab] = useState("overview");
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
  const [portfolioValue, setPortfolioValue] = useState(15782.45);
  const [portfolioChange, setPortfolioChange] = useState(342.18);
  const [portfolioChangePercent, setPortfolioChangePercent] = useState(2.22);

  const { stocks } = useStockStore();

  // useEffect(()=>{
  //   console.log(stocks);
  // },[stocks]);

 

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

  const recentActivities = [
    {
      type: "buy",
      symbol: "AAPL",
      quantity: 5,
      price: 178.72,
      date: "2023-06-15T14:30:00Z",
    },
    {
      type: "sell",
      symbol: "MSFT",
      quantity: 2,
      price: 329.37,
      date: "2023-06-14T10:15:00Z",
    },
    {
      type: "dividend",
      symbol: "JNJ",
      amount: 25.5,
      date: "2023-06-10T09:00:00Z",
    },
    {
      type: "deposit",
      amount: 1000,
      date: "2023-06-05T16:45:00Z",
    },
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const createWatchlist = (name) => {
    const newWatchlist = {
      id: watchlists.length + 1,
      name,
      stocks: [],
    };
    setWatchlists([...watchlists, newWatchlist]);
    setActiveWatchlist(newWatchlist.id);
    setShowWatchlistModal(false);
  };

  const updateWatchlistName = (id, newName) => {
    setWatchlists(
      watchlists.map((watchlist) =>
        watchlist.id === id ? { ...watchlist, name: newName } : watchlist
      )
    );
    setEditingWatchlist(null);
  };

  const deleteWatchlist = (id) => {
    if (confirm("Are you sure you want to delete this watchlist?")) {
      setWatchlists(watchlists.filter((watchlist) => watchlist.id !== id));
      if (activeWatchlist === id && watchlists.length > 1) {
        setActiveWatchlist(watchlists[0].id === id ? watchlists[1].id : watchlists[0].id);
      }
    }
  };

  const removeStockFromWatchlist = (watchlistId, stockSymbol) => {
    setWatchlists(
      watchlists.map((watchlist) =>
        watchlist.id === watchlistId
          ? {
              ...watchlist,
              stocks: watchlist.stocks.filter((stock) => stock.symbol !== stockSymbol),
            }
          : watchlist
      )
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardSecondaryBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-44 transition-all duration-300">
        <TopSearchBar />

        <main className={`flex-1 p-4 md:p-6 overflow-auto ${textColor}`}>
          <div className="container mx-auto flex flex-col gap-4">

            <DashboardHeader PageTitle = "Dashboard" Message = "Welcome back, John! Here's what's happening with your portfolio today." />

            {/* Market Indices Section */}
            <div className={`rounded-xl shadow-sm pt-2 pb-6`}>
              <h2 className="text-xl font-semibold mb-4 px-4">Market Indices</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
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

            {/* Main content grid - responsive columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Portfolio summary (2/3 width on large screens) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Portfolio value card */}
                <div className={`${cardBgColor} rounded-xl border ${borderColor} p-6`}>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                    <div>
                      <h2 className={`text-lg font-medium ${mutedTextColor}`}>Portfolio Value</h2>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold">
                          Rs {totalInvestment.toLocaleString("en-US")}
                        </span>
                        <span
                          className={`flex items-center ${
                            portfolioPerformance >= 0 ? "text-green-500" : "text-red-500"
                          } text-lg`}
                        >
                          {portfolioPerformance >= 0 ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          {portfolioPerformance}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button
                        className="px-4 py-2 bg-[#0B72E7] text-white rounded-lg hover:bg-[#0A65CF] transition-colors"
                        onClick={() => alert("Deposit funds")}
                      >
                        Deposit
                      </button>
                      <button
                        className={`px-4 py-2 border ${borderColor} rounded-lg ${hoverBgColor} transition-colors`}
                        onClick={() => alert("Withdraw funds")}
                      >
                        Withdraw
                      </button>
                    </div>

                  </div>

                   {/* Portfolio chart */}
                  <div className="h-[450px]">
                    <PortfolioChart theme={theme} />
                  </div>

                  
                </div>

                {/* Recent activity card */}
                <div className={`${cardBgColor} rounded-xl border ${borderColor} p-6`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Recent Activity</h2>
                    <Link to="/activity" className="text-[#0B72E7] text-sm hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${borderColor} flex items-center`}>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                            activity.type === "buy"
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                              : activity.type === "sell"
                                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                : activity.type === "dividend"
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                          }`}
                        >
                          {activity.type === "buy" || activity.type === "sell" ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : activity.type === "dividend" ? (
                            <LineChart className="h-5 w-5" />
                          ) : (
                            <Plus className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">
                              {activity.type === "buy"
                                ? `Bought ${activity.quantity} ${activity.symbol}`
                                : activity.type === "sell"
                                  ? `Sold ${activity.quantity} ${activity.symbol}`
                                  : activity.type === "dividend"
                                    ? `Dividend from ${activity.symbol}`
                                    : "Deposited funds"}
                            </p>
                            <p className="font-medium">
                              {activity.type === "buy"
                                ? `-$${(activity.quantity * activity.price).toFixed(2)}`
                                : activity.type === "sell"
                                  ? `+$${(activity.quantity * activity.price).toFixed(2)}`
                                  : activity.type === "dividend"
                                    ? `+$${activity.amount.toFixed(2)}`
                                    : `+$${activity.amount.toFixed(2)}`}
                            </p>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className={`text-sm ${mutedTextColor}`}>
                              {formatDate(activity.date)} at {formatTime(activity.date)}
                            </p>
                            {(activity.type === "buy" || activity.type === "sell") && (
                              <p className={`text-sm ${mutedTextColor}`}>${activity.price.toFixed(2)} per share</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - Watchlists (1/3 width on large screens) */}
              <div className="space-y-6">
                {/* Watchlists card */}
                <div className={`${cardBgColor} rounded-xl border ${borderColor} p-6`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Watchlists</h2>
                    <button
                      className="text-[#0B72E7] hover:underline flex items-center text-sm"
                      onClick={() => setShowWatchlistModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New Watchlist
                    </button>
                  </div>

                  {/* Watchlist selector tabs */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {watchlists.map((watchlist) => (
                        <div key={watchlist.id} className="relative group">
                          <button
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              activeWatchlist === watchlist.id
                                ? "bg-[#0B72E7] text-white"
                                : `${borderColor} border hover:bg-gray-200 dark:hover:bg-gray-700`
                            } flex items-center`}
                            onClick={() => setActiveWatchlist(watchlist.id)}
                          >
                            {editingWatchlist === watchlist.id ? (
                              <input
                                type="text"
                                className={`bg-transparent border-none focus:outline-none w-24 ${
                                  activeWatchlist === watchlist.id ? "text-white" : ""
                                }`}
                                value={watchlist.name}
                                onChange={(e) => {
                                  const newName = e.target.value
                                  setWatchlists(
                                    watchlists.map((w) => (w.id === watchlist.id ? { ...w, name: newName } : w)),
                                  )
                                }}
                                onBlur={() => updateWatchlistName(watchlist.id, watchlist.name)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateWatchlistName(watchlist.id, watchlist.name)
                                  }
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              watchlist.name
                            )}
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </button>
                          <div
                            className={`absolute right-0 top-0 hidden group-hover:flex items-center gap-1 ${
                              activeWatchlist === watchlist.id ? "bg-[#0B72E7]" : "bg-gray-200 dark:bg-gray-700"
                            } rounded-md px-1`}
                          >
                            <button
                              className="p-1 hover:bg-black/10 rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingWatchlist(watchlist.id)
                              }}
                            >
                              <Edit className="h-3 w-3 text-white" />
                            </button>
                            <button
                              className="p-1 hover:bg-black/10 rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteWatchlist(watchlist.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active watchlist stocks */}
                  <div className="space-y-3">
                    {watchlists
                      .find((watchlist) => watchlist.id === activeWatchlist)
                      ?.stocks.map((stock) => (
                        <Link
                          to={`/stocks/${stock.symbol}`}
                          key={stock.symbol}
                          className={`block p-3 rounded-lg border ${borderColor} hover:border-[#0B72E7] transition-colors`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{stock.symbol}</h3>
                                <button
                                  className="ml-2 text-yellow-500 hover:text-yellow-600"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    alert(`${stock.symbol} added to favorites`)
                                  }}
                                >
                                  <Star className="h-4 w-4 fill-current" />
                                </button>
                                <button
                                  className="ml-1 text-gray-400 hover:text-gray-500"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    removeStockFromWatchlist(activeWatchlist, stock.symbol)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <p className={`text-sm ${mutedTextColor}`}>{stock.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${stock.price.toFixed(2)}</p>
                              <p
                                className={`text-sm ${
                                  stock.change >= 0 ? "text-green-500" : "text-red-500"
                                } flex items-center justify-end`}
                              >
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

                    {/* Empty watchlist state */}
                    {watchlists.find((watchlist) => watchlist.id === activeWatchlist)?.stocks.length === 0 && (
                      <div className={`p-6 text-center ${mutedTextColor}`}>
                        <p>No stocks in this watchlist yet.</p>
                        <button
                          className="mt-2 text-[#0B72E7] hover:underline"
                          onClick={() => alert("Add stocks to watchlist")}
                        >
                          Add stocks
                        </button>
                      </div>
                    )}

                    {/* Add stock button */}
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

            {/* Create watchlist modal */}
            {showWatchlistModal && (
              <WatchlistModal 
                onClose={() => setShowWatchlistModal(false)} 
                onSave={createWatchlist} 
                theme={theme} 
              />
            )}
          </div>
        </main>
      </div>

    </div>
  );
};

export default Dashboard;