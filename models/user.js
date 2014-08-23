var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	email: String,
	created: Date,
	modified: Date,
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validatePassword = function(password) {
	return bcrypt.comparSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);