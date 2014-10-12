// Attach a listener which fires when a connection is established:
io.socket.on('connect', function socketConnected() {
    console.log('connected');
    
    //When a poll socket message is received
    io.socket.on('poll', function messageReceived(message) {
        console.log('Poll Message:');
        console.log(message);
        
        //Increment the poll count in the nav bar
        var intCurrentPollCount = parseInt($('#poll_list_count').html());
        $('#poll_list_count').html(intCurrentPollCount+1)
        
        //Add the new poll to the list if in that view
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

    //Subscribe to the existing Poll model instances
    io.socket.get("/poll", function(resData, jwres) {
        console.log('/poll');
        console.log(resData);
        $('#poll_list_count').html(resData.length);
    });
    
    //If in the show view
    if('undefined' !== typeof pollDataPie){//pollData
        //When a polloption socket message is received
        io.socket.on('polloption', function messageReceived(message) {
            console.log('Polloption Message:');
            console.log(message);

            //Update the poll chart, and regenerate it if needed
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

        //Subscribe to the existing Polloption model instances
        io.socket.get("/polloption", function(resData, jwres) {
            console.log('/polloption');
            console.log(resData);
        });
    }
});