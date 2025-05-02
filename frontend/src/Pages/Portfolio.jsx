import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import useStockStore from "../store/stockStore";
import themeStore from "../store/themeStore";
import useUserStore from "../store/userStore";
import DashboardHeader from "../components/DashboardHeader";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import { useNavigate } from "react-router";

const Portfolio = () => {
  const { theme } = themeStore((state) => state);
  const { stocks } = useStockStore((state) => state);
  const {
    holdings,
    totalInvestment,
    getUserHoldings,
    holdingsLoading,
    holdingsError,
  } = useUserStore();

  // Portfolio metrics
  const [currentAmount, setCurrentAmount] = useState(0);
  const [totalProfitPercentage, setTotalProfitPercentage] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  const navigate = useNavigate();

  // Generate random colors for stocks
  const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2", "#073B4C", "#EF476F", "#FFC43D"];
  const getRandomColor = (index) => colors[index % colors.length];

  // Fetch holdings when component mounts
  useEffect(() => {
    getUserHoldings();
  }, [getUserHoldings]);

  // Calculate portfolio metrics whenever stocks or holdings change
  useEffect(() => {
    if (holdings.length > 0 && Object.keys(stocks).length > 0) {
      let totalCurrentValue = 0;
      
      holdings.forEach(stock => {
        if (stocks[stock.stock_name]) {
          totalCurrentValue += stocks[stock.stock_name].price * stock.quantity;
        }
      });

      const profit = totalCurrentValue - totalInvestment;
      const profitPercentage = (profit / totalInvestment) * 100;

      setCurrentAmount(totalCurrentValue);
      setTotalProfit(profit);
      setTotalProfitPercentage(profitPercentage);
    }
  }, [holdings, stocks, totalInvestment]);

  // Theme classes
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardSecondaryBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  if (holdingsLoading) {
    return (
      <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
        <Sidebar />
        <div className="flex flex-col flex-1 md:ml-20 transition-all duration-300">
          <TopSearchBar />
          <main className={`flex-1 md:ml-44 min-h-screen ${textColor} flex items-center justify-center`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </main>
        </div>
      </div>
    );
  }

  if (holdingsError) {
    return (
      <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
        <Sidebar />
        <div className="flex flex-col flex-1 md:ml-20 transition-all duration-300">
          <TopSearchBar />
          <main className={`flex-1 md:ml-44 min-h-screen ${textColor} flex items-center justify-center`}>
            <div className={`p-6 rounded-lg ${cardBg} shadow-lg`}>
              <p className="text-red-500">{holdingsError}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-20 transition-all duration-300">
        <TopSearchBar />

        <main className={`flex-1 md:ml-44 ${textColor} overflow-y-auto pb-20`}>
          <div className="container mx-auto p-4 md:p-6">
            
            {/* Page Header */}
            <DashboardHeader PageTitle = "My Portfolio" Message = "Track and manage your investment portfolio" />

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
                        <p className={`text-sm ${secondaryTextColor}`}>Investment Amount</p>
                        <h3 className="text-2xl font-bold mt-1">₹ {totalInvestment.toLocaleString()}</h3>
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
                        <p className={`text-sm ${secondaryTextColor}`}>Current Amount</p>
                        <h3
                          className={`text-2xl font-bold mt-1 ${currentAmount >= totalInvestment ? "text-emerald-500" : "text-red-500"}`}
                        >
                          ₹{currentAmount.toLocaleString()}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-lg ${cardBg}`}>
                        <LineChart
                          size={20}
                          className={currentAmount >= totalInvestment ? "text-emerald-500" : "text-red-500"}
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
                          {totalProfit >= 0 ? "+" : ""}₹{Math.abs(totalProfit).toLocaleString()}
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

            {/* Portfolio Holdings */}
            {holdings.length === 0 ? (
              <div className={`rounded-xl p-8 text-center ${cardBg}`}>
                <p className={secondaryTextColor}>No holdings found. Start by adding some investments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:gap-4 pb-6">
                {holdings.map((stock, index) => {
                  if (!stocks[stock.stock_name]) return null;
                  
                  const currentValue = stocks[stock.stock_name].price * stock.quantity;
                  const investedValue = stock.average_price * stock.quantity;
                  const profit = currentValue - investedValue;
                  const profitPercentage = (profit / investedValue) * 100;
                  const allocationPercentage = (investedValue / totalInvestment) * 100;

                  return (
                    <div
                      key={stock.id || index}
                      className={`rounded-xl overflow-hidden ${cardBg} shadow-md transition-all ${hoverBg}`}
                    >
                      <div className="p-4 md:p-5" onClick={()=> navigate(`/user/stock/${stock.stock_name}`)}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: getRandomColor(index) }}
                            >
                              <span className="text-white font-bold">{stock.stock_name.substring(0, 1)}</span>
                            </div>
                            <div>
                              <h3 className="font-medium">{stock.stock_name}</h3>
                              <p className={`text-sm ${secondaryTextColor}`}>{stock.exchange || "NSE"}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-3">
                            <div className="min-w-[100px]">
                              <p className={`text-xs ${secondaryTextColor}`}>Current Price</p>
                              <div className="flex items-center gap-1 md:gap-2">
                                <p className="font-medium">₹ {stocks[stock.stock_name].price.toFixed(2)}</p>
                                <span
                                  className={`text-xs px-1 py-0.5 rounded ${
                                    stocks[stock.stock_name].percentageChange >= 0
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : "bg-red-500/10 text-red-500"
                                  }`}
                                >
                                  {stocks[stock.stock_name].percentageChange >= 0 ? "+" : ""}
                                  {stocks[stock.stock_name].percentageChange.toFixed(2)}%
                                </span>
                              </div>
                            </div>

                            <div className="min-w-[80px]">
                              <p className={`text-xs ${secondaryTextColor}`}>Quantity</p>
                              <p className="font-medium">{stock.quantity}</p>
                            </div>

                            <div className="min-w-[80px]">
                              <p className={`text-xs ${secondaryTextColor}`}>Avg. Cost</p>
                              <p className="font-medium">₹{stock.average_price.toFixed(2)}</p>
                            </div>

                            <div className="min-w-[80px]">
                              <p className={`text-xs ${secondaryTextColor}`}>Invested</p>
                              <p className="font-medium">₹ {investedValue.toFixed(2)}</p>
                            </div>

                            <div className="min-w-[120px]">
                              <p className={`text-xs ${secondaryTextColor}`}>Profit/Loss</p>
                              <p className={`font-medium ${profit >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {profit >= 0 ? "+" : ""}₹{Math.abs(profit).toFixed(2)}
                                <span className="text-xs ml-1">
                                  ({profit >= 0 ? "+" : ""}{profitPercentage.toFixed(2)}%)
                                </span>
                              </p>
                            </div>

                            <div className="min-w-[80px]">
                              <p className={`text-xs ${secondaryTextColor}`}>Allocation</p>
                              <p className="font-medium">
                                {allocationPercentage.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-1" style={{ backgroundColor: getRandomColor(index) }}></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;


