// wsHook loaded wsHook.js
// Define the 'onSend' and 'onMessage' Event Listeners from wsHook once
describe('Simple tests using the WebSocket object', function () {
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

  describe('After Sending', function () {
    it('hook in passively', function (done) {
      wsHook.after = function (event) {
        expect(event.data).to.equal('After: Passively Hooking')
        return event
      }
      wsClient.send('After: Passively Hooking')
      wsClient.onmessage = function (m) {
        done()
      }
    })

    it('hook in actively', function (done) {
      wsHook.after = function (event) {
        event.data = 'After: Actively Hooking and Modified'
        return event
      }
      wsClient.send('After: Actively Hooking')

      wsClient.onmessage = function (e) {
        expect(e.data).to.equal('After: Actively Hooking and Modified')
        done()
      }
    })
  })
})
