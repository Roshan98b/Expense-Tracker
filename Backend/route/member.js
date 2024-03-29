// jshint esversion : 6

var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var Mail = require('../config/mail');
var Member = require('../model/member'); 
var TempMember = require('../model/tempmember');
var Group = require('../model/group');
var router = express.Router();
var token = '';

// Local Storage User Details
function userDetails(model, res) {
	var group = [];
	for(let i of model._groupId) {
		Group.getById(i, (err, gmodel) => {
			if(err) console.log(err);
			else {
				if(model._id.equals(gmodel._Uid)) flag = true;
				else flag = false;
				group.push({_groupId: gmodel._id, groupName: gmodel.groupName, gh: flag});
				if(group.length == model._groupId.length) {
					res.status(200).json(
					{
						message: 'Authentication Success',
						token: 'JWT '+token,
						user: {
							_id: model._id,
							firstname: model.firstname,
							lastname: model.lastname,
							dob: model.dob,
							gender: model.gender,
							contactno: model.contactno,
							email: model.email,
							balance: model.balance,
							group: group
						}
					});
				}
			}
		});
	}
	if(!model._groupId.length) {
		res.status(200).json(
		{
			message: 'Authentication Success',
			token: 'JWT '+token,
			user: {
				_id: model._id,
				firstname: model.firstname,
				lastname: model.lastname,
				dob: model.dob,
				gender: model.gender,
				contactno: model.contactno,
				email: model.email,
				balance: model.balance,
				group: []
			}
		});
	} 						
}


//Login
router.post('/login', (req, res) => {
	Member.getByEmail(req.body.email, (err, model) => {
		if(err) return done(err);
		if(model == null) return res.status(501).json({message: 'Invalid username!! Please register before trying to login!!'});  
		else {
			var flag;
			if(bcrypt.compareSync(req.body.password, model.password)) {
				token = jwt.sign(model.toJSON(), 'app', {
					expiresIn: 86400
				});
				userDetails(model, res, token);
			}
			else res.status(501).json({message: 'Invalid login credentials!!'});
		}
	});	
});

// Register
router.post('/member', (req, res) => {
	var member = new Member({
		_id: new mongoose.Types.ObjectId(),
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		dob: req.body.dob,
		email: req.body.email,
		gender: req.body.gender,
		contactno: req.body.contactno,
		balance: 0,
		password: req.body.password,
		securityQuestion: req.body.securityQuestion,
		securityAnswer: req.body.securityAnswer
	});
	Member.addUser(member, (err, model) => {
		if(err) {
			res.status(501).json(err);
			console.log(err);
		}
		else {
			res.status(200).json({message: 'Add Member Success'});
		}
	});
});

//Forgot password
router.post('/forgotpassword',
	(req, res) => {
		Member.getByEmail(req.body.email, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			} else {
				if(!model){
					res.status(501).json({message: 'Requested account does not exist'});
				}
				else {
					if(req.body.securityQuestion != model.securityQuestion || req.body.securityAnswer != model.securityAnswer) {
						res.status(501).json({message: 'Invalid Security credentials!!!'});
					} else {
						if (process.env.FF_NODEMAILER == null || process.env.FF_NODEMAILER === 'false') {
							console.log("Mailer is not applicable");
							res.status(200).json({ message: 'Security credentials verified successfully!!' });
						} else {

							const output = `
								<p>Please click on the link provided to reset your password and re-gain access to your account.</p>
								<a href="http://127.0.0.1:4200/resetPassword/${model._id}">http://127.0.0.1:4200/resetPassword</a>
							`;

							let mailOptions = {
								from: `Admin ${process.env.NODEMAILER_EMAIL}`, // sender address
								to: req.body.email, // list of receivers
								subject: 'Reset your ExpenseTracker password', // Subject line
								text: '', // plain text body
								html: output // html body
							};

							Mail.sendMail(mailOptions, (error, info) => {
								if (error) {
									return console.log(error);
								}
								console.log('Message sent: %s', info.messageId);
								res.status(200).json({ message: 'Security credentials verified successfully!!' });
							});
						}
					}
				}
			}
		});
	});

//Reset Password
router.post('/resetpassword',
	(req, res) => {
		req.body.password = bcrypt.hashSync(req.body.password, 10);
		Member.resetPasswordById(req.body.id, req.body.password, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			}
			else {
				res.status(200).json({message: 'Password has been successfully reset!!'});
			}
		});
	});

router.post('/resetpassword1',
  passport.authenticate('jwt', {session: false}),
	(req, res) => {
		req.body.password = bcrypt.hashSync(req.body.password, 10);
		Member.resetPasswordById(req.body.id, req.body.password, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			}
			else {
				res.status(200).json({message: 'Password has been successfully reset!!'});
			}
		});
	});

//Reset Security Credentials
router.post('/resetSecurityCredentials',
  passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Member.resetSecurityCredentialsById(req.body.id, req.body.question, req.body.answer, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			}
			else {
				res.status(200).json({message: 'Security Credentials have been successfully reset!!'});
			}
		});
	});

//Edit profile
router.post('/editedprofile',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Member.updateByEmail(req.body.email, req.body.firstname, req.body.lastname, req.body.dob, req.body.gender, req.body.contactno, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			}
			else {
				res.status(200).json({
					message: 'Member profile has been updated!!',
					token: 'JWT '+token,
					user: {
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						dob: req.body.dob,
						gender: req.body.gender,
						contactno: req.body.contactno
					}
				});
			}
	});
});

// Create Member
router.post('/createmember',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		if(req.body.response) {
			Member.updateById(req.body._Uid, req.body._groupId, (err, model) => {
				if(err) res.status(501).json(err);
				else {
					TempMember.deleteById(req.body._id, (err) => {
						if(err) res.status(501).json(err);
						else {
							res.status(200).json({message: 'Member Created Successfully'});
						}
					});
				}
			});
		} else {
			TempMember.deleteById(req.body._id, (err) => {
				if(err) res.status(501).json(err);
				else {
					res.status(200).json({message: 'Member Created Successfully'});
				}
			});			
		}
	}
);

// Search Member
router.post('/searchmember',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Member.searchgh(req.body.email, (err, model) => {
			if(err) res.status(501).json(err);
			else res.status(200).json(model);
		});
	}
);

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
	Member.getById(req.user._id, (err, model) => {
			if(err) res.status(501).json(err);
			else userDetails(model, res, token);
	});	
});

//Check password before allowing access to change password
router.post('/checkPassword',
	passport.authenticate('jwt', {session: false}),
 		(req, res) => {
 			console.log(req.body);
			Member.getById(req.body.id, (err, model) => {
				if(err)
					res.status(501).json({message: 'Member not found!!'});
				else {
					if(bcrypt.compareSync(req.body.password, model.password))
						res.status(200).json({message: 'Password verified successfully!!'});
					else
						res.status(501).json({message: 'Incorrect password!!'});
				}
			});
		});

// Profile
router.post('/addmoney', 
	passport.authenticate('jwt', {session: false}), 
	(req, res) => {
		let obj = {};
		obj.destBalance = req.body.amount;
		obj._Did = req.body._id;
		Member.updateBalance(obj, (err, model) => {
				if(err) res.status(501).json(err);
				else res.status(200).json(obj);
		});	
	}
);

module.exports = router;