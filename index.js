var express = require('express');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session'); 
var passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var debug = function(target) {
	console.log(target);
}

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

// passport
require('./config/passport')(passport);

// nodemailer
var mailer = require('./tools/email');
// Usage: mailer('no-reply@thouhastbneen.com', 'Douglas Lenz <thedouglenz@gmail.com>', 'Welcome to thou hast been!', 'Hello user! Welcome!', '');
// Can be used anywhere that imports mailer like the line above.

var User;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	User = require('./models/user');
});


// Configure the passport object according to ./config/passport
require('./config/passport')(passport);

// isLoggedIn
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();

	res.redirect('/');
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

app.get('/dashboard', isLoggedIn, function(req, res) {
	res.render('dashboard', {user : req.user});
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/llr', function(req, res) {
	res.render('local_login_redirect', {user : req.user});
});

// Local sign up / login

app.post('/register', passport.authenticate('local-signup', 
	{
		successRedirect: '/llr',
		failureRedirect: '/',
		failureFlash : true
	}));


app.post('/login', passport.authenticate('local-login', {
	successRedirect: '/dashboard',
	failureRedirect: '/',
	failureFlash : true})
);

// Facebook sign up / login
app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect : '/dashboard',
	failureRedirect : '/'
}));


// Google sign up / login
app.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));

app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect : '/dashboard',
		failureRedirect : '/'
	}));

// Local registrant autnetication
app.get('/validate_local_user_accnt/:id', function(req, res) {
	// req.params.id is the user id we need to validate
	var User = require('./models/user');
	User.findOne({'_id':req.params.id}, function(err, user) {
		if(err) {
			throw err;
		} else {
			user.local.valid = true;

			user.save(function(err) {
				if(err) {
					throw err;
				}
			});

			res.render('dashboard', {user:user});
		}
	});
});

app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.listen(process.env.PORT || 3000, function() {
	console.log("thou hast been now listening on http://127.0.0.1:3000");
});