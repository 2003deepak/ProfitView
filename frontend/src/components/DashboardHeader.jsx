import {React,useState,useEffect} from 'react'
import themeStore from "../store/themeStore";
import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react"
import { useNavigate } from 'react-router';
import {Bell,Settings,Clock} from "lucide-react";
import NotificationPanel from './NotificationPanel';

const DashboardHeader = ({PageTitle,Message}) => {

  const { theme, setTheme } = themeStore((state) => state);
  const [marketStatus, setMarketStatus] = useState("open"); // 'open', 'closed', 'pre', 'after'
  const navigate = useNavigate();


  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 6 = Saturday
      const hour = now.getHours();
      const minutes = now.getMinutes();

      if (day === 0 || day === 6) {
        setMarketStatus("closed"); // Weekend
        return;
      }

      const time = hour * 60 + minutes; // Minutes since midnight
      const preOpenStart = 9 * 60;
      const openStart = 9 * 60 + 30;
      const openEnd = 15 * 60 + 30;

      if (time >= preOpenStart && time < openStart) {
        setMarketStatus("pre");
      } else if (time >= openStart && time < openEnd) {
        setMarketStatus("open");
      } else {
        setMarketStatus("closed");
      }
    };

    updateStatus(); // Initial check
    const interval = setInterval(updateStatus, 60 * 1000); // Re-check every minute
    return () => clearInterval(interval); // Cleanup
  }, []);


  return (
    <>

        {/* Page Header Section */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold">{PageTitle}</h1>
                <p className={`${mutedTextColor}`}>
                    {Message}
                </p>
            </div>
    
            {/* Header right side with market status and buttons */}
            <div className="flex items-center gap-4">
                    {/* Market status indicator */}
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                        marketStatus === "open"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : marketStatus === "closed"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Market {marketStatus === "open" ? "Open" : marketStatus === "closed" ? "Closed" : "Pre-market"}
                      </span>
                    </div>
    
    
                     {/* Notification and settings buttons */}

                     <NotificationPanel/>
    
                   
                    
    
                    <button
                      className={`p-2 rounded-full ${borderColor} border ${hoverBgColor}`}
                      onClick={() => navigate("/user/settings")}
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                

    </>
  )
}

export default DashboardHeader;
