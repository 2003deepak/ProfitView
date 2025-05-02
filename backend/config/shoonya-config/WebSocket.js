let web_socket = require("ws");

let triggers = {
     "open": [],
     "quote": [],
     "order": [],
     "error": [],
     "close": []
};

let { API } = require("./config");

let WebSocketClient = function (cred, params) {
     let self = this;

     let ws = null,
         apikey = cred.apikey,
         url = cred.url,
         timeout = API.heartbeat || 3000;

     this.connect = function (params, callbacks) {
          return new Promise((resolve, reject) => {
               if (!apikey || !url) return reject("apikey or url is missing");

               this.set_callbacks(callbacks);

               ws = new web_socket(url, [], { rejectUnauthorized: false });

               ws.onopen = function () {
                    // Heartbeat ping
                    setInterval(() => {
                         ws.send('{"t":"h"}');
                    }, timeout);

                    // Send connection auth message
                    let values = {
                         "t": "c",
                         "uid": params.uid,
                         "actid": params.actid,
                         "susertoken": params.apikey,
                         "source": "API"
                    };
                    ws.send(JSON.stringify(values));
                    resolve();
               };

               ws.onmessage = function (evt) {
                    try {
                         let result = JSON.parse(evt.data);

                         switch (result.t) {
                              case 'ck':
                                   trigger("open", [result]);
                                   break;

                              case 'tk':
                              case 'tf':
                              case 'dk':
                              case 'df':
                                   // Send only if full quote data is present
                                   if (result.lp) {
                                        trigger("quote", [result]);
                                   } 
                                   break;

                              case 'om':
                                   trigger("order", [result]);
                                   break;

                              default:
                                   console.debug("📭 Unknown message type received:", result);
                                   break;
                         }

                    } catch (err) {
                         console.error("❌ WebSocket parse error:", err);
                    }
               };

               ws.onerror = function (evt) {
                    console.log("WebSocket error:", evt);
                    trigger("error", [JSON.stringify(evt.data)]);
                    self.connect();  // Optional: auto-reconnect
                    reject(evt);
               };

               ws.onclose = function (evt) {
                    console.log("🔌 WebSocket closed");
                    trigger("close", [JSON.stringify(evt.data)]);
               };
          });
     };

     this.set_callbacks = function (callbacks) {
          if (callbacks.socket_open) this.on('open', callbacks.socket_open);
          if (callbacks.socket_close) this.on('close', callbacks.socket_close);
          if (callbacks.socket_error) this.on('error', callbacks.socket_error);
          if (callbacks.quote) this.on('quote', callbacks.quote);
          if (callbacks.order) this.on('order', callbacks.order);
     };

     this.send = function (data) {
          if (ws && ws.readyState === 1) {
               ws.send(data);
          } else {
               console.warn("🔴 WebSocket is not open. Message not sent.");
          }
     };

     this.on = function (e, callback) {
          if (triggers.hasOwnProperty(e)) {
               triggers[e].push(callback);
          }
     };

     this.close = function () {
          if (ws) ws.close();
     };
};

// Trigger event callbacks
function trigger(e, args) {
     if (!triggers[e]) return;
     for (let i = 0; i < triggers[e].length; i++) {
          triggers[e][i].apply(triggers[e][i], args || []);
     }
}

module.exports = WebSocketClient;
