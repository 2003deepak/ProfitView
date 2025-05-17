import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useUserStore from "./userStore"; // Still need to import to access getState()

const useStockStore = create(
  persist(
    (set, get) => ({
      stocks: {}, // Holds stock data by symbol (e.g., { "TCS": { ... }, "INFY": { ... } })
      connectionStatus: 'disconnected', // 'disconnected', 'connecting', 'connected', 'error'
      error: null, // Connection or data parsing error message
      eventSource: null, // SSE EventSource instance
      reconnectDelay: 1000, // Initial reconnect delay (1 second)
      maxReconnectDelay: 30000, // Maximum reconnect delay (30 seconds)
      reconnectTimer: null, // Timer ID for scheduled reconnects
      orderExecuted: null, // State to trigger UI updates (like toasts) for executed orders

      // Action to signal an order was executed (called by SSE listener)
      setOrderExecuted: (value) => set({ orderExecuted: value }),

      // Action to establish the SSE connection
      connectToSSE: async () => {
        const { connectionStatus, eventSource: currentEventSource, reconnectTimer: currentTimer } = get();

        // Prevent connecting if already connected or attempting to connect
        if (connectionStatus === 'connected' || connectionStatus === 'connecting') {
            console.log(`Attempted to connect SSE, but status is '${connectionStatus}'.`);
            return;
        }

        console.log("Attempting to connect SSE...");

        // Clear any existing reconnect timers
        if (currentTimer) {
          console.log("Clearing existing reconnect timer.");
          clearTimeout(currentTimer);
          set({ reconnectTimer: null });
        }

        // Close any leftover event source instance that might not have properly closed
        if (currentEventSource && currentEventSource.readyState !== EventSource.CLOSED) {
            console.log(`Closing existing SSE connection (readyState: ${currentEventSource.readyState}) before reconnecting.`);
            currentEventSource.close();
             // Add a small delay or await closure if possible, though EventSource close is often async fire-and-forget
        }

        set({ connectionStatus: 'connecting', error: null }); // Update status

        try {
          // Create new EventSource instance
          // Ensure the URL is correct for your backend SSE endpoint
          const eventSource = new EventSource("http://localhost:3000/api/user/sendData", {
            withCredentials: true
          });

          // --- SSE Event Listeners ---

          // Listener for 'orderExecuted' custom event
          eventSource.addEventListener('orderExecuted', (event) => {
            console.log("Received orderExecuted event:", event.data);
            try {
              const data = JSON.parse(event.data);
              // Validate data if necessary before updating state
              if (data && typeof data === 'object') {
                 // Update store state to trigger components listening for order execution
                 set({ orderExecuted: data });
                 
                 useUserStore.getState().getUserHoldings();
                 useUserStore.getState().fetchUserData(); // Assuming this fetches user details, potentially including balance
              } else {
                  console.warn("Received invalid data for orderExecuted event:", data);
              }

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
              reconnectTimer: null // Ensure timer reference is null
            });
          };

        
          eventSource.onmessage = (event) => {
            // console.log("Received SSE message:", event.data); // Log received messages (can be chatty)
            try {
              // Parse the single stock update object
              const updateData = JSON.parse(event.data);

              // --- Validate the incoming data structure ---
              // We now expect a single object with 'name', 'price', and potentially others
              if (!updateData || typeof updateData !== 'object' || !updateData.name || typeof updateData.price === 'undefined') {
                  console.warn("Skipping invalid SSE price update object:", updateData);
                   // If you send other message types on the default 'message' event,
                   // you would add checks here (e.g., if (updateData.type === 'status') { ... }).
                  return; // Ignore message if not in expected format
              }

              set((state) => {
                // Get the symbol (e.g., "TCS") from the update data
                const symbol = updateData.name;
                // Get the previous state for this specific stock from the current state
                const prevStock = state.stocks[symbol];

                // Safely parse potential string numbers from the update data, default to 0 if invalid
                const newPrice = parseFloat(updateData.price) || 0;
                // These fields might or might not be present in every update object
                // Use optional chaining (?.) and nullish coalescing (??) or similar checks
                const prevClose = updateData.hasOwnProperty('previousClosingPrice') ? (parseFloat(updateData.previousClosingPrice) || 0) : (prevStock?.previousClosingPrice || 0);
                const percentChange = updateData.hasOwnProperty('percentageChange') ? (parseFloat(updateData.percentageChange) || 0) : (prevStock?.percentageChange || 0);
                const lastUpdated = Date.now(); // Use current time for timestamp of this update

                // --- Determine if THIS SPECIFIC stock's data has changed significantly ---
                // Only update state if the price is different, or if it's a new stock we don't have yet.
                // Checking other fields like prevClose/percentChange changing less frequently might be omitted for performance
                let stockDataChanged = false;

                 if (!prevStock || // It's a new stock we just received data for
                     prevStock.price !== newPrice // The price has changed
                     // Add other checks here if changes in other fields should also trigger a state update
                     // || (updateData.hasOwnProperty('previousClosingPrice') && prevStock.previousClosingPrice !== prevClose)
                     // || (updateData.hasOwnProperty('percentageChange') && prevStock.percentageChange !== percentChange)
                    ) {
                     stockDataChanged = true;
                 }


                // --- Update the state ONLY if data changed or it's a new stock ---
                if (stockDataChanged) {
                    // Create a shallow copy of the overall stocks object to trigger a state update
                    const updatedStocks = { ...state.stocks };

                    // Update/Add the specific stock in the copied object
                    updatedStocks[symbol] = {
                        ...prevStock, // Keep existing properties of this stock (like quantity, avgPrice etc. if you add them later)
                        name: symbol, // Ensure symbol is set
                        price: newPrice,
                        // Update these fields using the parsed values (which fallback to previous if not in updateData)
                        previousClosingPrice: prevClose,
                        percentageChange: percentChange,
                        lastUpdated: lastUpdated
                    };

                    // Return the new state object to trigger a Zustand update
                    // console.log(`Zustand state update triggered for ${symbol}.`); // Optional: log state updates
                    return { stocks: updatedStocks };

                } else {
                    // If nothing changed for this specific stock update (based on the checks above),
                    // return an empty object. This signals Zustand NOT to update the 'stocks'
                    // part of the state, preserving the previous state object reference
                    // and preventing unnecessary re-renders.
                    // console.log(`No significant state change for ${symbol} based on SSE message.`); // Optional: log
                     return {};
                }

              }); // End of set callback for price updates

            } catch (err) {
              console.error("SSE Data Parsing Error:", err, "Raw data:", event.data);
              set({ error: 'Failed to parse stock data' }); // Update error state if parsing fails
            }
          }; // End of onmessage


          // 'error' event: Connection error or closure
          eventSource.onerror = (event) => {
            console.error("⚠️ SSE EventSource error detected:", event);

            // Check the event type or readyState to differentiate initial connection errors vs runtime errors/closures
            // EventSource.CLOSED (2) means connection was closed
            // EventSource.CONNECTING (0) might indicate a failed initial connection or reconnect attempt
            // EventSource.OPEN (1) would be unexpected here

            // Attempt to close the connection explicitly if it's not already in a closing/closed state
             const es = get().eventSource; // Get the current stored ES instance
             if (es && es.readyState !== EventSource.CLOSED) {
                 console.log(`Closing SSE connection due to error. ReadyState: ${es.readyState}`);
                 es.close(); // This might trigger onclose, but onerror usually comes first
             }

            // Calculate next reconnect delay with exponential backoff
            const currentDelay = get().reconnectDelay;
            const nextDelay = Math.min(currentDelay * 2, get().maxReconnectDelay);

            console.log(`SSE connection lost. Scheduling reconnect in ${currentDelay / 1000}s. Next attempt delay: ${nextDelay / 1000}s`);

            // Update status and store details for reconnect
            set({
              connectionStatus: 'disconnected', // Mark as disconnected
              error: 'Connection lost, attempting to reconnect...', // Set a user-facing error message
              eventSource: null, // Nullify the invalid/closed event source instance
              reconnectDelay: nextDelay, // Update delay for the next attempt
              reconnectTimer: null // Clear any *previous* timer reference before setting a new one
            });

            // Set a timer to attempt reconnection after the calculated delay
            const timer = setTimeout(() => {
              console.log(`🔁 Attempting to reconnect to SSE...`);
              get().connectToSSE(); // Call the connect action again using get()
            }, currentDelay);

            // Store the new timer reference in state
            set({ reconnectTimer: timer });
          }; // End of onerror

          // EventSource also has an 'onclose' event, but 'onerror' often fires first
          // and handling reconnect there covers most cases. You could add an onclose
          // if you need specific logic when the server initiates a clean close.
          // eventSource.onclose = () => {
          //   console.log('SSE connection closed by server.');
          //   // onError should ideally handle the state update and reconnect logic,
          //   // but you could add specific cleanup here if needed.
          // };


        } catch (err) {
          // Error during initial EventSource setup (e.g., invalid URL, immediate network error)
          console.error("❌ Failed to establish SSE connection during initial setup:", err);
          // Clear any timer set *before* the try block if the setup failed immediately
           const timer = get().reconnectTimer;
           if (timer) {
               clearTimeout(timer);
           }
          set({
            connectionStatus: 'error', // Indicate a hard error establishing connection
            error: 'Failed to establish connection to server.',
            eventSource: null, // Ensure eventSource is null
            reconnectTimer: null // Ensure timer is null
          });
        }
      }, // End of connectToSSE action

      // Action to manually disconnect the SSE connection
      disconnectSSE: () => {
        const { eventSource, reconnectTimer } = get();

        // Close the connection if it's open or connecting
        if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
            console.log("Disconnecting SSE.");
             // Remove listeners before closing to prevent errors triggering reconnect on explicit disconnect
            // This is a bit tricky with EventSource; storing listeners might be needed for robust removal.
            // As a simpler approach, ensure the onerror/onmessage handlers check the connectionStatus before acting.
            eventSource.close();
        }
        // Clear any pending reconnect timers
        if (reconnectTimer) {
            console.log("Clearing reconnect timer on explicit disconnect.");
            clearTimeout(reconnectTimer);
        }

        // Reset state related to connection
        set({
          connectionStatus: 'disconnected',
          eventSource: null,
          reconnectTimer: null,
          error: null // Clear any connection error message
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
      // Versioning is good practice for persistence if your state structure changes
      // version: 1,
      // migrate: (persistedState, version) => {
      //   if (version === 0) {
      //     // migration from version 0 to 1
      //   }
      //   return persistedState
      // },
    }
  ) // End of persist middleware
); // End of create

export default useStockStore;