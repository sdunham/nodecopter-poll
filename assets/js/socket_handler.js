// Attach a listener which fires when a connection is established:
io.socket.on('connect', function socketConnected() {
    console.log('connected');
    
    io.socket.on('poll', function messageReceived(message) {
        console.log('Poll Message:');
        console.log(message);
        var objPollList = $('#poll_list');
        var now = new Date();
        if(objPollList.length){
            objPollList.prepend('<li data-id="'+message.data.id+'" class="list-group-item"><a href="/poll/show/'+message.data.id+'">'+message.data.title+'</a> ('+now+')</li>');
        }
        else{
            var list_item = '<li data-id="'+message.data.id+'"><a href="/poll/show/'+message.data.id+'">'+message.data.title+'</a> ('+now+')</li>';
            $('#poll_list_contain').html('<ul id="poll_list" class="list-group">'+list_item+'</ul>');
        }
    });

    io.socket.get("/poll", function(resData, jwres) {
        console.log('/poll');
        console.log(resData);
    });
    
    if('undefined' !== typeof pollDataPie){//pollData
        io.socket.on('polloption', function messageReceived(message) {
            console.log('Polloption Message:');
            console.log(message);

            if(pollChart.intPollId == message.data.pollid){
                pollChart.segments[message.data.datapos].value = pollChart.segments[message.data.datapos].value + 1;
                pollChart.update();
            }
        });

        io.socket.get("/polloption", function(resData, jwres) {
            console.log('/polloption');
            console.log(resData);
        });
    }
});