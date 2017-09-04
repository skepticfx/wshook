// Load wsHook.js
// Define the 'before' and 'after' hooks as you wish.

wsHook.before = function (data, url) {
  console.log('Sending message to ' + url + ' : ' + data)
  data = 'modified data'
  console.log('Modifying message to ' + url + ' : ' + data)

  return data
}

wsHook.after = function (messageEvent, url) {
  console.log('Received message from ' + url + ' : ' + messageEvent.data)
  messageEvent.data = '-- data modified -- ' + messageEvent.data + ' --'
  console.log('Received message from ' + url + ' : ' + messageEvent.data)
  return messageEvent
}

let wsClient = new WebSocket('ws://localhost:8080')

wsClient.onopen = function () {
  wsClient.send('Echo this')
}

// wsClient.addEventListener('message', function(event) {
//   console.log(event.data)
//   console.log(event)
// })

/* eslint-disable accessor-pairs */
let onmessageSetter = wsClient.__lookupSetter__('onmessage')
Object.defineProperty(wsClient, 'onmessage', {
  set: function () {
    console.log('called onmessage')
    console.log(arguments)
    onmessageSetter.apply(this, arguments)
  }

})

// wsClient.__defineSetter__('onmessage', function(func){
//   return function() {
//     console.log(123);
//     return func.apply(this, arguments)
//   }
// })

wsClient.onmessage = function (event) {
  console.log(event.data)
  console.log(event)
}

console.log(wsClient.onmessage)
