// Load wsHook.js
// Define the 'before' and 'after' hooks as you wish.

wsHook.before = function (data, url) {
  data = 'modified data while sending'
  return data
}

wsHook.after = function (messageEvent, url) {
  messageEvent.data = messageEvent.data + ' and receiving'
  return messageEvent
}

var wsClient = new WebSocket('ws://localhost:8080')

wsClient.onopen = function () {
  wsClient.send('Echo this')
}

wsClient.onmessage = function (event) {
  console.log(event.data)
}
