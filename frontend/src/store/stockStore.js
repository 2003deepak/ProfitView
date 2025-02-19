import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';



const useStockStore = create(
  persist(
      (set, get) => ({
          stocks: {},
          connectionStatus: 'disconnected',
          error: null,
          eventSource: null, // Store SSE instance to prevent duplicate connections

          connectToSSE: async () => {
              if (get().connectionStatus === 'connected') return;

              try {
                  set({ connectionStatus: 'connecting', error: null });

                  await axios.post("http://localhost:3000/user/api/connect/websocket");

                  // Close any existing connection before opening a new one
                  const existingEventSource = get().eventSource;
                  if (existingEventSource) {
                      existingEventSource.close();
                  }

                  // Setup a new SSE connection
                  const eventSource = new EventSource("http://localhost:3000/user/api/sendPrices");

                  eventSource.onopen = () => {
                      set({ connectionStatus: 'connected', eventSource });
                  };

                  eventSource.onmessage = (event) => {
                      try {
                          const updates = JSON.parse(event.data);
                          const formattedUpdates = updates.reduce((acc, stock) => {
                              const stockId = stock.name;
                              const prevStock = get().stocks[stockId];

                              acc[stockId] = {
                                  name: stock.name,
                                  price: stock.price === 0 && prevStock ? prevStock.price : parseFloat(stock.price) || 0,
                                  lastUpdated: Date.now()
                              };
                              return acc;
                          }, {});

                          set(state => ({
                              stocks: { ...state.stocks, ...formattedUpdates }
                          }));
                      } catch (error) {
                          console.error("SSE Data Parsing Error:", error);
                          set({ error: 'Failed to parse stock data' });
                      }
                  };

                  eventSource.onerror = (error) => {
                      console.error("SSE Error:", error);
                      set({ connectionStatus: 'error', error: 'Connection lost' });
                      eventSource.close();
                  };

                  return () => {
                      eventSource.close();
                      set({ connectionStatus: 'disconnected', eventSource: null });
                  };
              } catch (error) {
                  console.error("Connection Setup Error:", error);
                  set({ connectionStatus: 'error', error: 'Failed to establish connection' });
              }
          },

          disconnectSSE: () => {

              const eventSource = get().eventSource;
              if (eventSource) {
                  eventSource.close();
                  set({ connectionStatus: 'disconnected', eventSource: null });
              }
          }
      }),
      {
          name: "stock-storage",
          getStorage: () => localStorage,
          partialize: (state) => ({ stocks: {} })
      }
  )
);


export default useStockStore;