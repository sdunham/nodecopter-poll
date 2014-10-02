/**
 * PolloptionController
 *
 * @description :: Server-side logic for managing polloptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	vote: function(req, res){
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
                });
            }
        });
        
    }
};

