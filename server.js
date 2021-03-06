var express = require('express');
var session = require('express-session');
var google = require("googleapis");
var googleAuth = require('google-auth-library');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config.js');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	}else {
		console.log("Connected to the database");
	}
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.use(session({secret:'123123',
		resave: false,
		saveUninitialized: true
}));

var api = require('./app/routes/api')(app, express, io);
app.use('/api', api);

app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/app/views/index.html');
	sess = req.session;
	sess.username;

});

http.listen(config.port, function(err) {
	if(err){
		console.log(err);
	}else {

        console.log("Listening on 3000");
	}
});

