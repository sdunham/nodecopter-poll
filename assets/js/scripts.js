$(document).ready(function(){
    if('undefined' !== typeof pollData){
        Chart.defaults.global.responsive = true;
        var ctx = document.getElementById("poll_chart").getContext("2d");
        pollChart = new Chart(ctx).Bar(pollData);
    }
    
    $('a.poll_option_vote').click(function(e){
        e.preventDefault();
        var option_id = $(this).data('polloptionid');
        var option_pos = $(this).data('datapos');

        //Send a vote request via a socket post
        //TODO: This probably isn't a good way to do this...
        io.socket.get('/csrfToken', {}, function(resData){
            io.socket.post('/polloption/vote', {option_id: option_id, data_pos: option_pos, _csrf: resData._csrf});
        });

        //Update the local chart
        pollChart.datasets[0].bars[option_pos].value = pollChart.datasets[0].bars[option_pos].value + 1;
        pollChart.update();
    });

    $('a#leave_poll_details').click(function(e){
        //io.socket.get('/poll/leave');
    });
});