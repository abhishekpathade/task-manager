var User = require('../models/user');
var Story = require('../models/story');
var Groupsdb = require('../models/groupsDB');
var GroupEventsdb = require('../models/groupEventDB');
var config = require('../../config');
var google = require("googleapis");
var calender = google.calendar('v3');
// var googleAuth = require('google-auth-library');

var secretKey = config.SecretKey;

var jsonwebtoken = require('jsonwebtoken');

var OAuth2 = google.auth.OAuth2;
var event_id = "";
var oauth2Client = new OAuth2(
    "823822268578-hfae3k4tumlhjb979ct5a19rmfa7m76a.apps.googleusercontent.com",
    "ad8eQZqyM7ONz4Ke2Ca2WdT0",
    "http://localhost:3000/api/oauthcallback"
// http://localhost:3000/api/oauthcallback
);

var scopes = [
    'https://www.googleapis.com/auth/calendar'
];

// function

function createToken(user){

	var token = jsonwebtoken.sign({
		id: user.id,
		name: user.name,
		email: user.email,
		username: user.username,
		password: user.password
	}, secretKey, {
		expiresIn: '1440m'
	});
	return token;
}

// var att_id;
// var groupid;
// var grpEvePriority=0;


module.exports = function(app, express, io){

	var api = express.Router();

	api.get('/all_stories', function(req, res) {
		
		Story.find({}, function(err, stories) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(stories);
		});
	});

	// destination A

	api.post('/signup', function(req, res){

		var user = new User({
			name: req.body.name,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});

		var token = createToken(user);
		user.save(function(err){
			if(err){
				res.send(err);
				return;
			}

			res.json({
				success: true,
				message: 'User created',
				token: token
			});
		});
	});

	api.get('/users', function(req, res){

		User.find({}, function(err, users){
			if(err){
				res.send(err);
				return;
			}
			res.json(users);
		});
	});


	api.get('/oauthcallback', function(req, res) {
        var code = req.query.code;
        sess = req.session;

        console.log(sess.username);
        console.log(code);

        oauth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log(err);
                res.send(err);
                // return;
            }

            console.log("allright!!!!");

            console.log(tokens);
            oauth2Client.setCredentials(tokens);

            res.send(tokens);
            // window.close();

            User.findOneAndUpdate({username: sess.username}, {oauth2token:tokens},function(err, doc){
                if(err){
                    console.log("Something wrong when updating data!");
                }else console.log(doc);
            });
        });
        // $window.close();

    });
	api.get('/oauth2url', function(req, res) {

        var url = oauth2Client.generateAuthUrl({
    		// 'online' (default) or 'offline' (gets refresh_token)
    		access_type: 'offline',
		    // If you only need one scope you can pass it as a string
    		scope: scopes
        });

        res.json({
			url: url
		});

    });

	api.post('/oauth2token', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('username oauth2token').exec(function (err, user) {
            if (err) throw err;

            if (!user.oauth2token) {
                console.log("user oauth2 token not found");

                res.json({
                    success: true,
					hasToken: false
                });

			} else {

                console.log("user oauth2 token found");
                res.json({
                    success: true,
                    hasToken: true
                });
            }
        });
    });

	api.post('/login', function(req, res){

		User.findOne({
			username: req.body.username		
		}).select('name email username password').exec(function(err, user){
			
			if(err) throw err;

			if(!user){
				res.send({message: "User does not exist"});
			} else if (!user) {
            } else {

                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.send({message: "Invalid password"});
                } else {

                    //token
                    var token = createToken(user);

                    sess=req.session;
                    sess.username = req.body.username;
                    sess.tz = req.body.tz;
                    res.json({
                        success: true,
                        message: "Login successful",
                        token: token
                    });
                }
            }
		});
	});

	api.use(function(req, res, next){

		console.log("middleware");
		
		var token = req.body.token ||  req.headers['x-access-token'];

		//if token exists
		if(token){

			jsonwebtoken.verify(token, secretKey, function(err, decoded){

				if(err){
					res.status(403).send({success: false, message: "failed to authenticate"});

				} else {

					req.decoded = decoded;
					next();
				}
			});
		} else {

			res.status(403).send({success: false, message: "no token found"});
		}
	});


	// destination B // needs a token 

