import { useState, useEffect } from "react";
import { DollarSign, Info } from "lucide-react";
import useStockStore from '../store/stockStore';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast , ToastContainer} from 'react-toastify';
import useUserStore from "../store/userStore";
import useOrderStore from "../store/orderStore";
import { useLocation } from 'react-router-dom';


export default function BuySellPanel({ stockName, theme}) {
  const [activeTab, setActiveTab] = useState("buy"); // 'buy' or 'sell'
  const [orderType, setOrderType] = useState("market"); // 'market' or 'limit'
  const [quantity, setQuantity] = useState(''); // Use empty string initially for input clarity
  const [limitPrice, setLimitPrice] = useState(''); // Use empty string initially for input clarity

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const prefilledData = location.state?.prefilledData;

  if(prefilledData) {
    setActiveTab(prefilledData.action.toLowerCase());
    setOrderType(prefilledData.isMarketOrder ? "market" : "limit");
    setQuantity(prefilledData.quantity);
    setLimitPrice(prefilledData.targetPrice || '');

  }


  // --- Stock Store Data ---
  const currentPrice = useStockStore(state => state.stocks[stockName]?.price || 0);

  // --- User Store Data/Actions ---
  const holdings = useUserStore(state => state.holdings);
  const balance = useUserStore(state => state.balance);

  // --- Order Store --- 
  const fetchOrders = useOrderStore(state => state.fetchOrders);

  const [error, setError] = useState(""); 
  const [currentHoldingQuantity, setCurrentHoldingQuantity] = useState(0);

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
  const secondaryBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";


  // Effect to update holding quantity when tab or holdings change
  useEffect(() => {
    if (activeTab === "sell") {
      getStockQuantity(stockName);
    } else {
      setCurrentHoldingQuantity(0);
    }
    
  }, [activeTab, stockName, holdings]);


  // Function to get stock quantity from holdings
  const getStockQuantity = (stockName) => {

    const stock = holdings.find((stock) => stock.stock_name === stockName);
    setCurrentHoldingQuantity(stock ? stock.quantity : 0);
  }


  // Calculate total cost (derive directly from state/props)
  const parsedQuantity = parseInt(quantity, 10) || 0; 
  const parsedLimitPrice = parseFloat(limitPrice) || 0; 

  const totalCost = orderType === "market"
    ? (currentPrice * parsedQuantity)
    : (parsedLimitPrice) * parsedQuantity;

  // Validate inputs and enable/disable submit button
  useEffect(() => {
    let isValid = true;
    setError('');

    // Basic validation: Quantity must be a positive integer
    if (parsedQuantity <= 0 || !Number.isInteger(parsedQuantity)) {
      isValid = false;
    }

    // Price must be available for market orders (cannot place if price is 0 or NaN)
    if (orderType === "market" && (currentPrice <= 0 || isNaN(currentPrice))) {
        isValid = false;
    }

    // Active tab specific checks
    if (activeTab === "buy") {
      // Check sufficient balance
      const currentBalance = parseFloat(balance) || 0;
      if (currentBalance < totalCost || isNaN(totalCost)) {
         isValid = false;
      }

      if (orderType === "limit") {
        // Check minimum limit price for buy (must be >= 90% of current price, example rule)
        const minLimitPrice = currentPrice * 0.9;
        if (parsedLimitPrice <= 0 || isNaN(parsedLimitPrice) || (currentPrice > 0 && parsedLimitPrice < minLimitPrice)) {
          isValid = false;

        }
      }
    } else { 
     
      if (parsedQuantity > (currentHoldingQuantity || 0)) {
        isValid = false;
        
      }
     
      if (orderType === "limit") {
         const maxLimitPrice = currentPrice * 1.1;
         if (parsedLimitPrice <= 0 || isNaN(parsedLimitPrice) || (currentPrice > 0 && parsedLimitPrice > maxLimitPrice)) {
            isValid = false;
           
         }
      }
    }


    // Disable if currently submitting
    if (isSubmitting) {
        isValid = false;
    }

    setIsSubmitDisabled(!isValid);


  }, [quantity, limitPrice, orderType, activeTab, currentPrice, currentHoldingQuantity, balance, totalCost, isSubmitting]);


  // Handle quantity change - Allow empty input but ensure it's a number when used
  const handleQuantityChange = (e) => {
      setQuantity(e.target.value);
  }
  

  // Handle limit price change - Allow empty input but ensure it's a number when used
  const handleLimitPriceChange = (e) => {
      setLimitPrice(e.target.value);

  }


  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Double-check disabled state client-side before submitting
    if (isSubmitDisabled || isSubmitting) {
      console.log("Submit is disabled or already submitting.");
      return;
    }

    setError(""); // Clear previous API errors
    setIsSubmitting(true);

    const orderDetails = {
      stockName,
      action: activeTab.toUpperCase(),
      quantity: parsedQuantity, // Use parsed value
      targetPrice: orderType === "limit" ? parsedLimitPrice : null, // Use parsed value
      isMarketOrder: orderType === "market"
    };


    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/placeOrder",
        orderDetails,
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        // console.log("Order placement API successful:", response.data);
        toast.success("Order Placed Successfully");


        // Clear form inputs after successful placement
        setQuantity('');
        setLimitPrice('');
        setOrderType("market"); 
        setActiveTab("buy"); 
        fetchOrders();


      } else {
       
        const errorMessage = response.data.message || "Order placement failed. Please try again.";
        setError(errorMessage); 
        console.error("Order placement failed:", response.data);
        toast.error("Order placement failed: " + errorMessage); 

      }
    } catch (err) {
       // --- Handle network or request errors ---
       const errorMessage = err.response?.data?.message || "An error occurred while placing the order. Please try again.";
       setError(errorMessage); // Show error below the form
       console.error("Order submission error:", err);
       toast.error("Order placement failed: " + errorMessage);
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
                : `${mutedTextColor} ${hoverBgColor} border-b border-transparent` // Added border-b-transparent for consistency
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
                : `${mutedTextColor} ${hoverBgColor} border-b border-transparent` // Added border-b-transparent
            }`}
            onClick={() => setActiveTab("sell")}
             disabled={isSubmitting} // Prevent clicking while submitting
          >
            Sell
          </button>
        </div>

        {/* Order form */}
        <form onSubmit={handleSubmitOrder} className="space-y-3 md:space-y-4"> {/* Use a form element */}

          {/* Order type */}
          <div>
            <label className={`block mb-1 md:mb-2 text-xs md:text-sm font-medium ${mutedTextColor}`}>
              Order Type
            </label>
            <div className="flex gap-2">
              <button
                type="button" // Important: Prevent button inside form from submitting it
                className={`flex-1 py-1 md:py-2 px-2 md:px-3 text-center text-xs md:text-sm font-medium rounded-lg border transition-colors ${
                  orderType === "market"
                    ? `${primaryBg} text-white border-transparent`
                    : `${secondaryBg} ${borderColor} ${mutedTextColor} hover:border-gray-400` // Improved inactive style
                }`}
                onClick={() => setOrderType("market")}
                 disabled={isSubmitting}
              >
                Market
              </button>
              <button
                 type="button" // Important: Prevent button inside form from submitting it
                className={`flex-1 py-1 md:py-2 px-2 md:px-3 text-center text-xs md:text-sm font-medium rounded-lg border transition-colors ${
                  orderType === "limit"
                    ? `${primaryBg} text-white border-transparent`
                    : `${secondaryBg} ${borderColor} ${mutedTextColor} hover:border-gray-400` // Improved inactive style
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
                value={quantity} // Use the state directly (can be empty string)
                onChange={handleQuantityChange}
                min="1"
                 // Disable input when submitting
                className={`block w-full p-2 md:p-3 text-xs md:text-sm rounded-lg ${inputBgColor} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
                // Note: input type="number" min/max are visual hints, validation useEffect is the source of truth
              />
            </div>
           
             {(parsedQuantity <= 0 && quantity !== '') && ( // Show error if 0 or less, but not if input is empty
                 <p className="text-red-500 text-xs mt-1">
                   Quantity must be a positive integer.
                 </p>
             )}
            {activeTab === "sell" && parsedQuantity > 0 && parsedQuantity > (currentHoldingQuantity || 0) && (
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
                  value={limitPrice} // Use the state directly (can be empty string)
                  onChange={handleLimitPriceChange}
                  className={`block w-full p-2 md:p-3 pl-8 md:pl-10 text-xs md:text-sm rounded-lg ${inputBgColor} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                  step="0.01"
                />
              </div>
               {/* Display validation messages for limit price */}
               {orderType === "limit" && (
                  // Check against parsedLimitPrice for validation display logic
                  (parsedLimitPrice <= 0 && limitPrice !== '') ? ( // Show error if 0 or less, but not if input is empty
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid limit price.
                    </p>
                  ) : (currentPrice > 0 && activeTab === "buy" && parsedLimitPrice > 0 && parsedLimitPrice < currentPrice * 0.9) ? ( // Only show range check if limit price is positive
                    <p className="text-red-500 text-xs mt-1">
                      Must be ≥ ₹{(currentPrice * 0.9).toFixed(2)}
                    </p>
                  ) : (currentPrice > 0 && activeTab === "sell" && parsedLimitPrice > currentPrice * 1.1) ? ( // Only show range check if limit price is positive
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

           {/* API Error message display */}
           {error && (
               <div className="text-red-500 text-sm mt-2">{error}</div>
           )}

          {/* Order summary */}
          <div className={`p-3 md:p-4 rounded-lg ${inputBgColor} space-y-1 md:space-y-2 text-xs md:text-sm`}>
            <div className="flex justify-between">
              <span className={mutedTextColor}>Estimated {activeTab === "buy" ? "cost" : "credit"}</span>
              {/* Only show cost if totalCost is a valid positive number and quantity is valid */}
              {(totalCost > 0 && !isNaN(totalCost) && parsedQuantity > 0) ? (
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
            {isSubmitting ? "Processing..." : `${activeTab === "buy" ? "Buy" : "Sell"} ${stockName}`}
          </button>
        </form>

        <ToastContainer position="top-right" />
      </div>
    </>
  );
}