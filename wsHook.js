/* wsHook.js
 * https://github.com/skepticfx/wshook
 * Reference: http://www.w3.org/TR/2011/WD-websockets-20110419/#websocket
 */

var wsHook = {};
(function() {
  // wsHook global
  wsHook.mode = "websocket"; // websocket, socketio
  wsHook.enabled = false; // true, false

  wsHook.socketIoHasBeenHookedOnceBefore = false;
  wsHook.socketio = {};
  wsHook.socketio.emit = function(){};
  wsHook.socketio.on = function(){};
  wsHook.socketio.once = function(){};
  wsHook.socketio.whitelistedEvents = ["connect", "disconnect", "reconnect_attempt", "reconnecting"];


  var before = function(data, url) {
    return data;
  }
  var after = function(e, url) {
    return e;
  }

  wsHook.before = function(func){
    before = func;
  }

  wsHook.after = function(func){
    after = func;
  }

  wsHook.resetHooks = function() {
    wsHook.before(function(data, url){
      return data;
    });
    wsHook.after(function(e, url){
      return e;
    });

    //wsHook.resetSocketIoHooks();
  }

  wsHook.enable = function() {
    wsHook.enabled = true;
    wsHook.resetHooks();
  }

  wsHook.disable = function() {
    wsHook.enabled = false;
    wsHook.resetHooks();
  }

  wsHook.hookRawWebSocket = function(){
    wsHook.resetHooks();
    wsHook.mode = "websocket";
  }

  wsHook.hookSocketio = function(){var count =0;
    if(! wsHook.enabled) return;
    wsHook.resetHooks();
    wsHook.mode = "socketio";
    wsHook.socketIoHasBeenHookedOnceBefore = true;
    // detect socketio
    if(typeof io !== 'undefined' && io.Socket && io.Manager){
      wsHook.socketio.emit = io.Socket.prototype.emit;
      wsHook.socketio.on = io.Socket.prototype.on;
      wsHook.socketio.once = io.Socket.prototype.once;

      console.warn("Hooking in to SocketIO library");

      // Before
      io.Socket.prototype.emit = function(){console.log("emitcalled : " + ++count)
        var eventName = arguments[0];console.log("EventName:" + eventName)
        if(wsHook.enabled && wsHook.mode === 'socketio' && (wsHook.socketio.whitelistedEvents.indexOf(eventName.toString()) === -1)){
          arguments[1]= before(arguments[1], this.io.uri) || arguments[1];
        }
         wsHook.socketio.emit.apply(this, arguments);
      };

      // After
      /*
      io.Socket.prototype.on = function(){
        var _sock = this;
        var func = arguments[1];
        arguments[1] = function(){
          arguments[0] = after(arguments[0], _sock.io.uri) || arguments[0];
          return func.apply(_sock, arguments);
        };
        return wsHook.socketio.on.apply(this, arguments);
      }

      io.Socket.prototype.once = function(){alert('not be called')
        var _sock = this;
        var func = arguments[1];
        arguments[1] = function(){
          arguments[0] = after(arguments[0], _sock.io.uri) || arguments[0];
          return func.apply(_sock, arguments);
        };
        wsHook.socketio.once.apply(this, arguments);
      }*/

    } else {
      console.warn("Cannot hook SocketIO: SocketIO library not detected");
    }

  }

  wsHook.resetSocketIoHooks = function(){alert('not called in this experiment')
    // detect socketio
    if(! wsHook.enabled) return;
    if(wsHook.socketIoHasBeenHookedOnceBefore && typeof io !== 'undefined' && io.Socket && io.Manager){

      console.warn("Resetting SocketIO hooks");

      // Before
      io.Socket.prototype.emit = function(){
        var eventName = arguments[0];console.log("EventName:" + eventName)
        if(wsHook.enabled && wsHook.mode === 'socketio' && (wsHook.socketio.whitelistedEvents.indexOf(eventName.toString()) === -1)){
          arguments[1]= before(arguments[1], this.io.uri) || arguments[1];
        }
         return wsHook.socketio.emit.apply(this, arguments);
      };


      // After
      io.Socket.prototype.on = function(){
        var _sock = this;
        var func = arguments[1];
        arguments[1] = function(){
          arguments[0] = after(arguments[0], _sock.io.uri) || arguments[0];
          return func.bind(_sock, arguments);
        };
        return wsHook.socketio.on.apply(this, arguments);
      }

      io.Socket.prototype.once = function(){
        var _sock = this;
        var func = arguments[1];
        arguments[1] = function(){
          arguments[0] = after(arguments[0], _sock.io.uri) || arguments[0];
          return func.bind(_sock, arguments);
        };
        return wsHook.socketio.once.apply(this, arguments);
      }

    } else {
      console.warn("Error: Invalid SocketIO Hook state");
    }
  }

  // Mutable MessageEvent.
  // Subclasses MessageEvent and makes data, origin and other MessageEvent properites mutatble.
  function MutableMessageEvent(o) {
    this.bubbles = o.bubbles || false;
    this.cancelBubble = o.cancelBubble || false;
    this.cancelable = o.cancelable || false;
    this.currentTarget = o.currentTarget || null;
    this.data = o.data || null;
    this.defaultPrevented = o.defaultPrevented || false;
    this.eventPhase = o.eventPhase || 0;
    this.lastEventId = o.lastEventId || "";
    this.origin = o.origin || "";
    this.path = o.path || new Array(0);
    this.ports = o.parts || new Array(0);
    this.returnValue = o.returnValue || true;
    this.source = o.source || null;
    this.srcElement = o.srcElement || null;
    this.target = o.target || null;
    this.timeStamp = o.timeStamp || null;
    this.type = o.type || "message";
    this.__proto__ = o.__proto__ || MessageEvent.__proto__;
  }

  // Whitelisted data for WebSocket protocol and libraries.
  function isWhitelistedData(data){
    var whitelist = [
      '2probe',
      '3probe'
    ];
    return (whitelist.indexOf(data.toString()) !== -1);
  }

  var _WS = WebSocket;
  WebSocket = function(url, protocols) {
    var WSObject;
    this.url = url;
    this.protocols = protocols;
    if (!this.protocols)
      WSObject = new _WS(url);
    else
      WSObject = new _WS(url, protocols);

    var _send = WSObject.send;
    var _wsobject = this;
    WSObject.send = function(data) {
      if(wsHook.enabled && wsHook.mode === "websocket"){
        if(!isWhitelistedData(data)){
          data = before(data, WSObject.url) || data;
        } else {
          console.warn("Not hooking a protocol/library specific data: " + data)
        }
      }
      _send.apply(this, arguments);
    }

    // Events needs to be proxied and bubbled down.
    var onmessageFunction;
    WSObject.__defineSetter__('onmessage', function(func) {
      onmessageFunction = func;
    });
    WSObject.addEventListener('message', function(e) {
      if(wsHook.enabled && wsHook.mode === "websocket"){
        if(!isWhitelistedData(e.data)){
          e = after(new MutableMessageEvent(e), this.url) || e;
          e = new MessageEvent(e.type, e);
        }
      }
      onmessageFunction.apply(this, [e])
    });

    return WSObject;
  }
})();
