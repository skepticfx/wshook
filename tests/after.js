// wsHook loaded wsHook.js
// Define the 'onSend' and 'onMessage' Event Listeners from wsHook once
describe('After Hooks & Resend', function () {
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

  describe('After Sending', function () {
    it('hook in passively', function (done) {
      wsHook.after = function (event) {
        expect(event.data).to.equal('After: Passively Hooking')
        return event
      }
      wsClient.send('After: Passively Hooking')
      wsClient.onmessage = function (m) {
        console.log(m)
        done()
      }
    })

    it('hook in actively', function (done) {
      wsHook.after = function (event) {
        event.data = 'After: Actively Hooking and Modified'
        return event
      }

      wsClient.onmessage = function (e) {
        expect(e.data).to.equal('After: Actively Hooking and Modified')
        done()
      }

      wsClient.send('After: Actively Hooking')
    })
  })

  describe('After hook intercepts and sends data, but cancels bubbling down', function () {
    it('hook in actively', function (done) {
      this.timeout(6000)
      var thisShouldNeverBeCalled = true
      wsHook.after = function (event) {
        event.data = 'After: Actively Hooking and Modified'
        return null
      }

      wsClient.onmessage = function (e) {
        thisShouldNeverBeCalled = false
      }

      wsClient.send('After: Actively Hooking')

      setTimeout(function () {
        expect(thisShouldNeverBeCalled).to.equal(true)
        done()
      }, 2000)
    })
  })
})
