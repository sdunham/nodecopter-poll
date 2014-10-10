// Attach a listener which fires when a connection is established:
io.socket.on('connect', function socketConnected() {
    console.log('connected');
    
    io.socket.on('poll', function messageReceived(message) {
        console.log('Poll Message:');
        console.log(message);
        
        var intCurrentPollCount = parseInt($('#poll_list_count').html());
        $('#poll_list_count').html(intCurrentPollCount+1)
        
        var objPollList = $('#poll_list');
        var objPollListContain = $('#poll_list_contain');
        var now = new Date();
        if(objPollList.length){
            objPollList.prepend('<li data-id="'+message.data.id+'" class="list-group-item"><a href="/poll/show/'+message.data.id+'">'+message.data.title+'</a> ('+now.toLocaleDateString() + ', ' + now.toLocaleTimeString()+')</li>');
        }
        else if(objPollListContain.length){
            var list_item = '<li data-id="'+message.data.id+'"><a href="/poll/show/'+message.data.id+'">'+message.data.title+'</a> ('+now.toLocaleDateString() + ', ' + now.toLocaleTimeString()+')</li>';
            $('#poll_list_contain').html('<ul id="poll_list" class="list-group">'+list_item+'</ul>');
        }
    });

    io.socket.get("/poll", function(resData, jwres) {
        console.log('/poll');
        console.log(resData);
        $('#poll_list_count').html(resData.length);
    });
    
    if('undefined' !== typeof pollDataPie){//pollData
        io.socket.on('polloption', function messageReceived(message) {
            console.log('Polloption Message:');
            console.log(message);

            if(pollChart.intPollId == message.data.pollid){
                if(pollChart.blnRegen){
                    pollChart.destroy();
                    var ctx = document.getElementById("poll_chart_pie").getContext("2d");
                    pollChart = new Chart(ctx).Pie(pollDataPie);
                    pollChart.segments[message.data.datapos].value = message.data.votes;
                    pollChart.update();
                    pollChart.blnRegen = false;
                    pollChart.intPollId = message.data.pollid;
                }
                else{
                    pollChart.segments[message.data.datapos].value = message.data.votes;
                    pollChart.update();
                }
            }
        });

        io.socket.get("/polloption", function(resData, jwres) {
            console.log('/polloption');
            console.log(resData);
        });
    }
});