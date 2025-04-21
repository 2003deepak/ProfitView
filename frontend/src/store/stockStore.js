import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStockStore = create(
  persist(
    (set, get) => ({
      stocks: {},
      connectionStatus: 'disconnected',
      error: null,
      eventSource: null,

      connectToSSE: async () => {
        if (get().connectionStatus === 'connected') return;

        try {
          set({ connectionStatus: 'connecting', error: null });

          const existingEventSource = get().eventSource;
          if (existingEventSource) existingEventSource.close();

          const eventSource = new EventSource("http://localhost:3000/api/user/sendPrices");

          eventSource.onopen = () => {
            set({ connectionStatus: 'connected', eventSource });
          };

          eventSource.onmessage = (event) => {
            try {
              const updates = JSON.parse(event.data);

              const formattedUpdates = updates.reduce((acc, stock) => {
                const symbol = stock.name;
                const prevStock = get().stocks[symbol];

                acc[symbol] = {
                  name: symbol,
                  price: stock.price === 0 && prevStock ? prevStock.price : parseFloat(stock.price) || 0,
                  previousClosingPrice: parseFloat(stock.previousClosingPrice) || 0,
                  percentageChange: parseFloat(stock.percentageChange) || 0,
                  lastUpdated: Date.now()
                };

                return acc;
              }, {});

              set(state => ({
                stocks: { ...state.stocks, ...formattedUpdates }
              }));
            } catch (err) {
              console.error("SSE Data Parsing Error:", err);
              set({ error: 'Failed to parse stock data' });
            }
          };

          eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            eventSource.close();
            set({ connectionStatus: 'error', error: 'Connection lost', eventSource: null });
          };

        } catch (err) {
          console.error("Connection Setup Error:", err);
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
      partialize: (state) => ({ stocks: state.stocks }) // persist only stock prices
    }
  )
);

export default useStockStore;
