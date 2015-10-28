// wsHook loaded wsHook.js
// Define the 'onSend' and 'onMessage' Event Listeners from wsHook once
describe("Tests using the Socket.io library", function() {

  var socket;
  before(function(done){
    wsHook.enable();
    //wsHook.hookSocketio();
    done();
  });

  beforeEach(function(done){
    socket = io('http://socketio.damnvulnerable.me/', { transports: ['websocket'] });
    done();
  });

  afterEach(function(done){
    done();
  });

  describe("Before Sending", function() {
    it("hook in passively", function(done) {
      wsHook.before(function(data, url){console.log(1);
        expect(data).to.equal("Before: Passively Hooking");
        return data;
      });
      socket.emit("ping", "Before: Passively Hooking");
      socket.on("pong", function(data){console.log(2); console.log("data="+data)
        done();
      });
    });

    it("hook in actively", function(done) {
      wsHook.before(function(data, url){console.log(3);console.log("data=" + data);
        data = "Before: Actively Hooking and Modified";
        return data;
      });
      socket.emit("ping", "Before: Actively Hooking");
      socket.on("pong", function(data){console.log(4);
        expect(data).to.equal("Before: Actively Hooking and Modified");
        done();
      });
    })

  });


  describe("After Sending", function() {
    it("hook in passively", function (done) {
      wsHook.after(function (data, url) {
        console.log(5);
        expect(data).to.equal("After: Passively Hooking");
      });
      socket.emit("ping", "After: Passively Hooking");
      socket.on("pong", function (data) {
        console.log(6);
        done();
      });
    });

  });/*
    it("hook in actively", function(done) {
      wsHook.after(function(data, url){console.log(7);
        data = "After: Actively Hooking and Modified";
        return data;
      });
      console.log(socket.emit("ping", "After: Actively Hooking"));
      socket.on("pong", function(data){console.warn(data); console.log(8);
        expect(data).to.equal("After: Actively Hooking and Modified");
        done();
      });
    })

  })*/

});


/*
 socket.on('pong', function (data) {
 if(data.hello && data.hello === 'Send this back'){
 done();
 } else {
 socket.emit('ping', { hello: 'Send this back' });
 }
 });
 */