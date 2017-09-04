var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StorySchema = new Schema({

	creator: {type: Schema.Types.ObjectId, ref: 'User'},
	user: {type: String, required: true},
    // username: {type: String},
    content: {type: String, required: true},
    attendee1:{ type: mongoose.SchemaTypes.Email, required: true, index: {unique: false}},
    // attendee2:{ type: mongoose.SchemaTypes.Email},
    // attendee3:{ type: mongoose.SchemaTypes.Email},
    // attendee4:{ type: mongoose.SchemaTypes.Email},
    location: {type: String},
	sdate: {type: Date, required: true},
    edate: {type: Date, required: true},
	created: {type: Date, default: Date.now},
    eventid: {type: String}

});

module.exports = mongoose.model('Story', StorySchema);
