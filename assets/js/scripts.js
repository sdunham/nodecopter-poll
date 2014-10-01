$(document).ready(function(){
    if(pollData){
        Chart.defaults.global.responsive = true;
        var ctx = document.getElementById("poll_chart").getContext("2d");
        pollChart = new Chart(ctx).Bar(pollData);
        
        //Example Update Code
        //pollChart.datasets[0].bars[2].value = 50;
        //pollChart.update();
    }
});