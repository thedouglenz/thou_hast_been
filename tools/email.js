var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth : {
		user: 'douglas.w.lenz@gmail.com',
		pass: 'Batman1Joker0.'
	}
});

var sendNewMail = function(from, to, subject, text, html) {
	var mailOptions = {
		from: from,
		to: to, // String but comma separated inside!
		subject: subject,
		text: text, // plaintext
		html: html // html
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if(err) {
			console.log(err);
		} else {
			console.log('Message sent: ' + info.response);
		}
	});
}

module.exports = sendNewMail;