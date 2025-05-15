import { useState, useEffect } from "react";
import { DollarSign, Info } from "lucide-react";
import useStockStore from '../store/stockStore';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';  // Import toast and ToastContainer
import useUserStore from "../store/userStore";
import useOrderStore from "../store/orderStore";


export default function TestPanel({ stockName, theme }) {
  const [activeTab, setActiveTab] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const { stocks } = useStockStore();
  const { holdings , balance } = useUserStore();
  const [error, setError] = useState("");
  const [currentHoldingQuantity, setCurrentHoldingQuantity] = useState(0);
  const [confirmation, setConfirmation] = useState("");
  const navigate = useNavigate();

  const currentPrice = 160;
  

  // Theme classes
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const primaryColor = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const primaryBorder = theme === "dark" ? "border-blue-400" : "border-blue-500";
  const primaryBg = theme === "dark" ? "bg-blue-600" : "bg-blue-500";

  

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/placeOrder",
        { 
          stockName :"Vinati Organics",
          action: "BUY",
          quantity : 10 ,
          targetPrice: null,
          isMarketOrder: "true"
        },
        { withCredentials: true }
      );

      if (response.data.status === "success") {

        alert("Order placed successfully!");

        // Update the Order Store , so that i can get the open orders 
        useOrderStore.getState().fetchOrders();
        useUserStore.getState().fetchUserData();
        useUserStore.getState().getUserHoldings();

        // Refresh user data or navigate as needed
        setTimeout(() => {

          navigate("/user/dashboard"); 

        }, 1500);
      } else {
       
        alert("Order failed. Please try again.");
      }
    } catch (err) {
      
      alert("An error occurred while placing the order. Please try again. " + err);
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
                : `${mutedTextColor} ${hoverBgColor}`
            }`}
            onClick={() => setActiveTab("buy")}
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
                  `Max: ${currentPrice ? Math.floor(100000 / currentPrice) : 0} shares`
                ) : (
                  `Available: ${currentHoldingQuantity} shares`
                )}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                id="quantity"
                value={quantity}
                // onChange={handleQuantityChange}
                min="1"
                className={`block w-full p-2 md:p-3 text-xs md:text-sm rounded-lg ${inputBgColor} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                
              />
            </div>
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
                  onChange={handleLimitPriceChange}
                  className={`block w-full p-2 md:p-3 pl-8 md:pl-10 text-xs md:text-sm rounded-lg ${inputBgColor} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                  disabled={isSubmitting}
                  step="0.01"
                  min={currentPrice ? (currentPrice * 1.1).toFixed(2) : 0}
                />
              </div>
              {activeTab === "buy" && orderType === "limit" && currentPrice && (
                <p className={`text-xs mt-1 ${mutedTextColor}`}>
                  Must be greater than ₹{(currentPrice * 0.9).toFixed(2)}
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
                {currentPrice?.toFixed(2)}
              </div>
            </div>
          )}

          {/* Order summary */}
          <div className={`p-3 md:p-4 rounded-lg ${inputBgColor} space-y-1 md:space-y-2 text-xs md:text-sm`}>
            <div className="flex justify-between">
              <span className={mutedTextColor}>Estimated {activeTab === "buy" ? "cost" : "credit"}</span>
              <span className="font-medium">₹10000</span>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmitOrder}
            className={`w-full py-2 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base transition-colors ${
              activeTab === "buy"
                ? `bg-green-500 text-white hover:bg-green-600 ${(isSubmitDisabled || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`
                : `bg-red-500 text-white hover:bg-red-600 ${(isSubmitDisabled || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`
            }`}
          >
            BUY
          </button>
        </div>
      </div>
    </>
  );
}