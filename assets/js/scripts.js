$(document).ready(function(){
    //If the poll data var is defined, create a pie chart with it
    if('undefined' !== typeof pollDataPie){
        Chart.defaults.global.responsive = true;
        var ctx = document.getElementById("poll_chart_pie").getContext("2d");
        pollChart = new Chart(ctx).Pie(pollDataPie);
        var blnRegen = true;
        $.each(pollDataPie, function(index,data){
            if(data.value > 0){
                blnRegen = false;
                return false;
            }
        });
        pollChart.intPollId = pollId;
        pollChart.blnRegen = blnRegen;
    }
    
    //Click on one of the poll option voting buttons to cast a vote
    $('a.poll_option_vote').click(function(e){
        e.preventDefault();
        var option_id = $(this).data('polloptionid');
        var option_pos = $(this).data('datapos');

        //Send a vote request via a socket post so other users' charts will be updated
        io.socket.get('/csrfToken', {}, function(resData){
            io.socket.post('/polloption/vote', {option_id: option_id, data_pos: option_pos, _csrf: resData._csrf});
        });

        //Update the local chart, regenerate it if needed
        if(pollChart.blnRegen){
            pollChart.destroy();
            var ctx = document.getElementById("poll_chart_pie").getContext("2d");
            pollChart = new Chart(ctx).Pie(pollDataPie);
            pollChart.segments[option_pos].value = pollChart.segments[option_pos].value + 1;
            pollChart.update();
            pollChart.blnRegen = false;
            pollChart.intPollId = pollId;
        }
        else{
            pollChart.segments[option_pos].value = pollChart.segments[option_pos].value + 1;
            pollChart.update();
        }
        
    });
});