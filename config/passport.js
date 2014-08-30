var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mailer = require('../tools/email');

var User = require('../models/user');

var configAuth = require('./auth');

var config = require('./config.js');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Local Registration
	passport.use('local-signup', new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback : true
	}, function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({'local.email':email}, function(err, user) {
				if(err)
					return done(err);

				if(user) {
					return done(null, false, req.flash('homeMessage', 'That email is already in use'));
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					var now = new Date();
					newUser.local.created = now;
					newUser.local.modified = now;

					newUser.local.valid = false;

					newUser.save(function(err) {
						if(err) {
							throw err;
						} else {
							var from = 'no-reply@thouhastbneen.com';
							var to = newUser.local.email;
							var subject = 'Confirm your email at thou hast been';
							var body = 'Thank you for signing up with thou hast been.';
							body += ' We need you to follow the link below to confirm ';
							'your email: \n\n';
							body += config.ldomainname + '/validate_local_user_accnt/' + newUser.id + '\n\n';
							body += 'Thank you,\n\nthou hast been';

							mailer(from, to, subject, body, '');	
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));

	/* Local Strategy */
	passport.use('local-login', new LocalStrategy(
	{
		usernameField : 'loginemail',
		passwordField : 'loginpassword',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		User.findOne({'local.email' : email}, function(err, user) {
			if(err)
				return done(err);
			if(!user)
				return done(null, false, req.flash('homeMessage' , 'User not found'));
			if(!user.validPassword(password))
				return done(null, false, req.flash('homeMessage' , 'Incorrect password'));

			return done(null, user);
		});
	}));

	/* Facebook Strategy */
	passport.use(new FacebookStrategy(
	{
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({'facebook.id' : profile.id}, function(err, user) {
				if(err)
					return done(err);

				if(user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email = profile.emails[0].value;
					
					// Set local created and modified
					var now = new Date();
					newUser.local.created = now;
					newUser.local.modified = now;

					// Set other local fields based on facebook info
					newUser.local.realname = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.local.email = profile.emails[0].value;
					newUser.local.valid = true;

					newUser.save(function(err) {
						if(err)
							throw err;

						return done(null, newUser);
					});			
				}
			});
		});
	}));

	/* Google Strategy */
	passport.use(new GoogleStrategy({
		clientID : configAuth.googleAuth.clientID,
		clientSecret : configAuth.googleAuth.clientSecret,
		callbackURL : configAuth.googleAuth.callbackURL
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({'google.id' : profile.id}, function(err, user) {
				if(err)
					return done(err);
				if(user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.google.id = profile.id;
					newUser.google.token = token;
					newUser.google.name = profile.displayName;
					newUser.google.email = profile.emails[0].value;

					// Set local created and modified
					var now = new Date();
					newUser.local.created = now;
					newUser.local.modified = now;

					// Set other local fields from google info
					newUser.local.realname = profile.displayName;
					newUser.local.email = profile.emails[0].value;
					newUser.local.valid = true;

					newUser.save(function(err) {
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			});
		});
	}));
}