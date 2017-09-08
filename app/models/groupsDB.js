var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var myArray = new Schema({
    name: String,
    email: String,
    priority: Number
});

var GroupsSchema = new Schema({

    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    groupName: {type: String, required: true},
    attendees:[myArray],
    created: {type: Date, default: Date.now}


});

module.exports = mongoose.model('GroupsDB', GroupsSchema);


// attendee1:{ name: {type: String, required: true},
    //             email: {type: mongoose.SchemaTypes.Email, required: true},
    //             priority: Number},
    //
    // attendee2:{ name: {type: String},
    //             email: {type: mongoose.SchemaTypes.Email},
    //             priority: Number},
    //
    // attendee3:{ name: {type: String},
    //             email: {type: mongoose.SchemaTypes.Email},
    //             priority: Number},
    //
    // attendee4:{ name: {type: String},
    //             email: {type: mongoose.SchemaTypes.Email},
    //             priority: Number},
    //
    // attendee5:{ name: {type: String},
    //             email: {type: mongoose.SchemaTypes.Email},
    //             priority: Number},

    // attendee_name:[String],
    // attendees:[{
    //     name: String,
    //     email: mongoose.SchemaTypes.Email,
    //     priority: Number
    // }],


