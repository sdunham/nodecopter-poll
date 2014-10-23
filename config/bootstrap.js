/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  sails.arDrone = require('ar-drone');
  sails.droneclient  = sails.arDrone.createClient({ip:'192.168.1.200'});


  var droneActionInterval = setInterval(function(){selectDroneAction()}, 10000);
  function selectDroneAction(){
    Polloption.find().exec(function (err, polloptions){
      var intCurLeaderId = 0;
      var intCurLeaderVotes = 0;
      var strDroneAction = '';
      while(polloptions.length){
        var objPolloption = polloptions.pop();
        if(objPolloption.votes > intCurLeaderVotes){
          intCurLeaderVotes = objPolloption.votes;
          intCurLeaderId = objPolloption.id;
          strDroneAction = objPolloption.action;
        }
        objPolloption.votes = 0;
        objPolloption.save(function(err,s){
          console.log('Polloption '+s.id+' votes reset');
        });
      }

      if(intCurLeaderId > 0){
        switch(strDroneAction){
          case 'takeoff':
            sails.droneclient.takeoff();
            break;
          case 'land':
            sails.droneclient.land();
            break;
          case 'left':
            sails.droneclient.after(500, function(){this.counterClockwise(0.5)}).after(3000, function(){this.stop();});
            break;
          case 'right':
            sails.droneclient.after(500, function(){this.clockwise(0.5)}).after(3000, function(){this.stop();});
            break;
          case 'blink':
            sails.droneclient.animateLeds('blinkRed', 5, 2);
            break;
          case 'flip':
            sails.droneclient.animate('flipLeft', 1000);
            break;
        }
        console.log('And the winner is: Polloption '+intCurLeaderId+'!');
        Polloption.message(intCurLeaderId, {reset:true});
      }
    });
  }

  process.on('exit', function(code) {
    sails.droneclient.land();
    console.log('About to exit with code:', code);
  });

  process.on('uncaughtException', function(err) {
    sails.droneclient.land();
    console.log('Caught exception: ' + err);
  });


  //Load the node.js os module for use on the home view
  sails.os = require('os');

  //Define the default Poll and options
  var examplePoll = [
    {
	id: 1,
        title: "What do you want the drone to do next?!",
        description: "Vote for the drone's next action. Every 30 seconds the votes will be reset and the appropriate action will be taken.",
        options: [
            {
		action: "takeoff",
                label: "Take Off",
                votes: 0,
                datapos: 1
            },
            {
		action: "land",
                label: "Land",
                votes: 0,
                datapos: 2
            },
            {
		action: "left",
                label: "Spin Left",
                votes: 0,
                datapos: 3
            },
            {
		action: "right",
                label: "Spin Right",
                votes: 0,
                datapos: 4
            },
            {
		action: "blink",
                label: "Blink Lights",
                votes: 0,
                datapos: 5
            },
            {
		action: "flip",
                label: "DO A BARREL ROLL!",
                votes: 0,
                datapos: 6
            }
        ]
    }
  ];

  //Create the default Poll in none exist
  Poll.count().exec(function(err,count){
    if(err){
        Sails.log.error('Already have some data!');
        return cb(err);
    }
    if(count > 0){
        return cb();
    }
    else{
        Poll.create(examplePoll).exec(cb);
    }
  });
};
