// Dependencies
// -----------------------------------------------------
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var database        = require('./app/config');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();
var server  = require('http').createServer(app);


global.io      = require('socket.io').listen(server);
io.set('transports',['xhr-polling']);
//------------------
// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
mongoose.connect(database.localtest.url);

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

//----------
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
// ------------------------------------------------------
require('./app/routes.js')(app);

// Listen
// -------------------------------------------------------
//app.listen(port);
server.listen(port,function(){
	console.log('App listening on port: ' + port);
}); 


//------------------------
// Socket io connection 
//------------------------
io.on('connection', function(socket){
  console.log('a user connected');
 // socket.emit('my other event', { my: 'data' });
  //socket.on('disconnect', function(){
    //console.log('user disconnected');
  //});
  
});



//io.emit('message',{"AlarmName":"CPU_FAN_DOWN"});
