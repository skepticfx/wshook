# wshook
Easily hook into WebSocket request and response

## Usage

#### Include in your WebSocket client

```html
<script src='wsHook.js'></script>
```

#### Add the EventListeners
Define your custom 'onSend' and 'onMessage' event Listeners on the globally exposed `wsHook` object.

```javascript
wsHook.onSend = function(e) {
    console.log("Message Sent to " + e.url + " : " + e.data);
}
wsHook.onMessage = function(e) {
    console.log("Message recieved from " + e.url + " : " + e.data);
}

```

#### Let your program play with WebSockets
```javascript
var wsClient = new WebSocket("wss://echo.websocket.org");

wsClient.onopen = function() {
    wsClient.send("Echo this");
}

var anotherWsClient = new WebSocket("wss://echo.websocket.org");

anotherWsClient.onopen = function() {
  anotherWsClient.send("Another Echo Message");
}
```

## Used by

* [**Hookish**](https://github.com/skepticfx/hookish): Hooks in to interesting functions and helps reverse the web app faster.

## TODO

* Implement simplistic EventEmitter instead of a heavy library.

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
