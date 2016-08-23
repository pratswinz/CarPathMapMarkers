// Dependencies
var mongoose        = require('mongoose');
var User            = require('./model.js');


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err) {
                res.send(err);
            } else {
                // If no errors are found, it responds with a JSON of all users
                res.json(users);
            }
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){
		
		console.log('in app route.js:'+JSON.stringify(req.body));
        // Creates a new User based on the Mongoose schema and the post body
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function(err){
            if(err){
				console.log(JSON.stringify(err));
				res.send(err);
			}
            else{
				JSON.stringify('req.body::::'+JSON.stringify(req.body));
                // If no errors are found, it responds with a JSON of the new user
                res.json(req.body);
			}
        });
    });
};
