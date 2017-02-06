var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: String,
  _board: {
  	type: Schema.Types.ObjectId, 
  	ref: 'boards' 
  }
});

module.exports = mongoose.model('links', LinkSchema);
