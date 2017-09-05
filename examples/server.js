const WebSocket = require('ws')

console.log('open the file ' + process.cwd() + '/examples/example.html in a browser')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection (ws) {
  console.log('connection')
  ws.on('message', function incoming (message) {
    console.log('received: %s', message)
    ws.send(message)
    console.log('echoed back...')
  })

})
