import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import useUserStore from "../store/userStore";
import DashboardHeader from "../components/DashboardHeader";
import { ArrowDown, ArrowUp, Clock, CheckCircle2, AlertCircle, ShoppingCart, CalendarClock , Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import useOrderStore from "../store/orderStore";
import useStockStore from "../store/stockStore";
import {toast} from "react-toastify";
import axios from "axios";

const Order = () => {
  const { theme } = themeStore((state) => state);
  const [activeTab, setActiveTab] = useState("open");
  const navigate = useNavigate();
  const { stocks } = useStockStore();
  const { fetchUserData, getUserHoldings } = useUserStore();



  // Get data and methods from order store
  const {
    orders: { executedOrders, openOrders, todaysOrders },
    loading,
    fetchOrders // Assuming you have a fetchOrders action in your store
  } = useOrderStore();

  // Format data to match your existing UI structure
  const formatOrderData = (orders) => {
    if (!orders || orders.length === 0) return [];
    
    return orders.map((order) => ({
      id: order._id,
      stock_name: order.stockName,
      type: order.action,
      quantity: order.quantity,
      targetPrice: order.targetPrice,
      status: order.status === "CLOSED" ? "COMPLETED" : order.status,
      timestamp: new Date(order.orderDate),
      total: (order.executedPrice || order.targetPrice) * order.quantity,
      executedPrice: order.executedPrice,
    }));
  };

  // State for formatted orders
  const [formattedOpenOrders, setFormattedOpenOrders] = useState([]);
  const [formattedExecutedOrders, setFormattedExecutedOrders] = useState([]);
  const [formattedTodaysOrders, setFormattedTodaysOrders] = useState([]);

  // Effect to format orders when they change
  useEffect(() => {
    setFormattedOpenOrders(formatOrderData(openOrders));
    setFormattedExecutedOrders(formatOrderData(executedOrders));
    setFormattedTodaysOrders(formatOrderData(todaysOrders));
  }, [openOrders, executedOrders, todaysOrders]);


  // Filter orders based on active tab
  const getFilteredOrders = () => {
    switch (activeTab) {
      case "open":
        return formattedOpenOrders;
      case "executed":
        return formattedExecutedOrders;
      case "today":
        return formattedTodaysOrders;
      default:
        return [];
    }
  };

  const filteredOrders = getFilteredOrders();

  // Theme classes
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardSecondaryBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const tabActiveBg = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-500";
      case "OPEN":
        return "text-amber-500";
      case "PENDING":
        return "text-amber-500";
      case "FAILED":
        return "text-red-500";
      default:
        return secondaryTextColor;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "PENDING":
        return <Clock size={16} className="text-amber-500" />;
      case "OPEN":
        return <CalendarClock size={16} className="text-blue-500" />;
      case "FAILED":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  // Order type colors
  const getOrderTypeColor = (type) => {
    return type === "BUY" ? "text-emerald-500" : "text-red-500";
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  // Order metrics - will be 0 if no orders
  const openOrdersCount = openOrders?.length || 0;
  const executedOrdersCount = executedOrders?.length || 0;
  const todaysOrdersCount = todaysOrders?.length || 0;


   // Handle edit order
   const handleEditOrder = (order) => {
    navigate(`/user/stock/${order.stock_name}`, {
      state: {
        prefilledData: {
          action: order.type.toLowerCase(),
          quantity: order.quantity,
          targetPrice: order.targetPrice,
          isMarketOrder: order.isMarketOrder,
          orderId : order._id
        }
      }
    });
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/order/deleteOrder`,
        {orderId},
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        // toast.success("Order deleted successfully");
        fetchOrders();
        fetchUserData();
        getUserHoldings();

      } else {
        toast.error(response.data.message || "Failed to delete order");
      }
    } catch (error) {
      toast.error( "An error occurred while deleting the order" + error);
    }
  };

  if (loading) {
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


  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-20 transition-all duration-300">
        <TopSearchBar />

        <main className={`flex-1 md:ml-44 ${textColor} overflow-y-auto pb-20`}>
          <div className="container mx-auto p-4 md:p-6">
            {/* Page Header */}
            <DashboardHeader PageTitle="My Orders" Message="Track and manage your stock orders" />

            {/* Orders Summary - Always shown even with no orders */}
            <div className={`rounded-xl overflow-hidden mb-6 md:mb-8 ${cardBg} shadow-lg`}>
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Orders Overview</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Open Orders Card */}
                  <div className={`p-4 md:p-5 rounded-xl ${cardSecondaryBg}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${secondaryTextColor}`}>Open Orders</p>
                        <h3 className="text-2xl font-bold mt-1 text-blue-500">{openOrdersCount}</h3>
                      </div>
                      <div className={`p-2 rounded-lg ${cardBg}`}>
                        <CalendarClock size={20} className="text-blue-500" />
                      </div>
                    </div>
                    <div className={`mt-4 pt-4 border-t border-dashed ${borderColor}`}>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          {openOrdersCount === 0 ? "No open orders" : "Currently active orders"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Executed Orders Card */}
                  <div className={`p-4 md:p-5 rounded-xl ${cardSecondaryBg}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${secondaryTextColor}`}>Executed Orders</p>
                        <h3 className="text-2xl font-bold mt-1 text-emerald-500">{executedOrdersCount}</h3>
                      </div>
                      <div className={`p-2 rounded-lg ${cardBg}`}>
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      </div>
                    </div>
                    <div className={`mt-4 pt-4 border-t border-dashed ${borderColor}`}>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          {executedOrdersCount === 0 ? "No executed orders" : "Completed transactions"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Today's Orders Card */}
                  <div className={`p-4 md:p-5 rounded-xl ${cardSecondaryBg}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${secondaryTextColor}`}>Today's Orders</p>
                        <h3 className="text-2xl font-bold mt-1 text-amber-500">{todaysOrdersCount}</h3>
                      </div>
                      <div className={`p-2 rounded-lg ${cardBg}`}>
                        <ShoppingCart size={20} className="text-amber-500" />
                      </div>
                    </div>
                    <div className={`mt-4 pt-4 border-t border-dashed ${borderColor}`}>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          {todaysOrdersCount === 0 
                            ? "No orders today" 
                            : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Tabs - Always shown */}
            <div className="flex mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab("open")}
                className={`px-4 py-2 rounded-t-lg mr-2 font-medium transition-colors ${
                  activeTab === "open" ? `${tabActiveBg} ${textColor}` : secondaryTextColor
                }`}
              >
                Open Orders
              </button>
              <button
                onClick={() => setActiveTab("executed")}
                className={`px-4 py-2 rounded-t-lg mr-2 font-medium transition-colors ${
                  activeTab === "executed" ? `${tabActiveBg} ${textColor}` : secondaryTextColor
                }`}
              >
                Executed Orders
              </button>
              <button
                onClick={() => setActiveTab("today")}
                className={`px-4 py-2 rounded-t-lg mr-2 font-medium transition-colors ${
                  activeTab === "today" ? `${tabActiveBg} ${textColor}` : secondaryTextColor
                }`}
              >
                Today's Orders
              </button>
            </div>

            {/* Orders List - Shows "No orders" message when empty */}
            <div className="grid grid-cols-1 gap-3 md:gap-4 pb-6">
              {filteredOrders.length === 0 ? (
                <div className={`rounded-xl p-8 text-center ${cardBg}`}>
                  <p className={secondaryTextColor}>
                    {activeTab === "open" && "No open orders"}
                    {activeTab === "executed" && "No executed orders"}
                    {activeTab === "today" && "No orders placed today"}
                  </p>
                </div>
              ) : (
                filteredOrders.map((order, index) => {
                
                  return (
                    <div
                      key={order.id || index}
                      className={`rounded-xl overflow-hidden ${cardBg} shadow-md transition-all ${hoverBg} cursor-pointer`}
                      onClick={() => navigate(`/user/stocks/${order.stockName}`)}
                    >
                      <div className="p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                order.type === "BUY" ? "bg-emerald-500/20" : "bg-red-500/20"
                              }`}
                            >
                              <span className={`font-bold ${getOrderTypeColor(order.type)}`}>
                                {order.type === "BUY" ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{order.stock_name}</h3>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    order.type === "BUY"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : "bg-red-500/10 text-red-500"
                                  }`}
                                >
                                  {order.type}
                                </span>
                              </div>
                              <p className={`text-sm ${secondaryTextColor}`}>
                                {formatDate(order.timestamp)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-3">
                            <div className="min-w-[80px]">
                              <p className={`text-xs ${secondaryTextColor}`}>Quantity</p>
                              <p className="font-medium">{order.quantity}</p>
                            </div>

                            {activeTab === "open" ? (
                              <>
                                <div className="min-w-[100px]">
                                  <p className={`text-xs ${secondaryTextColor}`}>Target Price</p>
                                  <p className="font-medium">₹{order.targetPrice}</p>
                                </div>
                                <div className="min-w-[100px]">
                                  <p className={`text-xs ${secondaryTextColor}`}>Current Price</p>
                                  <p className="font-medium">₹{stocks[order.stock_name]?.price || 0}</p>
                                </div>
                                
                              </>
                            ) : (
                              <>
                                <div className="min-w-[100px]">
                                  <p className={`text-xs ${secondaryTextColor}`}>Executed Price</p>
                                  <p className="font-medium">₹{order.executedPrice}</p>
                                </div>
                                <div className="min-w-[100px]">
                                  <p className={`text-xs ${secondaryTextColor}`}>Total</p>
                                  <p className="font-medium">₹{order.total}</p>
                                </div>
                              </>
                            )}


                             {/* Edit and Delete buttons (only for open orders) */}
                          {activeTab === "open" && (
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditOrder(order);
                                }}
                                className={`p-2 rounded-lg ${hoverBg} text-blue-500`}
                                title="Edit order"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrder(order.id);
                                }}
                                className={`p-2 rounded-lg ${hoverBg} text-red-500`}
                                title="Delete order"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}

                            <div className="min-w-[100px]">
                              <p className={`text-xs ${secondaryTextColor}`}>Status</p>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                <p className={`font-medium ${getStatusColor(order.status)}`}>{order.status}</p>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                      <div
                        className="h-1"
                        style={{
                          backgroundColor: order.type === "BUY" ? "#10b981" : "#ef4444",
                        }}
                      ></div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Order;