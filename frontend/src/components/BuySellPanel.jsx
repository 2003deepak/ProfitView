import { useState, useEffect, useMemo } from "react";
import { DollarSign, Info } from "lucide-react";
import useStockStore from '../store/stockStore';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import useUserStore from "../store/userStore";
import useOrderStore from "../store/orderStore";
import themeStore from "../store/themeStore";

export default function BuySellPanel({ stockName }) {
  const [activeTab, setActiveTab] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const currentPrice = useStockStore(state => state.stocks[stockName]?.price || 0);
  const theme = themeStore(state => state.theme);
  const holdings = useUserStore(state => state.holdings);
  const balance = useUserStore(state => state.balance);
  const fetchOrders = useOrderStore(state => state.fetchOrders);

  const parsedQuantity = useMemo(() => parseInt(quantity, 10) || 0, [quantity]);
  const parsedLimitPrice = useMemo(() => parseFloat(limitPrice) || 0, [limitPrice]);

  console.log("I am rendering the BuySellPanel component");

  // Theme classes (kept for clarity)
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const primaryColor = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const primaryBorder = theme === "dark" ? "border-blue-400" : "border-blue-500";
  const primaryBg = theme === "dark" ? "bg-blue-600" : "bg-blue-500";
  const secondaryBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

  const currentHoldingQuantity = useMemo(() => {
    if (activeTab !== "sell") return 0;
    return holdings.find(h => h.stock_name === stockName)?.quantity || 0;
  }, [holdings, stockName, activeTab]);

  const totalCost = useMemo(() => {
    return (orderType === "market" ? currentPrice : parsedLimitPrice) * parsedQuantity;
  }, [orderType, currentPrice, parsedLimitPrice, parsedQuantity]);

  const isSubmitDisabled = useMemo(() => {
    if (isSubmitting) return true;
    if (parsedQuantity <= 0 || !Number.isInteger(parsedQuantity)) return true;
    if (orderType === "market" && currentPrice <= 0) return true;

    if (orderType === "limit" && parsedLimitPrice <= 0) return true;

    if (activeTab === "buy") {
      if (isNaN(totalCost) || parseFloat(balance) < totalCost) return true;
    } else {
      if (parsedQuantity > currentHoldingQuantity) return true;
    }

    return false;
  }, [
    parsedQuantity,
    orderType,
    parsedLimitPrice,
    currentPrice,
    balance,
    totalCost,
    activeTab,
    currentHoldingQuantity,
    isSubmitting,
  ]);

  useEffect(() => {
    const data = location.state?.prefilledData;
    if (data) {
      setIsEditMode(true);
      setActiveTab(data.action.toLowerCase());
      setOrderType(data.isMarketOrder ? "market" : "limit");
      setQuantity(data.quantity.toString());
      setOrderId(data.orderId);
      if (!data.isMarketOrder && data.targetPrice) {
        setLimitPrice(data.targetPrice.toString());
      }
    }
  }, [location.state]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setIsSubmitting(true);
    setError("");

    const orderDetails = {
      stockName,
      action: activeTab.toUpperCase(),
      quantity: parsedQuantity,
      targetPrice: orderType === "limit" ? parsedLimitPrice : null,
      isMarketOrder: orderType === "market",
      orderId: isEditMode ? orderId : undefined,
    };

    const url = isEditMode 
      ? "http://localhost:3000/api/user/updateOrder" 
      : "http://localhost:3000/api/user/placeOrder";

    try {
      const res = await axios.post(url, orderDetails, { withCredentials: true });
      if (res.data.status === "success") {
        toast.success(isEditMode ? "Order updated successfully" : "Order placed successfully");

        setQuantity('');
        setLimitPrice('');
        setOrderType("market");
        setActiveTab("buy");
        setIsEditMode(false);
        setOrderId(null);

        fetchOrders();
      } else {
        throw new Error(res.data.message || "Order failed");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Error placing order";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <div className={`${bgColor} rounded-xl border ${borderColor} p-4 md:p-6 sticky top-4 md:top-6`}>
        {/* Buy/Sell tabs */}
        <div className="flex mb-4 md:mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === "buy"
                ? `${primaryColor} border-b-2 ${primaryBorder}`
                : `${mutedTextColor} ${hoverBgColor} border-b border-transparent`
            }`}
            onClick={() => setActiveTab("buy")}
            disabled={isSubmitting}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === "sell"
                ? "text-red-500 border-b-2 border-red-500"
                : `${mutedTextColor} ${hoverBgColor} border-b border-transparent`
            }`}
            onClick={() => setActiveTab("sell")}
            disabled={isSubmitting}
          >
            Sell
          </button>
        </div>

        {/* Order form */}
        <form onSubmit={handleSubmitOrder} className="space-y-3 md:space-y-4">
          {/* Order type */}
          <div>
            <label className={`block mb-1 md:mb-2 text-xs md:text-sm font-medium ${mutedTextColor}`}>
              Order Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 py-1 md:py-2 px-2 md:px-3 text-center text-xs md:text-sm font-medium rounded-lg border transition-colors ${
                  orderType === "market"
                    ? `${primaryBg} text-white border-transparent`
                    : `${secondaryBg} ${borderColor} ${mutedTextColor} hover:border-gray-400`
                }`}
                onClick={() => setOrderType("market")}
                disabled={isSubmitting}
              >
                Market
              </button>
              <button
                type="button"
                className={`flex-1 py-1 md:py-2 px-2 md:px-3 text-center text-xs md:text-sm font-medium rounded-lg border transition-colors ${
                  orderType === "limit"
                    ? `${primaryBg} text-white border-transparent`
                    : `${secondaryBg} ${borderColor} ${mutedTextColor} hover:border-gray-400`
                }`}
                onClick={() => setOrderType("limit")}
                disabled={isSubmitting}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div className="flex justify-between items-center mb-1 md:mb-2">
              <label htmlFor="quantity" className={`text-xs md:text-sm font-medium ${mutedTextColor}`}>
                Quantity
              </label>
              <span className={`text-xs ${mutedTextColor}`}>
                {activeTab === "buy" ? (
                  `Balance: ₹${parseFloat(balance)?.toFixed(2) || '0.00'}`
                ) : (
                  `Available: ${currentHoldingQuantity || 0} shares`
                )}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e)=> setQuantity(e.target.value)}
                min="1"
                className={`block w-full p-2 md:p-3 text-xs md:text-sm rounded-lg ${inputBgColor} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            
            {(parsedQuantity <= 0 && quantity !== '') && (
              <p className="text-red-500 text-xs mt-1">
                Quantity must be a positive integer.
              </p>
            )}
            
            {activeTab === "sell" && parsedQuantity > currentHoldingQuantity && (
              <p className="text-red-500 text-xs mt-1">
                You only own {currentHoldingQuantity || 0} shares.
              </p>
            )}
          </div>

          {/* Limit price */}
          {orderType === "limit" && (
            <div>
              <label htmlFor="limitPrice" className={`block mb-1 md:mb-2 text-xs md:text-sm font-medium ${mutedTextColor}`}>
                Limit Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-3 md:h-4 w-3 md:w-4 text-gray-500" />
                </div>
                <input
                  type="number"
                  id="limitPrice"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className={`block w-full p-2 md:p-3 pl-8 md:pl-10 text-xs md:text-sm rounded-lg ${inputBgColor} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                  step="0.01"
                />
              </div>

              {parsedLimitPrice <= 0 && limitPrice !== '' && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid limit price.
                </p>
              )}
            </div>
          )}

          {/* Market price info */}
          {orderType === "market" && (
            <div className={`flex items-start gap-2 p-2 md:p-3 rounded-lg ${inputBgColor} ${mutedTextColor} text-xs md:text-sm`}>
              <Info className="h-3 md:h-4 w-3 md:w-4 mt-0.5 flex-shrink-0" />
              <div>
                Your order will be executed at the best available price. Current price: ₹
                {currentPrice.toFixed(2)}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          {/* Order summary */}
          <div className={`p-3 md:p-4 rounded-lg ${inputBgColor} space-y-1 md:space-y-2 text-xs md:text-sm`}>
            <div className="flex justify-between">
              <span className={mutedTextColor}>Estimated {activeTab === "buy" ? "cost" : "credit"}</span>
              <span className="font-medium">
                {(totalCost > 0 && !isNaN(totalCost) ? `₹${totalCost.toFixed(2)}` : '0')}
              </span>
            </div>
            {activeTab === "buy" && (
              <div className="flex justify-between">
                <span className={mutedTextColor}>Available Balance</span>
                <span className="font-medium">₹{parseFloat(balance)?.toFixed(2) || '0.00'}</span>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitDisabled || isSubmitting}
            className={`w-full py-2 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base transition-colors ${
              activeTab === "buy"
                ? `bg-green-500 text-white hover:bg-green-600`
                : `bg-red-500 text-white hover:bg-red-600`
            } ${(isSubmitDisabled || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting 
              ? "Processing..." 
              : `${isEditMode ? 'Update' : activeTab === "buy" ? "Buy" : "Sell"} ${stockName}`}
          </button>
        </form>

        <ToastContainer position="top-right" />
      </div>
    </>
  );
}