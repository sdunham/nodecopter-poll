// Attach a listener which fires when a connection is established:
io.socket.on('connect', function socketConnected() {
    console.log('connected');
    /*io.socket.on("poll", function(event){
        console.log('Test 1');
        console.log(event);
    });*/
    
    io.socket.on('poll', function messageReceived(message) {
        console.log('Poll Message:');
        console.log(message);
        var objPollList = $('#poll_list');
        var now = new Date();
        if(objPollList.length){
            objPollList.prepend('<li data-id="'+message.data.id+'"><a href="/poll/show/'+message.data.id+'">'+message.data.title+'</a> ('+now+')</li>');
        }
        else{
            var list_item = '<li data-id="'+message.data.id+'"><a href="/poll/show/'+message.data.id+'">'+message.data.title+'</a> ('+now+')</li>';
            $('#poll_list_contain').html('<ul>'+list_item+'</ul>');
        }
    });
    
    io.socket.on('polloption', function messageReceived(message) {
        console.log('Polloption Message:');
        console.log(message);

        //Update the chart when an update socket notification is received
        pollChart.datasets[0].bars[message.data.datapos].value = message.data.votes;
        pollChart.update();
    })

    io.socket.get("/poll", function(resData, jwres) {
        console.log('/poll');
        console.log(resData);
    });
    
    io.socket.get("/polloption", function(resData, jwres) {
        console.log('/polloption');
        console.log(resData);
    });
});