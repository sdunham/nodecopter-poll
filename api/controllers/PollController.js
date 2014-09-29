/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	list: function(req, res){
		//Find all the Polls in the system, sorted descending based on the date/time created
		Poll.find({sort: 'createdAt DESC'}, function foundPolls(err, polls){
			if(err){
				return err;
			}
			//Pass the Polls to the List view and load it
			res.view({
				polls: polls
			});
		});
	},
	'new': function(req, res){
		//Load the New view
		res.view();
	},
	create: function(req, res){
		//Create the new Poll
		Poll.create(req.params.all(), function createdPoll(err, poll){
			//Return the error if one occurs
			if(err){
				return err;
			}
			
			//Get the Polloption labels
			var poll_options = req.param('poll_options');
			for(var i=0; i<poll_options.length; i++){
				if(poll_options[i] != ''){
					//If the option was filled out, create a new Polloption and associate it with the new Poll
					Polloption.create({label:poll_options[i], parentPoll:poll.id}, function createdPollOption(err, pollOption){
						//Return the error if one occurs
						if(err){
							return err;
						}
					});
				}
			}

			//Redirect to the list of polls when done
			res.redirect('/poll/list/');
		});
	}
};

