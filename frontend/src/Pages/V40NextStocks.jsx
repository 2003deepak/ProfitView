import React, { useState , useEffect } from "react";
import { TrendingUp, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";
import useStockStore from "../store/stockStore";

const V40NextStocks = () => {
  const { theme } = themeStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  const { stocks } = useStockStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isDark = theme === "dark";

  const v40NextStocks = [
    { name: "Sun TV Network", symbol: "SUNTV", price: "₹547.20"  },
    { name: "Radico Khaitan", symbol: "RADICO", price: "₹1,144.35" },
    { name: "United Spirits", symbol: "UNITEDSPIRITS", price: "₹865.40"  },
    { name: "Eicher Motors", symbol: "EICHERMOT", price: "₹3,293.15"},
    { name: "Bosch", symbol: "BOSCHLTD", price: "₹18,453.50" },
    { name: "TTK Prestige", symbol: "TTKPRESTIG", price: "₹9,875.00" },
    { name: "V Guard Industries", symbol: "VGUARD", price: "₹275.45" },
    { name: "Symphony", symbol: "SYMPHONY", price: "₹1,152.65"},
    { name: "Sheela Foam", symbol: "SFL", price: "₹2,980.30"},
    { name: "Relaxo Footwears", symbol: "RELAXO", price: "₹948.15"},
    { name: "Rajesh Exports", symbol: "RAJESHEXPO", price: "₹774.45"},
    { name: "Polycab India", symbol: "POLYCAB", price: "₹4,026.50"},
    { name: "Lux Industries", symbol: "LUXIND", price: "₹2,033.75"},
    { name: "Honeywell Automation India", symbol: "HONAUT", price: "₹39,800.00"},
    { name: "Cera Sanitaryware", symbol: "CERA", price: "₹7,234.80" },
    { name: "Dixon Technologies", symbol: "DIXON", price: "₹4,123.25"},
    { name: "Finolex Cables", symbol: "FINCABLES", price: "₹826.15" },
    { name: "Godrej Consumer Products", symbol: "GODREJCP", price: "₹995.60" },
    { name: "3M India", symbol: "3MINDIA", price: "₹26,734.00" },
    { name: "Kansai Nerolac Paints", symbol: "KANSAINER", price: "₹402.50"},
    { name: "Indigo Paints", symbol: "INDIGOPNTS", price: "₹1,396.00"},
    { name: "Vinati Organics", symbol: "VINATIORGA", price: "₹1,890.10"},
    { name: "Caplin Point Laboratories", symbol: "CAPLIPOINT", price: "₹740.25" },
    { name: "Fine Organic Industries", symbol: "FINEORG", price: "₹5,394.50"},
    { name: "Dr Lal PathLabs", symbol: "LALPATHLAB", price: "₹2,260.40" },
    { name: "Bayer Cropscience", symbol: "BAYERCROP", price: "₹4,800.20" },
    { name: "Astrazeneca Pharma India", symbol: "ASTRAZEN", price: "₹3,300.75"},
    { name: "SIS", symbol: "SIS", price: "₹417.20" },
    { name: "TeamLease Services", symbol: "TEAMLEASE", price: "₹2,473.00" },
    { name: "Tata Elxsi", symbol: "TATAELXSI", price: "₹7,023.10" },
    { name: "Oracle Financial Services Software", symbol: "OFSS", price: "₹3,525.50"},
    { name: "Multi Commodity Exchange of India", symbol: "MCX", price: "₹1,594.60"},
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content - Dynamic margin based on sidebar state */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col overflow-hidden transition-all duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}>
        {/* Top Search Bar - Fixed at top of main content */}
        <div className="sticky top-0 z-10">
          <TopSearchBar />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-8 pt-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              V40 Next Stocks Dashboard
            </h1>
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border w-full transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
                }`}
              />
            </div>
          </div>

          {/* Stocks Table Section */}
          <div className="p-8">
            <div className={`rounded-2xl shadow-lg overflow-hidden border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm text-left">
                  <thead>
                    <tr className={`${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                      <th className="px-6 py-4 font-semibold">Stock Name</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      {v40NextStocks.map((data) => (
                        <tr
                          key={data.name}
                          className={`border-t ${
                            isDark ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <td className="px-6 py-4 font-medium whitespace-nowrap">{data.name}</td>
                          <td className={`px-6 py-4 font-medium whitespace-nowrap ${stocks[data.name].price > stocks[data.name].previousClosingPrice ? "text-green-600" : "text-red-600"}`}>
                            ₹{stocks[data.name]?.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-transform transform hover:-translate-y-1">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V40NextStocks;