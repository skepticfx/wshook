// Load wsHook.js
// Define the 'before' and 'after' hooks as you wish.

wsHook.before = function (data, url) {
  data = 'modified data'
  return data
}

wsHook.after = function (messageEvent, url) {
  messageEvent.data = '-- data modified -- ' + messageEvent.data + ' --'
  return messageEvent
}

var wsClient = new WebSocket('ws://localhost:8080')

wsClient.onopen = function () {
  wsClient.send('Echo this')
}

wsClient.onmessage = function (event) {
  console.log(event.data)
}
