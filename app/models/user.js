var mongoose = require('mongoose');
require('mongoose-type-email')

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({

	name: String,
	email: { type: mongoose.SchemaTypes.Email, required: true, index: {unique: true}},
	username: { type: String, required: true, index: {unique: true}},
	password: { type: String, required: true, select: false},
	oauth2token: Object
//TODO: handle tocken expiry i.e. refresh token and expiry field
});

UserSchema.pre('save', function(next){
	
	var user = this;
	
	if(!user.isModified('password')) return next();
	
	bcrypt.hash(user.password, null, null, function(err, hash){		
		
		if(err) return next(err);

		user.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = function(password){

	var user = this;

	return bcrypt.compareSync(password, user.password);

}
module.exports = mongoose.model('User', UserSchema);