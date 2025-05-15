import { create } from 'zustand';
import axios from 'axios';
import { persist } from 'zustand/middleware';

export const useOrderStore = create(
  persist(
    (set) => ({
      orders: {
        executedOrders: [],    
        openOrders: [],
        todaysOrders: [],     // New field
        allOrders: [],
      },
      loading: false,
      error: null,

      fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get('http://localhost:3000/api/user/getOrders', {
            withCredentials: true,
          });

          // Match the structure with your backend response
          set({
            orders: {
              executedOrders: res.data.data.executedOrders || [],
              openOrders: res.data.data.openOrders || [],
              todaysOrders: res.data.data.todaysOrders || [],
              allOrders: res.data.data.allOrders || [],
            },
            loading: false,
          });
        } catch (err) {
          console.error("Fetch orders error:", err);
          set({ 
            error: err.response?.data?.message || 'Failed to fetch orders',
            loading: false 
          });
        }
      },

      
    }),
    {
      name: 'order-storage', // Key for localStorage
      // Optional: You can add a partialize function to control what gets persisted
      partialize: (state) => ({ 
        orders: state.orders 
      }),
    }
  )
);

export default useOrderStore;