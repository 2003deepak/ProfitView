import React from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";

const V40Stocks = () => {
  const { theme } = themeStore((state) => state);

  // Dummy Data
const V40stocks = [
  { name: "Eris Lifesciences", symbol: "ERIS", price: "₹1,266.30" },
  { name: "ICICI Securities", symbol: "ICICISEC", price: "₹796.65" },
  { name: "Angel One", symbol: "ANGELONE", price: "₹2,525.30" },
  { name: "Nippon India ETF Bank BeES", symbol: "BANKBEES", price: "₹498.82" },
  { name: "Nippon India ETF Nifty 50 BeES", symbol: "NIFTYBEES", price: "₹257.91" },
  { name: "Bajaj Finance", symbol: "BAJFINANCE", price: "₹7,291.65" },
  { name: "Bajaj Holdings & Investment", symbol: "BAJAJHLDNG", price: "₹10,797.00" },
  { name: "Bajaj Finserv", symbol: "BAJAJFINSV", price: "₹1,717.00" },
  { name: "ICICI Lombard General Insurance Company", symbol: "ICICIGI", price: "₹1,902.50" },
  { name: "ICICI Prudential Life Insurance Company", symbol: "ICICIPRULI", price: "₹635.55" },
  { name: "HDFC Life Insurance Company", symbol: "HDFCLIFE", price: "₹624.00" },
  { name: "Bajaj Auto", symbol: "BAJAJ-AUTO", price: "₹8,468.55" },
  { name: "Akzo Nobel India", symbol: "AKZOINDIA", price: "₹3,812.35" },
  { name: "Berger Paints India", symbol: "BERGEPAINT", price: "₹475.20" },
  { name: "Asian Paints", symbol: "ASIANPAINT", price: "₹2,260.35" },
  { name: "Pfizer", symbol: "PFIZER", price: "₹4,944.50" },
  { name: "Abbott India", symbol: "ABBOTINDIA", price: "₹21,522.50" },
  { name: "GlaxoSmithKline Pharmaceuticals", symbol: "GLAXO", price: "₹1,360.20" },
  { name: "Whirlpool Of India", symbol: "WHIRLPOOL", price: "₹1,710.40" },
  { name: "Havells India", symbol: "HAVELLS", price: "₹1,322.65" },
  { name: "Bata India", symbol: "BATAINDIA", price: "₹1,498.35" },
  { name: "Page Industries", symbol: "PAGEIND", price: "₹38,004.85" },
  { name: "Titan Company", symbol: "TITAN", price: "₹3,186.20" },
  { name: "ITC", symbol: "ITC", price: "₹384.45" },
  { name: "Marico", symbol: "MARICO", price: "₹503.15" },
  { name: "Gillette India", symbol: "GILLETTE", price: "₹6,158.25" },
  { name: "Dabur India", symbol: "DABUR", price: "₹517.65" },
  { name: "Colgate-Palmolive (India)", symbol: "COLPAL", price: "₹1,698.85" },
  { name: "Pidilite Industries", symbol: "PIDILITIND", price: "₹2,462.35" },
  { name: "Procter & Gamble Hygiene & Health Care", symbol: "PGHH", price: "₹12,498.15" },
  { name: "Nestle India", symbol: "NESTLEIND", price: "₹20,415.30" },
  { name: "Hindustan Unilever", symbol: "HINDUNILVR", price: "₹2,642.10" },
  { name: "Infosys", symbol: "INFY", price: "₹1,324.55" },
  { name: "TCS", symbol: "TCS", price: "₹3,255.20" },
  { name: "HCL Technologies", symbol: "HCLTECH", price: "₹1,232.80" },
  { name: "HDFC Bank", symbol: "HDFCBANK", price: "₹1,587.40" },
  { name: "Axis Bank", symbol: "AXISBANK", price: "₹931.25" },
  { name: "ICICI Bank", symbol: "ICICIBANK", price: "₹1,021.85" },
  { name: "Kotak Mahindra Bank", symbol: "KOTAKBANK", price: "₹1,765.35" },
];

const v40NextStocks = [
  { name: "Sun TV Network", symbol: "SUNTV", price: "₹547.20" },
  { name: "Radico Khaitan", symbol: "RADICO", price: "₹1,144.35" },
  { name: "United Spirits", symbol: "UNITEDSPIRITS", price: "₹865.40" },
  { name: "Eicher Motors", symbol: "EICHERMOT", price: "₹3,293.15" },
  { name: "Bosch", symbol: "BOSCHLTD", price: "₹18,453.50" },
  { name: "TTK Prestige", symbol: "TTKPRESTIG", price: "₹9,875.00" },
  { name: "V Guard Industries", symbol: "VGUARD", price: "₹275.45" },
  { name: "Symphony", symbol: "SYMPHONY", price: "₹1,152.65" },
  { name: "Sheela Foam", symbol: "SFL", price: "₹2,980.30" },
  { name: "Relaxo Footwears", symbol: "RELAXO", price: "₹948.15" },
  { name: "Rajesh Exports", symbol: "RAJESHEXPO", price: "₹774.45" },
  { name: "Polycab India", symbol: "POLYCAB", price: "₹4,026.50" },
  { name: "Lux Industries", symbol: "LUXIND", price: "₹2,033.75" },
  { name: "Honeywell Automation India", symbol: "HONAUT", price: "₹39,800.00" },
  { name: "Cera Sanitaryware", symbol: "CERA", price: "₹7,234.80" },
  { name: "Dixon Technologies", symbol: "DIXON", price: "₹4,123.25" },
  { name: "Finolex Cables", symbol: "FINCABLES", price: "₹826.15" },
  { name: "Godrej Consumer Products", symbol: "GODREJCP", price: "₹995.60" },
  { name: "3M India", symbol: "3MINDIA", price: "₹26,734.00" },
  { name: "Kansai Nerolac Paints", symbol: "KANSAINER", price: "₹402.50" },
  { name: "Indigo Paints", symbol: "INDIGOPNTS", price: "₹1,396.00" },
  { name: "Vinati Organics", symbol: "VINATIORGA", price: "₹1,890.10" },
  { name: "Caplin Point Laboratories", symbol: "CAPLIPOINT", price: "₹740.25" },
  { name: "Fine Organic Industries", symbol: "FINEORG", price: "₹5,394.50" },
  { name: "Dr Lal PathLabs", symbol: "LALPATHLAB", price: "₹2,260.40" },
  { name: "Bayer Cropscience", symbol: "BAYERCROP", price: "₹4,800.20" },
  { name: "Astrazeneca Pharma India", symbol: "ASTRAZEN", price: "₹3,300.75" },
  { name: "SIS", symbol: "SIS", price: "₹417.20" },
  { name: "TeamLease Services", symbol: "TEAMLEASE", price: "₹2,473.00" },
  { name: "Tata Elxsi", symbol: "TATAELXSI", price: "₹7,023.10" },
  { name: "Oracle Financial Services Software", symbol: "OFSS", price: "₹3,525.50" },
  { name: "Multi Commodity Exchange of India", symbol: "MCX", price: "₹1,594.60" },
];
 

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

        <h1 className="text-2xl font-semibold p-4">V40 Stocks</h1>

        {/* V40 Stocks Table */}
        <div className="overflow-x-auto p-6">
          <table className="table-auto w-full text-sm border-separate border-spacing-2">
            <thead>
              <tr
                className={`${
                  theme === "dark" ? "bg-red-700 text-white" : "bg-gray-300 text-gray-800"
                }`}
              >
                <th className="px-6 py-3 text-left font-medium">Stock Name</th>
                <th className="px-6 py-3 text-left font-medium">Stock Symbol</th>
                <th className="px-6 py-3 text-left font-medium">Market Price</th>
              </tr>
            </thead>
            <tbody>
              {V40stocks.map((stock, index) => (
                <tr
                  key={index}
                  className={`${
                    theme === "dark"
                      ? "hover:bg-gray-600 text-gray-200"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <td className="px-6 py-3">{stock.name}</td>
                  <td className="px-6 py-3">{stock.symbol}</td>
                  <td className="px-6 py-3">{stock.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gap between tables */}
        <div className="my-6"></div>

        <h1 className="text-2xl font-semibold p-4">V40 Next Stocks</h1>

        {/* V40 Next Stocks Table */}
        <div className="overflow-x-auto p-6">
          <table className="table-auto w-full text-sm border-separate border-spacing-2">
            <thead>
              <tr
                className={`${
                  theme === "dark" ? "bg-red-700 text-white" : "bg-gray-300 text-gray-800"
                }`}
              >
                <th className="px-6 py-3 text-left font-medium">Stock Name</th>
                <th className="px-6 py-3 text-left font-medium">Stock Symbol</th>
                <th className="px-6 py-3 text-left font-medium">Market Price</th>
              </tr>
            </thead>
            <tbody>
              {v40NextStocks.map((stock, index) => (
                <tr
                  key={index}
                  className={`${
                    theme === "dark"
                      ? "hover:bg-gray-600 text-gray-200"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <td className="px-6 py-3">{stock.name}</td>
                  <td className="px-6 py-3">{stock.symbol}</td>
                  <td className="px-6 py-3">{stock.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default V40Stocks;
