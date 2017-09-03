// Load wsHook.js
// Define the 'before' and 'after' hooks as you wish.

wsHook.before = function(data, url) {
    console.log("Sending message to " + url + " : " + data);
    data = 'modified data';
    console.log("Modifying message to " + url + " : " + data);

    return data;
}

wsHook.after = function(messageEvent, url) {
    console.log("Received message from " + url + " : " + messageEvent.data);
    messageEvent.data = '123xss'
    console.log("Received message from " + url + " : " + messageEvent.data);
    return messageEvent;
}

var wsClient = new WebSocket("ws://localhost:8080");

wsClient.onopen = function() {
  wsClient.send("Echo this");
}

// wsClient.onmessage = function(event) {
//   console.log(event.data)
//   console.log(event)
// }


wsClient.addEventListener('message', function(event) {
  console.log(event.data)
  console.log(event)
})
