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

  sails.os = require('os');


  var examplePoll = [
    {
        title: "Example: What do you want for lunch?",
        description: "A default poll to show how this thing works.",
        options: [
            {
                label: "Pizza",
                votes: 0
            },
            {
                label: "Sandwiches",
                votes: 0
            },
            {
                label: "Soup",
                votes: 0
            },
            {
                label: "Pasta",
                votes: 0
            },
            {
                label: "Leftovers",
                votes: 0
            },
            {
                label: "ICE CREAM",
                votes: 0
            }
        ]
    }
  ];
        
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
