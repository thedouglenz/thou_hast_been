var express = require('express');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

// express
var app = express();

// configuration for passport
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'iwantingtotalktosomebooty' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// cookie-parser
app.use(cookieParser())

// mongoose
mongoose.connect('mongodb://localhost/thou');

require('./config/passport')(passport);

var User;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	User = require('./models/user');
});


// Configure the passport object according to ./config/passport
require('./config/passport')(passport);


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
	res.render('home', {message: req.flash('homeMessage')});
});

app.get('/about', function(req, res) {
	console.log('thou hast visited the about page.');
	res.render('about');
});

app.post('/register', passport.authenticate('local-signup', 
	{
		successRedirect: '/about',
		failureRedirect: '/',
		failureFlash : true
	}));
/*
app.post('/login', function(req, res) {
	var username = req.body.loginusername,
	password = req.body.loginpassword;

	console.log(username + " " + password);
});
*/
app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlase: true})
);

app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.listen(3000, function() {
	console.log("thou hast been now listening on http://127.0.0.1:3000");
});