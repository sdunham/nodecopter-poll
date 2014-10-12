/**
 * PolloptionController
 *
 * @description :: Server-side logic for managing polloptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	vote: function(req, res){
		//Load the polloption being voted on and increase its votes property by 1
        Polloption.findOne(req.param('option_id')).exec(function foundPolloption(err, polloption){
            if(err){
                return err;
            }
            if(polloption){
                polloption.votes = polloption.votes + 1;
                polloption.save(function(err,s){
                    if(err){
                        return err;
                    }
                    Polloption.publishUpdate(s.id, {votes:s.votes, datapos: req.param('data_pos'), pollid: s.parentPoll.id});
                });
            }
        });
        
    }
};

