// wsHook loaded wsHook.js
// Define the 'onSend' and 'onMessage' Event Listeners from wsHook once
describe('Before Hooks', function () {
  var wsClient
  before(function (done) {
    wsClient = new WebSocket('wss://echo.websocket.org')
    wsClient.onopen = function () {
      done()
    }
  })

  beforeEach(function () {
    wsHook.resetHooks()
  })

  describe('Before Sending', function () {
    it('hook in passively', function (done) {
      wsHook.before = function (data) {
        expect(data).to.equal('Before: Passively Hooking')
        return data
      }
      wsClient.send('Before: Passively Hooking')
      wsClient.onmessage = function () {
        done()
      }
    })

    it('hook in actively', function (done) {
      wsHook.before = function (data) {
        data = 'Before: Actively Hooking and Modified'
        return data
      }
      wsClient.send('Before: Actively Hooking')
      wsClient.onmessage = function (e) {
        expect(e.data).to.equal('Before: Actively Hooking and Modified')
        done()
      }
    })
  })
})
