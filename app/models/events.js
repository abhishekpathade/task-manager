var mongoose = require('mongoose');
require('mongoose-type-email')

var Schema = mongoose.Schema;

var EventsSchema = new Schema({

    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    user: String,
    content: String,
    date: String,
    created: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Events', EventsSchema);