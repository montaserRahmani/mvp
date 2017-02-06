var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var handlers = require('./handlers.js')
var Board = require('./models/boardModel.js');
var Link = require('./models/linkModel.js');

var app = express();

// connect to mongo database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boardly');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

//routes
app.use('/api/links', handlers.decodeToken);
app.get('/api/links', handlers.handleBoards.getLinks);
app.post('/api/links', handlers.handleBoards.addLink);
// app.get('/', function(req,res) {
// 	res.send("HELLO!")
// })
app.get('/api/boards', handlers.handleBoards.getBoards);
app.use('/api/boards', handlers.decodeToken);
app.post('/api/boards', handlers.handleBoards.addBoard);
app.post('/api/users/signup', handlers.handleUsers.signup);
app.post('/api/users/signin', handlers.handleUsers.signin);

app.get('/api/users', handlers.handleUsers.getUsers);
// app.use('/api/users/:user', handlers.decodeToken);
app.get('/api/users/:user', handlers.handleBoards.getUserBoards);

//for deleting data
// app.get('/api/boards/remove', function(req, res){
// 	Board.remove({}, function (err) {
// 	  if (err) return res.json(err);
// 	  res.json("Boards removed")
// 	});	
// });
// app.get('/api/links/remove', function(req, res){
// 	Link.remove({}, function (err) {
// 	  if (err) return res.json(err);
// 	  res.json("Boards removed")
// 	});	
// });


// start listening to requests on port 8000
app.listen(process.env.PORT || 5000);

// export our app for testing and flexibility, required by index.js
module.exports = app;
