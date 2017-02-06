var mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  username : { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  links : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'links'
  }]
});

module.exports = mongoose.model('boards', BoardSchema);
