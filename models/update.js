var mongoose = require('mongoose');

var updateSchema = mongoose.Schema({
	user : {
		id : String,
		email : String
	},
	geo : {
		lat : float,
		lon : float
	},
	when : Date
});