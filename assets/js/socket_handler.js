// Attach a listener which fires when a connection is established:
io.socket.on('connect', function socketConnected() {
    console.log('connected');
    /*io.socket.on("poll", function(event){
        console.log('Test 1');
        console.log(event);
    });*/
    
    io.socket.on('poll', function messageReceived(message) {
        console.log(message);
    });

    io.socket.get("/poll", function(resData, jwres) {
        console.log('Test 2');
        console.log(resData);
    });
});