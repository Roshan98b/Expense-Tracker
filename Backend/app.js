// jshint esversion : 6

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var session = require('express-session');
require('dotenv').config()

var users = require('./route/users');

var app = express();
var mongodbUrl = process.env.MONGO_URL;

// MongoDB Connection
mongoose.set('strictQuery', false);
mongoose.connect(mongodbUrl);
mongoose.connection.on('connected', () => {
	console.log('Connected to mongodb '+ mongodbUrl);
});
mongoose.connection.on('error', (err) => {
	console.log('Error Connecting to mongo '+ mongodbUrl);
	console.log(err);
});

// Add Passport Code
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET 
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passportjwt');

// Static Pages /public/index.html
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// CORS
app.use(cors(
	{
		origin: [process.env.CORS_ORIGIN],
		credentials: true
	}
));

// Users route
app.use('/users',users);

app.use('*', (req, res) => {
	res.status(401).json({message: 'URL not Found'});
});

app.listen(3000, () => {
	console.log('Started server using port no 3000');
});