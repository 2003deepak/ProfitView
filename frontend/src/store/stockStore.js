import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useUserStore from "./userStore"; // Still need to import to access getState()

const useStockStore = create(
  persist(
    (set, get) => ({
      stocks: {}, // Holds stock data by symbol
      connectionStatus: 'disconnected',
      error: null, // Connection or data parsing error
      eventSource: null, // SSE EventSource instance
      reconnectDelay: 1000, // Initial reconnect delay (1 second)
      maxReconnectDelay: 30000, // Maximum reconnect delay (30 seconds)
      reconnectTimer: null, // Timer ID for scheduled reconnects
      orderExecuted: null, // State to trigger UI updates (like toasts) for executed orders

      // Action to signal an order was executed (called by SSE listener or potentially API callback)
      setOrderExecuted: (value) => set({ orderExecuted: value }),

      // Action to establish the SSE connection
      connectToSSE: async () => {
        // Prevent connecting if already connected or attempting to connect
        if (get().connectionStatus === 'connected' || get().connectionStatus === 'connecting') {
            console.log("Attempted to connect SSE, but already connected or connecting.");
            return;
        }

        // Clear any existing reconnect timers before starting a new connection attempt
        const currentTimer = get().reconnectTimer;
        if (currentTimer) {
          console.log("Clearing existing reconnect timer.");
          clearTimeout(currentTimer);
          set({ reconnectTimer: null });
        }

        // Close any leftover event source instance
        const existingEventSource = get().eventSource;
        if (existingEventSource && existingEventSource.readyState !== EventSource.CLOSED) {
            console.log("Closing existing SSE connection before reconnecting.");
            existingEventSource.close();
        }

        console.log("Attempting to connect SSE...");
        set({ connectionStatus: 'connecting', error: null }); // Update status

        try {
          // Create new EventSource instance
          const eventSource = new EventSource("http://localhost:3000/api/user/sendData", {
            withCredentials: true
          });

          // --- SSE Event Listeners ---

          // Listener for 'orderExecuted' custom event
          eventSource.addEventListener('orderExecuted', (event) => {
            console.log("Received orderExecuted event:", event.data);
            try {
              const data = JSON.parse(event.data);
              // Update store state to trigger components listening for order execution
              set({ orderExecuted: data });

              // Immediately trigger data refresh in the user store
              // Use .getState() to access actions from another store outside a component
              useUserStore.getState().getUserHoldings();
              useUserStore.getState().fetchUserData();

            } catch (err) {
              console.error("Failed to parse orderExecuted event data:", event.data, err);
            }
          });

          // 'open' event: Connection successfully established
          eventSource.onopen = () => {
            console.log("✅ SSE Connected");
            set({
              connectionStatus: 'connected',
              eventSource, // Store the new EventSource instance
              reconnectDelay: 1000, // Reset reconnect delay on success
              reconnectTimer: null // Clear timer reference
            });
          };

          // 'message' event: Receive stock price updates
          eventSource.onmessage = (event) => {
            // console.log("Received SSE message:", event.data); // Log received messages (can be chatty)
            try {
              const updates = JSON.parse(event.data);

              if (!Array.isArray(updates)) {
                  console.warn("SSE message data is not an array:", updates);
                  return; // Ignore message if not in expected format
              }

              set((state) => {
                // Create a shallow copy of the current stocks object
                const updatedStocks = { ...state.stocks };
                let stateChanged = false; // Flag to track if any change occurred

                updates.forEach((stock) => {
                  // Basic validation for the update object
                  if (!stock || !stock.name || typeof stock.price === 'undefined') {
                      console.warn("Skipping invalid stock update object:", stock);
                      return;
                  }

                  const symbol = stock.name;
                  const prevStock = updatedStocks[symbol]; // Get the existing stock data from the copied object

                  // Safely parse potential string numbers, default to 0 if invalid
                  const newPrice = parseFloat(stock.price) || 0;
                  // Assuming previousClosingPrice and percentageChange might also come in updates
                  const prevClose = parseFloat(stock.previousClosingPrice) || 0;
                  const percentChange = parseFloat(stock.percentageChange) || 0;


                  // --- Determine if THIS SPECIFIC stock's data has changed ---
                  let stockDataChanged = false;
                  const currentStockData = prevStock || {}; // Use previous data or empty object if new

                  // Check price change
                  if (currentStockData.price !== newPrice) {
                      stockDataChanged = true;
                  }
                  // Check previousClosingPrice change (only if update provides a non-zero value)
                  if (prevClose !== 0 && currentStockData.previousClosingPrice !== prevClose) {
                      stockDataChanged = true;
                  }
                   // Check percentageChange (only if update provides a non-zero value and differs)
                   if (percentChange !== 0 && currentStockData.percentageChange !== percentChange) {
                        stockDataChanged = true;
                   }
                    // You might add checks for other fields if your SSE sends them

                  // --- Update the copied stocks object ONLY if data changed or it's a new stock ---
                  if (stockDataChanged) {
                      updatedStocks[symbol] = {
                          ...currentStockData, // Keep existing properties if not in the update
                          name: symbol, // Ensure symbol is set
                          price: newPrice,
                          // Update these fields only if the update provides a valid, non-zero value
                          previousClosingPrice: prevClose !== 0 ? prevClose : currentStockData.previousClosingPrice,
                          percentageChange: percentChange !== 0 ? percentChange : currentStockData.percentageChange,
                          lastUpdated: Date.now() // Update timestamp whenever data changes
                      };
                      stateChanged = true; // Mark that the overall stocks object needs updating
                  } else if (!prevStock && newPrice > 0) { // Case: This is a brand new stock not in our list yet
                       // Only add if it seems like valid initial data (e.g., price > 0)
                       updatedStocks[symbol] = {
                           name: symbol,
                           price: newPrice,
                           previousClosingPrice: prevClose,
                           percentageChange: percentChange,
                           lastUpdated: Date.now()
                       };
                       stateChanged = true; // Mark that the overall stocks object needs updating
                   }
                   // If !stockDataChanged and it's not a new stock, do nothing for this symbol
                   // The copied updatedStocks[symbol] still holds the reference to the previous state object
                });

                // --- Decide whether to update the store state ---
                // Only return a new state object if at least one stock's data actually changed or was added
                if (stateChanged) {
                    // console.log("Zustand state update triggered."); // Optional: log state updates
                    return { stocks: updatedStocks }; // Return the new copied object
                }

                // If nothing changed in this message, return an empty object.
                // This signals Zustand NOT to perform a state update for 'stocks',
                // preserving the previous state object reference.
                // console.log("No state change needed based on SSE message."); // Optional: log when no update happens
                return {};

              }); // End of set callback

            } catch (err) {
              console.error("SSE Data Parsing Error:", err, "Raw data:", event.data);
              set({ error: 'Failed to parse stock data' });
            }
          }; // End of onmessage

          // 'error' event: Connection error or closure
          eventSource.onerror = (event) => {
            console.error("⚠️ SSE EventSource error detected:", event);

            // Attempt to close the connection if it's not already closed
            const es = get().eventSource;
             if (es && es.readyState !== EventSource.CLOSED) {
                 console.log("Closing SSE connection due to error.");
                 es.close();
             }

            // Calculate next reconnect delay with exponential backoff
            const currentDelay = get().reconnectDelay;
            const nextDelay = Math.min(currentDelay * 2, get().maxReconnectDelay);

            console.log(`Scheduling reconnect in ${currentDelay / 1000}s. Next delay: ${nextDelay / 1000}s`);

            // Update status and store details for reconnect
            set({
              connectionStatus: 'disconnected',
              error: 'Connection lost, attempting to reconnect...',
              eventSource: null, // Nullify the invalid event source instance
              reconnectDelay: nextDelay, // Update delay for the next attempt
              reconnectTimer: null // Clear any existing timer before setting a new one
            });

            // Set a timer to attempt reconnection
            const timer = setTimeout(() => {
              console.log(`🔁 Attempting to reconnect to SSE...`);
              get().connectToSSE(); // Call the connect action again
            }, currentDelay);

            set({ reconnectTimer: timer }); // Store the new timer reference
          }; // End of onerror

        } catch (err) {
          // Error during initial EventSource setup (e.g., network error before connection)
          console.error("❌ Failed to establish SSE connection:", err);
          set({
            connectionStatus: 'error',
            error: 'Failed to establish connection to server.'
          });
        }
      }, // End of connectToSSE action

      // Action to manually disconnect the SSE connection
      disconnectSSE: () => {
        const eventSource = get().eventSource;
        const timer = get().reconnectTimer;

        // Close the connection if it's open
        if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
            console.log("Disconnecting SSE.");
            eventSource.close();
        }
        // Clear any pending reconnect timers
        if (timer) {
            console.log("Clearing reconnect timer on disconnect.");
            clearTimeout(timer);
        }

        // Reset state related to connection
        set({
          connectionStatus: 'disconnected',
          eventSource: null,
          reconnectTimer: null,
          error: null // Clear any connection error
        });
      } // End of disconnectSSE action

    }), // End of store actions and state definition
    {
      name: "stock-storage", // Unique name for persistence
      getStorage: () => localStorage, // Use localStorage
      // Only persist the 'stocks' data. Exclude runtime objects like eventSource, timers.
      partialize: (state) => ({ stocks: state.stocks }),
      // Optional: Add merge if you need complex rehydration logic,
      // but default merging is usually fine for just the stocks object.
      // merge: (persistedState, currentState) => ({ ...currentState, ...persistedState }),
    }
  ) // End of persist middleware
); // End of create

export default useStockStore;