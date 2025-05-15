import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";

const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      firstName: null,
      lastName: null,
      username: null,
      email: null,
      balance: 0,
      joinedAt: null,
      holdings: [],
      profileImage: "/placeholder.svg",
      tradesCompleted: 0,
      portfolioPerformance: "0%",
      totalInvestment: 0, 

      // Fetch user data
      fetchUserData: async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/user/getUserData", {
            withCredentials: true,
          });
          const data = response.data.data;
          const formattedJoinDate = format(new Date(data.createdAt), "MMMM d, yyyy");
          const portfolioChangePercent = data.portfolioChangePercent || 0;

          set({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            username: data.username,
            balance: Number(data.balance),
            profileImage: data.profileImage || "/placeholder.svg",
            joinedAt: formattedJoinDate,
            tradesCompleted: data.tradesCompleted || 0,
            portfolioPerformance:
              portfolioChangePercent > 0
                ? `+${portfolioChangePercent.toFixed(1)}%`
                : `${portfolioChangePercent.toFixed(1)}%`,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data");
        }
      },

      // Update user data
      updateUserData: async (firstName, lastName) => {
        try {
          const response = await axios.put(
            "http://localhost:3000/api/user/updateUser",
            { firstName, lastName },
            { withCredentials: true }
          );

          if (response.data.status === "success") {
            const data = response.data.data;
            const formattedJoinDate = format(new Date(data.createdAt), "MMMM d, yyyy");
            const portfolioChangePercent = data.portfolioChangePercent || 0;

            set({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              username: data.username,
              balance: Number(data.balance),
              profileImage: data.profileImage || "/placeholder.svg",
              joinedAt: formattedJoinDate,
              tradesCompleted: data.tradesCompleted || 0,
              portfolioPerformance:
                portfolioChangePercent > 0
                  ? `+${portfolioChangePercent.toFixed(1)}%`
                  : `${portfolioChangePercent.toFixed(1)}%`,
            });
            toast.success("Profile updated successfully!");
          } else {
            toast.error(response.data.message || "Failed to update profile");
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          toast.error(error.response?.data?.message || "Error updating profile");
        }
      },

      // Get user holdings
    getUserHoldings: async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/user/getHolding", {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          set({
            holdings: response.data.data.holdings || [],
            totalInvestment: response.data.data.totalInvestment || 0,
          });
        } else {
          toast.error(response.data.message || "Failed to fetch holdings");
        }
      } catch (err) {
        console.error("Error fetching holdings:", err);
        toast.error(
          err.response?.data?.message ||
          err.message ||
          "Error fetching holdings"
        );
      }
  },

      
    }),
    {
      name: "user-storage", // Persisted name
      getStorage: () => localStorage, 
    }
  )
);

export default useUserStore;
