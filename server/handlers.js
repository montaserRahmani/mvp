var User = require('./models/userModel.js');
var Link = require('./models/linkModel.js');
var Board = require('./models/boardModel.js');
var util = require('./utils.js')
var jwt = require('jwt-simple');

module.exports.handleUsers = {
  signin : function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username})
      .then(function (user) {
        if (!user) {
          res.json("user not found")
        } else {
          user.comparePasswords(password)
            .then(function (isMatch) {
              if (isMatch) {
                var token = jwt.encode(user, 'secret');
                res.json({token : token});
              } else {
                res.json("password not matched")
              }
            });
        }
      });
  },

  signup: function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;

    // check to see if user already exists
    User.findOne({username: username})
      .exec(function (err, user) {
        if (user) {
          res.json('User already exist!');
        } else {
          // make a new user if not one
          return User.create({
            username: username,
            password: password,
            name: name
          }, function (err, newUser) {
              // create token to send back for auth
              if(err){
                res.json(err);
              } else {
                var token = jwt.encode(user, 'secret');
                res.json({token: token}); 
              }     
          });
        }
      });
  },

  getUsers: function(req, res) {
    User.find({}, function(err, users){
      if(err){
        res.json(err);
      } else {
        res.json(users);
      }
    });
  }

};

module.exports.handleBoards = {
  getLinks : function(req, res) {
    var board = req.body.board;

    // if(req.session.user){

      Link.find({board : board})
     .exec(function(err, links){

          if(err) throw err;
          console.log(links);
          res.json(links);

     })
    // } else {

      //res.status(404).send("No links");

    // }
  },

  addBoard: function(req, res) {
    var board = req.body.board;
    var username = req.body.username;
    //if(req.session.user){
      User.findOne({ username : username }).exec(function(err, user){
        if(user){
          Board.create({
            title: board,
            username: user._id
          }, function(err, board){
            if(err){
              res.status(404).json(err);
            } else {
              res.status(201).json(board);
            }
          });   
        } else {
          res.status(404).json("User not found");
        }
      });

    //} else {

      //res.status(403).send("Not Allowed");

   // }
  }, 

  addLink: function(req, res) {
    var board = req.body.board;
    var url = req.body.url;

    if (!util.isValidUrl(url)) {
      return next(new Error('Not a valid url'));
    }

    Link.findOne({url: url})
      .then(function (err, match) {
        if (match) {
          res.json(match);
        } else {
          return util.getUrlTitle(url);
        }
      })
      .then(function (title) {
        if (title) {
          Board.findOne({ title : board})
            .exec(function(err, result){
              if(result) {
                Link.create({
                  url: url,
                  title: title,
                  _board : result._id
                }, function(err, link){
                  if(err) throw err;
                  result.links.push(link._id);
                  result.save();
                  res.json(link);
                });                
              } else {
                res.status(404).json("board not found");
              }
          });
        }
      });
  }, 

  getBoards: function(req, res) {
    Board.find({}).populate("links").populate("username").exec(function(err, boards){
      if(err){
        res.json(err);
      } else {
        res.json(boards);
      }
    })
  }, 

  getUserBoards: function(req, res) {
    var username = req.params.user;
    User.find({username: username}).exec(function(err, result){
      if(result){
        Board.find({}).populate("links").populate("username")
        .where({username: result}).exec(function(err, result){
        if(err){
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
    })

  }
};

module.exports.decodeToken = function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user;

    if (!token) {
      return res.send(403); // send forbidden if a token is not provided
    }

    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }
}