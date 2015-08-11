// Load wsHook.js
// Define the 'before' and 'after' hooks as you wish.

wsHook.before = function(data, url) {
  data += "_modified";
  console.log("Modifying data to " + data);
  return data;
}

var wsClient = new WebSocket("wss://echo.websocket.org");
wsClient.onopen = function() {
  wsClient.send("Echo this");
}

wsClient.onmessage = function(e) {
  console.log(e);
}