/*	api.get('/', function(req, res){

		res.json("Hello world");
	});

*/

	api.route('/')
		
		.post(function(req,res){
		

            var event = {
                'summary': req.body.content,
                'location': req.body.location,
                // 'description': 'A chance to hear more about Google\'s developer products.',
                'start': {
                    'dateTime': req.body.startdate,
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': req.body.enddate,
                    'timeZone': 'America/Los_Angeles'
                },
                'attendees': [
                    {'email': req.body.attendee1}
                    // {'email': req.body.attendee2},
                    // {'email': req.body.attendee3},
                    // {'email': req.body.attendee4}
                ]
            };
            User.findOne({
                username: sess.username
            }).select('oauth2token').exec(function(err, user){

                // if(err) throw err;
                console.log("user");
                console.log(user);
                if(!user.oauth2token) {
                    res.send({message: "No oauth token"});
                } else {
                	var token = user.oauth2token;
                	console.log(token);
                    oauth2Client.setCredentials(token);

                    calender.events.insert({
                        auth: oauth2Client,
                        calendarId: 'primary',
                        resource: event
                    }, function(err, event) {
                        if (err) {
                            console.log('There was an error contacting the Calendar service: ' + err);
                            return;
                        }
                        event_id = event.id;
                        console.log('Event created: %s', event_id);

						var story = new Story({
							creator: req.decoded.id,
							user: req.decoded.name,
							// username: req.body.username,
							attendee1: req.body.attendee1,
                            location: req.body.location,
							sdate: req.body.startdate,
							edate: req.body.enddate,
							content: req.body.content,
							eventid: ([event_id])

						});

						console.log(req.body.startdate + sess.tz);

						story.save(function(err, newStory){
							if(err){
								res.send(err);
								return;
							}
							io.emit('story', newStory);
							res.json({message: "new story created"});
            			});

                    });
                }
            });


            //appendPre('Event created: ' + event.htmlLink);

		})

		.get(function(req,res){

			Story.find({ creator: req.decoded.id}, function(err, stories){

				if(err){

					res.send(err);
					return;
				}
				res.send(stories);
			})
		});


	api.get('/me', function(req, res){

		res.send(req.decoded);

	});

    api.post('/grpCreate', function(req, res){

        var group = new Groupsdb({
            creator: req.decoded.id,
            groupName: req.body.grpname,
            attendees:
               [{name: req.body.name1, email: req.body.email1, priority: '1'},
                {name: req.body.name2, email: req.body.email2, priority: '1'},
                {name: req.body.name3, email: req.body.email3, priority: '1'},
                {name: req.body.name4, email: req.body.email4, priority: '1'},
                {name: req.body.name5, email: req.body.email5, priority: '1'}]
         });

        group.save(function(err, newGroup){
            if(err){
                res.send(err);
                return;
            }
            // console.log("grpCreated");

            io.emit('groupsDB', newGroup);
            res.json({message: "new group created"});
        });
    });

    api.get('/groupsall', function(req, res){

        Groupsdb.find({}, function(err, groups){

            if(err){

                res.send(err);
                return;
            }
            // console.log("grpCreated-read");
            res.send(groups);
        });
    });

    api.put('/grpEventCreate', function(req, res){


        console.log(req.decoded.username);
        Groupsdb.findOne({
            groupName: req.body.grpname
        }).select('attendees').exec(function(err, group){
            var att_id;
            var groupid;
            var grpEvePriority;
            var att = group.attendees;
            var index = 0;
            var value = att[0].priority;
            for (var i = 1; i < att.length; i++) {
                if (att[i].priority < value && att[i].email!=null) {
                    value = att[i].priority;
                    index = i;
                    // att_id = att[index]._id;
                    // grpEvePriority = att[index].priority+1;
                }
            }
            att[index].priority=value+1;
            console.log("email: "+att[index].email);
            // console.log("att_id: "+att_id);
            if (err)
                res.send(err);

            group.attendees = att;

            group.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'group updated!' });
            });

            Groupsdb.findOne({
                groupName: req.body.grpname
            }).select('_id').exec(function(err, group){

                groupid=group._id;
            });

                console.log(att);
            console.log("email: "+att[index].email);

            var newGrpEvent = {
                'summary': req.body.content,
                'location': req.body.location,
                // 'description': 'A chance to hear more about Google\'s developer products.',
                'start': {
                    'dateTime': req.body.startdate,
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': req.body.enddate,
                    'timeZone': 'America/Los_Angeles'
                },
                'attendees': [
                    {'email': att[index].email}
                ]
            };

            User.findOne({
                username: req.decoded.username
            }).select('oauth2token').exec(function(err, user){

                // if(err) throw err;
                console.log("user");
                console.log(user);
                if(!user.oauth2token) {
                    res.send({message: "No oauth token"});
                } else {
                    var token = user.oauth2token;
                    console.log(token);
                    oauth2Client.setCredentials(token);

                    calender.events.insert({
                        auth: oauth2Client,
                        calendarId: 'primary',
                        resource: newGrpEvent
                    }, function(err, newGrpEvent) {
                        if (err) {
                            console.log('There was an error contacting the Calendar service: ' + err);
                            return;
                        }
                        event_id = newGrpEvent.id;
                        console.log('Event created: %s', event_id);

                        var groupev = new GroupEventsdb({
                            creator: req.decoded.id,
                            user: req.decoded.name,
                            content: req.body.content,
                            attendees:att[index].email,
                            location: req.body.location,
                            sdate: req.body.startdate,
                            edate: req.body.enddate,
                            groupname: req.body.grpname,
                            eventid: ([event_id])

                        });

                        groupev.save(function(err, newGroupEvent){
                            if(err){
                                res.send(err);
                                return;
                            }
                            // console.log("grpEventCreated");

                            io.emit('groupEventDB', newGroupEvent);
                            // res.json({message: "new group event created"});
                        });

                    });
                }
            });
            console.log("changed priority: "+att[index].priority);

            // console.log("changed priority"+grpEvePriority);
            // console.log("group id: "+groupid);

        });

        // Groupsdb.findById(groupid).select('attendees').exec(function(err, user){
        //
        //     // if (err)
        //     //     res.send(err);
        //
        //     var att = user.attendees;
        //     for (var i = 0; i < att.length; i++) {
        //         if (att[i]._id==att_id) {
        //             att[i].priority=grpEvePriority;
        //             console.log("priority changed: "+att[i].priority);
        //         }
        //     }
        //
        //     console.log("old"+user.attendees);
        //     // console.log("break");
        //     // console.log(user);
        //     user.attendees = att;  // update the info
        //     console.log("priority: "+grpEvePriority);
        //     console.log("att_id: "+att_id);
        //     console.log("new2"+att);
        //
        //     // update and save
        //     user.save(function(err) {
        //         if (err)
        //             res.send(err);
        //
        //         res.json({ message: 'Bear updated!' });
        //     });
        //
        // });


    });

    api.get('/groupEvents', function(req, res){

        GroupEventsdb.find({}, function(err, groupsEvt){

            if(err){

                res.send(err);
                return;
            }
            // console.log("grpEventCreated-read");
            res.send(groupsEvt);
        });
    });

    return api;

}



