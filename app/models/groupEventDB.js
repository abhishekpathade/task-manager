var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GroupEventSchema = new Schema({

    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    user: {type: String},
    content: {type: String, required: true},
    attendees:{ type: mongoose.SchemaTypes.Email},
    location: {type: String},
    sdate: {type: Date, required: true},
    edate: {type: Date, required: true},
    created: {type: Date, default: Date.now},
    groupname: {type: String, ref: 'GroupsDB'},
    eventid: {type: String}
});

module.exports = mongoose.model('GroupEventDB', GroupEventSchema);
