import React, { useEffect } from "react";
import authStore from "../store/authStore";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import StockDisplay from "../components/StockDisplay";
import useStockStore from "../store/stockStore";
import themeStore from "../store/themeStore";

const Dashboard = () => {
  const { isLoggedIn, role } = authStore((state) => state);
  const { theme } = themeStore((state) => state);

  const {stocks } = useStockStore((state) => state);

  useEffect(() => {
    console.log(stocks);
  
  }, [stocks])
  


    return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } h-screen w-screen flex`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Top Search Bar */}
        <TopSearchBar />

        {/* Stock Cards Section */}
        <div className="flex flex-wrap gap-6 p-6 justify-center">
          <StockDisplay stockName="Nifty 50" />
          <StockDisplay stockName="Nifty Bank" />
          <StockDisplay stockName="SENSEX" />
        </div>

        <div className="flex flex-wrap gap-6 p-6 justify-center">
          <p></p>
        </div>

        

        
      </div>
    </div>
  );
};

export default Dashboard;
