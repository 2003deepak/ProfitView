import { useState, useEffect } from "react";
import { DollarSign, Info } from "lucide-react";
import useStockStore from '../store/stockStore';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import useUserStore from "../store/userStore";
import useOrderStore from "../store/orderStore"; 


export default function BuySellPanel({ stockName, theme }) {
  const [activeTab, setActiveTab] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(1);
  // Use null/undefined initially for limitPrice input to allow empty state
  const [limitPrice, setLimitPrice] = useState(null); // Changed to null

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CORRECTED AND OPTIMIZED ZUSTAND SELECTION ---
  // Selects the price specifically for the stockName passed as a prop
  // This component will ONLY re-render when state.stocks[stockName].price changes
  const currentPrice = useStockStore(state => state.stocks[stockName]?.price || 0);

  // Select necessary user store states and actions
  const holdings = useUserStore(state => state.holdings);
  const balance = useUserStore(state => state.balance);
  const fetchUserData = useUserStore(state => state.fetchUserData);
  const getUserHoldings = useUserStore(state => state.getUserHoldings);

  console.log("i am called");

  // Select necessary order store action
  const fetchOrders = useOrderStore(state => state.fetchOrders); // Assuming this action exists

  // Select the orderExecuted state from the stock store to trigger toast
  const orderExecuted = useStockStore(state => state.orderExecuted);
  const setOrderExecuted = useStockStore(state => state.setOrderExecuted); // Action to clear the state

  const [error, setError] = useState("");
  const [currentHoldingQuantity, setCurrentHoldingQuantity] = useState(0);
  // Confirmation state can potentially be replaced by toast messages

  const navigate = useNavigate();

  // Theme classes (kept for clarity)
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const primaryColor = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const primaryBorder = theme === "dark" ? "border-blue-400" : "border-blue-500";
  const primaryBg = theme === "dark" ? "bg-blue-600" : "bg-blue-500";


  // Effect to update holding quantity when tab or holdings change
  useEffect(() => {
    if (activeTab === "sell") {
      getStockQuantity(stockName);
    }
    // Dependencies: stockName (if prop changes), holdings (when user data updates)
  }, [activeTab, stockName, holdings]);


  // Function to get stock quantity from holdings
  const getStockQuantity = (stockName) => {
    // Ensure holdings is an array before filtering/finding
    if (!Array.isArray(holdings)) {
        setCurrentHoldingQuantity(0);
        return;
    }
    // Use find for efficiency when expecting at most one result
    const stock = holdings.find((stock) => stock.stock_name === stockName);
    setCurrentHoldingQuantity(stock ? stock.quantity : 0);
  }

  // --- Effect to show toast when orderExecuted state changes ---
  useEffect(() => {
      if (orderExecuted) {
          const { message, status } = orderExecuted;
          if (status === 'success') {
              toast.success(message || "Order executed successfully!");
          } else {
              toast.error(message || "Order execution failed.");
          }
          // Clear the orderExecuted state after showing the toast
          // This is crucial so the toast doesn't reappear on subsequent re-renders
          setOrderExecuted(null);
      }
  }, [orderExecuted, setOrderExecuted]); // Depend on orderExecuted state and the setter action


  // Calculate total cost (derive directly from state/props)
  // Memoization might be helpful if this calculation were complex, but simple multiplication is fine
  const totalCost = orderType === "market"
    ? (currentPrice * quantity)
    : (parseFloat(limitPrice) || 0) * quantity; // Use parseFloat safely

  // Validate inputs and enable/disable submit button
  useEffect(() => {
    let isValid = true;

    // Basic validation: Quantity must be a positive integer
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      isValid = false;
    }

    // Price must be available for market orders
    if (orderType === "market" && (currentPrice <= 0 || isNaN(currentPrice))) {
        isValid = false;
    }

    // Active tab specific checks
    if (activeTab === "buy") {
      // Check sufficient balance (assuming balance is available)
      // Ensure balance is treated as a number, default to 0 if null/undefined
      const currentBalance = parseFloat(balance) || 0;
      if (currentBalance < totalCost) {
         isValid = false;
      }

      if (orderType === "limit") {
        const parsedLimitPrice = parseFloat(limitPrice);
        // Check minimum limit price for buy (must be >= 90% of current price)
        const minLimitPrice = currentPrice * 0.9;
        if (parsedLimitPrice <= 0 || isNaN(parsedLimitPrice) || parsedLimitPrice < minLimitPrice) {
          isValid = false;
        }
      }
    } else { // activeTab === "sell"
      // Check sufficient holding quantity
      if (quantity > (currentHoldingQuantity || 0)) {
        isValid = false;
      }
       // Check maximum limit price for sell (example: must be <= 110% of current price)
       // Adjust this logic based on your backend/broker rules
      if (orderType === "limit") {
         const parsedLimitPrice = parseFloat(limitPrice);
         const maxLimitPrice = currentPrice * 1.1;
         if (parsedLimitPrice <= 0 || isNaN(parsedLimitPrice) || parsedLimitPrice > maxLimitPrice) {
            isValid = false;
         }
      }
    }

    // Check limit price validity independent of order type (must be positive if orderType is limit)
    if (orderType === "limit") {
         const parsedLimitPrice = parseFloat(limitPrice);
         if (parsedLimitPrice <= 0 || isNaN(parsedLimitPrice)) {
             isValid = false;
         }
    }

    // Disable if currently submitting
    if (isSubmitting) {
        isValid = false;
    }

    setIsSubmitDisabled(!isValid);
  }, [quantity, limitPrice, orderType, activeTab, currentPrice, currentHoldingQuantity, balance, totalCost, isSubmitting]); // Added isSubmitting to dependencies


  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    // Allow empty input but treat as 0 internally for validation/calculation
    setQuantity(isNaN(value) ? '' : value); // Set state to empty string if NaN to clear input
  };

  // Handle limit price change
  const handleLimitPriceChange = (e) => {
    const value = e.target.value; // Get value as string initially
    setLimitPrice(value === '' ? null : parseFloat(value)); // Set state to null for empty, or parsed float
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Double-check disabled state client-side before submitting
    if (isSubmitDisabled || isSubmitting) {
      console.log("Submit is disabled or already submitting.");
      return;
    }

    setError("");
    // setConfirmation(""); // No need for confirmation state if using toasts

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/placeOrder",
        {
          stockName,
          action: activeTab.toUpperCase(),
          quantity: parseInt(quantity, 10) || 0, // Ensure quantity is a number
          targetPrice: orderType === "limit" ? (parseFloat(limitPrice) || 0) : null, // Ensure limitPrice is number or null
          isMarketOrder: orderType === "market"
        },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        // Toast is handled by the useEffect watching orderExecuted state
        // setConfirmation(response.data.message); // Removed

        // Trigger data refresh by calling actions
        fetchOrders();
        fetchUserData();
        getUserHoldings();

        // Reset form state after successful submission
        // setQuantity(1); // Or reset based on UX preference
        // setLimitPrice(null); // Reset limit price input

        // Navigate after a slight delay
        // The orderExecuted toast will appear during this delay
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 1500);

      } else {
        // Toast is handled by the useEffect watching orderExecuted state if backend sends an event
        // If backend does NOT send an orderExecuted event on failure, show error here
        const errorMessage = response.data.message || "Order failed. Please try again.";
        setError(errorMessage); // Still useful to show error below the form
        toast.error("Order submission failed: " + errorMessage); // Explicit error toast for API failure

      }
    } catch (err) {
       const errorMessage = err.response?.data?.message || "An error occurred while placing the order. Please try again.";
       setError(errorMessage); // Show error below the form
       console.error("Order submission error:", err);
       toast.error("Order submission failed: " + errorMessage); // Explicit error toast for network/request errors
    } finally {
      setIsSubmitting(false); // Ensure submitting state is reset
    }
  };

  return (
    <>
      {/*
        Recommendation: Move ToastContainer to the root of your application (e.g., App.jsx or index.js)
        so toasts work from anywhere, not just within this component.
       */}
       {/* If you keep it here, make sure it's imported */}
       {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        /> */}

      <div className={`${bgColor} rounded-xl border ${borderColor} p-4 md:p-6 sticky top-4 md:top-6`}>
        {/* Buy/Sell tabs */}
        <div className="flex mb-4 md:mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === "buy"
                ? `${primaryColor} border-b-2 ${primaryBorder}`
                : `${mutedTextColor} ${hoverBgColor}`
            }`}
            onClick={() => setActiveTab("buy")}
            disabled={isSubmitting} // Prevent clicking while submitting
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === "sell"
                ? "text-red-500 border-b-2 border-red-500"
                : `${mutedTextColor} ${hoverBgColor}`
            }`}
            onClick={() => setActiveTab("sell")}
             disabled={isSubmitting} // Prevent clicking while submitting
          >
            Sell
          </button>
        </div>

        {/* Order form */}
        <div className="space-y-3 md:space-y-4">

          {/* Order type */}
          <div>
            <label className={`block mb-1 md:mb-2 text-xs md:text-sm font-medium ${mutedTextColor}`}>
              Order Type
            </label>
            <div className="flex gap-2">
              <button
                className={`flex-1 py-1 md:py-2 px-2 md:px-3 text-center text-xs md:text-sm font-medium rounded-lg border transition-colors ${
                  orderType === "market"
                    ? `${primaryBg} text-white border-transparent`
                    : `${borderColor} ${mutedTextColor} ${hoverBgColor}`
                }`}
                onClick={() => setOrderType("market")}
                 disabled={isSubmitting} // Prevent clicking while submitting
              >
                Market
              </button>
              <button
                className={`flex-1 py-1 md:py-2 px-2 md:px-3 text-center text-xs md:text-sm font-medium rounded-lg border transition-colors ${
                  orderType === "limit"
                    ? `${primaryBg} text-white border-transparent`
                    : `${borderColor} ${mutedTextColor} ${hoverBgColor}`
                }`}
                onClick={() => setOrderType("limit")}
                 disabled={isSubmitting} // Prevent clicking while submitting
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
                   `Balance: ₹${balance?.toFixed(2) || '0.00'}`
                ) : (
                  `Available: ${currentHoldingQuantity} shares`
                )}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                id="quantity"
                value={quantity} // Use the state directly
                onChange={handleQuantityChange}
                min="1"
                 // Disable input when submitting
                className={`block w-full p-2 md:p-3 text-xs md:text-sm rounded-lg ${inputBgColor} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
                // Input type="number" handles non-numeric input visually, but state should handle parsing
              />
            </div>
            {/* Display validation messages for quantity */}
             {(quantity === '' || quantity <= 0) && (
                 <p className="text-red-500 text-xs mt-1">
                   Quantity must be a positive integer.
                 </p>
             )}
            {activeTab === "sell" && typeof quantity === 'number' && quantity > currentHoldingQuantity && (
              <p className="text-red-500 text-xs mt-1">
                You only own {currentHoldingQuantity} shares.
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
                  // Show empty string if state is null/undefined for better input UX
                  value={limitPrice === null ? '' : limitPrice}
                  onChange={handleLimitPriceChange}
                  className={`block w-full p-2 md:p-3 pl-8 md:pl-10 text-xs md:text-sm rounded-lg ${inputBgColor} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                  step="0.01"
                  // min/max attributes are visual hints, validation useEffect is the source of truth
                />
              </div>
               {/* Display validation messages for limit price */}
               {orderType === "limit" && (
                  (limitPrice === null || limitPrice <= 0 || isNaN(limitPrice)) ? (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid limit price.
                    </p>
                  ) : (currentPrice > 0 && activeTab === "buy" && limitPrice < currentPrice * 0.9) ? (
                    <p className="text-red-500 text-xs mt-1">
                      Must be ≥ ₹{(currentPrice * 0.9).toFixed(2)}
                    </p>
                  ) : (currentPrice > 0 && activeTab === "sell" && limitPrice > currentPrice * 1.1) ? (
                    <p className="text-red-500 text-xs mt-1">
                      Must be ≤ ₹{(currentPrice * 1.1).toFixed(2)}
                    </p>
                  ) : null
                )}


            </div>
          )}

          {/* Market price info */}
          {orderType === "market" && (currentPrice > 0 ? (
            <div className={`flex items-start gap-2 p-2 md:p-3 rounded-lg ${inputBgColor} ${mutedTextColor} text-xs md:text-sm`}>
              <Info className="h-3 md:h-4 w-3 md:w-4 mt-0.5 flex-shrink-0" />
              <div>
                Your order will be executed at the best available price. Current price: ₹
                {currentPrice.toFixed(2)}
              </div>
            </div>
          ) : ( // Show loading/error state if market price isn't available
              <div className={`flex items-start gap-2 p-2 md:p-3 rounded-lg ${inputBgColor} ${mutedTextColor} text-xs md:text-sm`}>
                 <Info className="h-3 md:h-4 w-3 md:w-4 mt-0.5 flex-shrink-0" />
                 <div>Waiting for real-time price data...</div>
              </div>
          ))}

           {/* Error message display */}
           {error && (
               <div className="text-red-500 text-sm mt-2">{error}</div>
           )}

           {/* Confirmation message display (can be replaced by toast) */}
           {/* {confirmation && (
               <div className="text-green-500 text-sm mt-2">{confirmation}</div>
           )} */}


          {/* Order summary */}
          <div className={`p-3 md:p-4 rounded-lg ${inputBgColor} space-y-1 md:space-y-2 text-xs md:text-sm`}>
            <div className="flex justify-between">
              <span className={mutedTextColor}>Estimated {activeTab === "buy" ? "cost" : "credit"}</span>
              {/* Only show cost if totalCost is a valid positive number */}
              {(totalCost > 0 && !isNaN(totalCost)) ? (
                 <span className="font-medium">₹{totalCost.toFixed(2)}</span>
              ) : (
                 <span className="font-medium text-gray-500">---</span>
              )}
            </div>
             {/* Optional: Show available balance */}
             {activeTab === "buy" && (
                 <div className="flex justify-between">
                      <span className={mutedTextColor}>Available Balance</span>
                      {/* Safely display balance */}
                      <span className="font-medium">₹{balance?.toFixed(2) || '0.00'}</span>
                 </div>
             )}
          </div>


          {/* Submit button */}
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitDisabled || isSubmitting}
            className={`w-full py-2 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base transition-colors ${
              activeTab === "buy"
                ? `bg-green-500 text-white hover:bg-green-600`
                : `bg-red-500 text-white hover:bg-red-600`
            } ${(isSubmitDisabled || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "Processing..." : `${activeTab === "buy" ? "Buy" : "Sell"} ${stockName}`}
          </button>
        </div>
      </div>
    </>
  );
}