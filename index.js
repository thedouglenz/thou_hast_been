var express = require('express');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// express
var app = express();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// mongoose
mongoose.connect('mongodb://localhost/thou');
var User;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// USER schema
	var userSchema = mongoose.Schema({
		username: String,
		email: String,
		created: Date,
		modified: Date,

	});
	User = mongoose.model('User', userSchema)
});

/* --- USER functions --- */
function findUserByEmail(email) {
	User.find({email: email}, function(err, users) {
		if(err) return console.error(error);
		return users;
	});
}

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	console.log('thou hast visited the home page.');
	res.render('home');
});

app.get('/about', function(req, res) {
	console.log('thou hast visited the about page.');
	res.render('about');
});

app.post('/register', function(req, res) {
	var username = req.body.username,
	password = req.body.password,
	email = req.body.email;

	console.log(username  + " " + email + " " + password);
	already_users = findUserByEmail(email);
	if(already_users) {
		if(already_users.length > 0) {
			console.log("User" + already_users.username + " " + already_users.email + " tried to register but already has an account.");	
			// TODO: 
			// A user registers but already has an account based on the email they provided.
			// Need to warn them on the screen
			// Tell them what their username was
		}
	} else {
		console.log("Register attempt: " + email + ": no accounts with that email exist yet.")
	}
});

app.post('/login', function(req, res) {
	var username = req.body.loginusername,
	password = req.body.loginpassword;

	console.log(username + " " + password);
});

app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.listen(3000, function() {
	console.log("thou hast been now listening on http://127.0.0.1:3000");
});