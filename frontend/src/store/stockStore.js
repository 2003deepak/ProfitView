import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStockStore = create(
  persist(
    (set, get) => ({
      stocks: {},
      connectionStatus: 'disconnected',
      error: null,
      eventSource: null,
      reconnectDelay: 1000,
      maxReconnectDelay: 30000,
      reconnectTimer: null,

      connectToSSE: async () => {
        // Clear existing reconnect timers if any
        const currentTimer = get().reconnectTimer;
        if (currentTimer) {
          clearTimeout(currentTimer);
          set({ reconnectTimer: null });
        }

        try {
          set({ connectionStatus: 'connecting', error: null });

          const existingEventSource = get().eventSource;
          if (existingEventSource) existingEventSource.close();

          const eventSource = new EventSource("http://localhost:3000/api/user/sendPrices");

          eventSource.onopen = () => {
            console.log("✅ SSE Connected");
            set({
              connectionStatus: 'connected',
              eventSource,
              reconnectDelay: 1000, // reset on success
              reconnectTimer: null
            });
          };

          eventSource.onmessage = (event) => {
            try {
              const updates = JSON.parse(event.data);

              set((state) => {
                const updatedStocks = { ...state.stocks };
                let shouldUpdate = false;

                updates.forEach((stock) => {
                  const symbol = stock.name;
                  const prevStock = updatedStocks[symbol];
                  const newPrice = stock.price === 0 ? (prevStock?.price ?? 0) : parseFloat(stock.price) || 0;

                  if (prevStock) {
                    if (prevStock.price !== newPrice) {
                      updatedStocks[symbol] = {
                        ...prevStock,
                        price: newPrice,
                        lastUpdated: Date.now()
                      };
                      shouldUpdate = true;
                    }
                  } else {
                    updatedStocks[symbol] = {
                      name: symbol,
                      price: newPrice,
                      previousClosingPrice: parseFloat(stock.previousClosingPrice) || 0,
                      percentageChange: parseFloat(stock.percentageChange) || 0,
                      lastUpdated: Date.now()
                    };
                    shouldUpdate = true;
                  }
                });

                if (shouldUpdate) return { stocks: updatedStocks };
                return {}; // no change
              });

            } catch (err) {
              console.error("SSE Data Parsing Error:", err);
              set({ error: 'Failed to parse stock data' });
            }
          };

          eventSource.onerror = () => {
            console.error("⚠️ SSE Disconnected/Error - Scheduling Reconnect");
            eventSource.close();

            const currentDelay = get().reconnectDelay;
            const nextDelay = Math.min(currentDelay * 2, get().maxReconnectDelay);

            set({
              connectionStatus: 'disconnected',
              error: 'Connection lost',
              eventSource: null,
              reconnectDelay: nextDelay
            });

            const timer = setTimeout(() => {
              console.log(`🔁 Reconnecting after ${currentDelay / 1000}s...`);
              get().connectToSSE();
            }, currentDelay);

            set({ reconnectTimer: timer });
          };
        } catch (err) {
          console.error("❌ Connection Setup Error:", err);
          set({ connectionStatus: 'error', error: 'Failed to establish connection' });
        }
      },

      disconnectSSE: () => {
        const eventSource = get().eventSource;
        const timer = get().reconnectTimer;

        if (eventSource) eventSource.close();
        if (timer) clearTimeout(timer);

        set({
          connectionStatus: 'disconnected',
          eventSource: null,
          reconnectTimer: null
        });
      }
    }),
    {
      name: "stock-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({ stocks: state.stocks }) // only persist stocks
    }
  )
);

export default useStockStore;
