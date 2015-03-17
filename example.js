// Load wsHook.js

// Define the 'onSend' and 'onMessage' Event Listeners from wsHook

wsHook.onSend = function(e) {
    console.log("Message Sent to " + e.url + " : " + e.data);
}
wsHook.onMessage = function(e) {
    console.log("Message recieved from " + e.url + " : " + e.data);
}

var wsClient = new WebSocket("wss://echo.websocket.org");

wsClient.onopen = function() {
    wsClient.send("Echo this");
}

var anotherWsClient = new WebSocket("wss://echo.websocket.org");

anotherWsClient.onopen = function() {
  anotherWsClient.send("Another Echo Message");
}
