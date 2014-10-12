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
        
        //Disable the voting buttons for 10 seconds so people don't go totally cray-cray
        disableVotingTemporarily();
    });
});

//Disable all poll option voting buttons and display an alert. Enable the button and remove the alert after 10 seconds.
var disableVotingTemporarily = function(){
    $('a.poll_option_vote').attr('disabled',true);
    var strVotingDisabledAlert = '<div class="alert alert-success alert-dismissible" role="alert" id="voting_disabled_alert">\
        <button type="button" class="close" data-dismiss="alert">\
            <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>\
        </button>\
        <strong>Thanks for casting your vote!</strong> You\'ll be able to vote again in 10 seconds.\
    </div>';
    $('#poll_option_contain').prepend(strVotingDisabledAlert);
    setTimeout(function(){
        $('#voting_disabled_alert').remove();
        $('a.poll_option_vote').attr('disabled',false);
    }, 10000);
}