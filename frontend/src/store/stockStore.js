import { create } from 'zustand';
import { fromEvent, Observable, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import useUserStore from './userStore';
import useOrderStore from './orderStore';

let rxSubscription = null;

const useStockStore = create((set, get) => ({
  stocks: {},
  orderUpdates: null,
  connectionStatus: 'disconnected',
  error: null,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000,
  reconnectTimer: null,

  setOrderUpdates: (data) => set({ orderUpdates: data }),

  updateStock: (updateData) => {
    const symbol = updateData.name;
    const prevStock = get().stocks[symbol];
    const newPrice = parseFloat(updateData.price) || 0;

    const priceChanged = !prevStock || Math.abs((prevStock.price || 0) - newPrice) > 0.001;

    if (priceChanged) {
      set((state) => {
        const updatedStocks = { ...state.stocks };
        updatedStocks[symbol] = {
          ...prevStock,
          name: symbol,
          price: newPrice,
          previousClosingPrice: parseFloat(updateData.previousClosingPrice) || prevStock?.previousClosingPrice || 0,
          percentageChange: parseFloat(updateData.percentageChange) || prevStock?.percentageChange || 0,
          lastUpdated: Date.now(),
        };
        return { stocks: updatedStocks };
      });
    }
  },

  connectToSSE: () => {
    const { connectionStatus, reconnectTimer } = get();

    if (connectionStatus === 'connected' || connectionStatus === 'connecting') return;

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      set({ reconnectTimer: null });
    }

    if (rxSubscription) {
      rxSubscription.unsubscribe();
      rxSubscription = null;
    }

    set({ connectionStatus: 'connecting', error: null });

    const sse$ = new Observable((observer) => {
      const source = new EventSource("http://localhost:3000/api/user/sendData", { withCredentials: true });

      // Event handlers
      const onOpen = () => {
        console.log("✅ SSE Connected");
        useStockStore.setState({
          connectionStatus: 'connected',
          reconnectDelay: 1000,
          error: null,
        });
      };

      const onOrderUpdate = (e) => {
        try {
          const data = JSON.parse(e.data);
          useStockStore.getState().setOrderUpdates(data);
          useUserStore.getState().getUserHoldings();
          useUserStore.getState().fetchUserData();
          useOrderStore.getState().fetchOrders();
        } catch (err) {
          console.error("Failed to parse orderUpdate event:", err);
        }
      };

      const onMessage = (e) => {
        try {
          const update = JSON.parse(e.data);
          if (!update?.name || typeof update.price === 'undefined') {
            console.warn("Invalid stock update:", update);
            return;
          }
          useStockStore.getState().updateStock(update);
        } catch (err) {
          console.error("SSE Data Parsing Error:", err);
        }
      };

      const onError = (err) => {
        console.error("⚠️ SSE Error:", err);
        observer.error(err);
      };

      // Register event listeners
      source.addEventListener('open', onOpen);
      source.addEventListener('orderUpdate', onOrderUpdate);
      source.addEventListener('message', onMessage);
      source.addEventListener('error', onError);

      // Cleanup function
      return () => {
        source.removeEventListener('open', onOpen);
        source.removeEventListener('orderUpdate', onOrderUpdate);
        source.removeEventListener('message', onMessage);
        source.removeEventListener('error', onError);
        source.close();
        console.log("🔴 SSE Connection Closed");
      };
    });

    rxSubscription = sse$.pipe(
      catchError((error) => {
        console.log(`⏳ Reconnecting in ${get().reconnectDelay / 1000}s...`);
        const currentDelay = get().reconnectDelay;
        const nextDelay = Math.min(currentDelay * 2, get().maxReconnectDelay);

        set({
          connectionStatus: 'disconnected',
          error: 'Connection lost. Reconnecting...',
          reconnectDelay: nextDelay,
        });

        const timer = setTimeout(() => get().connectToSSE(), currentDelay);
        set({ reconnectTimer: timer });

        return EMPTY;
      })
    ).subscribe();
  },

  disconnectSSE: () => {
    const { reconnectTimer } = get();

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      set({ reconnectTimer: null });
    }

    if (rxSubscription) {
      rxSubscription.unsubscribe();
      rxSubscription = null;
    }

    set({
      connectionStatus: 'disconnected',
      error: null,
    });
  },
}));

export default useStockStore;
