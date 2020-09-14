# wsHook
#### Easily intercept and modify WebSocket requests and message events.


#### ToDo
Figure out if we still need immutable MessageEvent

## Usage

#### 1. Download and include `wsHook.js` in your WebSocket client

```html
<script src='wsHook.js'></script>
```

#### 2. Define the `before` and `after` hooks
Define your custom `before` and `after` hooks on the globally exposed `wsHook` object.

```javascript
wsHook.before = function(data, url) {
    console.log("Sending message to " + url + " : " + data);
}

// Make sure your program calls `wsClient.onmessage` event handler somewhere.
wsHook.after = function(messageEvent, url, wsObject) {
    console.log("Received message from " + url + " : " + messageEvent.data);
    return messageEvent;
}

// if you do not want to propagate the MessageEvent further down, just return null
wsHook.after = function(messageEvent, url, wsObject) {
 console.log("Received message from " + url + " : " + messageEvent.data);
 // This example can ping-pong forever, so maybe use some conditions
 wsObject.send("Intercepted and sent again")
 return null;
}

```

#### 3. Let your program play with WebSockets
```javascript
var wsClient = new WebSocket("wss://echo.websocket.org");

wsClient.onopen = function() {
    wsClient.send("Echo this");
}

wsClient.onmessage = function(e){
  console.log(e);
}
```
## API
### `wsHook.before` - function(data, url):
Invoked just before calling the actual WebSocket's `send()` method.

This method must return `data` which can be modified as well.

### `wsHook.after` - function(event, url, wsObject):
Invoked just after receiving the `MessageEvent` from the WebSocket server and before calling the WebSocket's `onmessage` Event Handler.

This method must return `event` whose properties can be modified as well. You might be interested in modiying, `event.data` or `event.origin` usually.

The `wsObject` refers to the corresponding `WebSocket` object used. You can use this to send a message to the server. This allows one to fully hijack the WebSocket connection programatically. 

If you do not want the user's original `onmessage` event handler to be called, just return `null`.


## Overview
<img src="http://skepticfx.com/imgs/wshook.png">

## Example

```javascript
// Load wsHook.js
// Define the 'before' and 'after' hooks as you wish.

wsHook.before = function(data, url){
  data += "_modified";
  console.log("Modifying data to " + data);
  return data;
}

var wsClient = new WebSocket("wss://echo.websocket.org");
wsClient.onopen = function() {
  wsClient.send("Echo this");
}
wsClient.onmessage = function(e){
  console.log(e);
}

```

## Used by

* [**Hookish**](https://github.com/skepticfx/hookish): Hooks in to interesting functions and helps reverse the web app faster.

## TODO

* Test cases for common WebSocket libraries.

## License

The MIT License (MIT)

Copyright (c) 2015 Ahamed Nafeez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
