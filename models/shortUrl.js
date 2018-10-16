//model of document for shortURL
//reuire mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlSchema = new Schema(
  {
    originalUrl: String,
    shortUrl: String
  },
  {
    timestamp:true
  }
);
const ModelClass = mongoose.model('shortUrl',urlSchema);
module.exports = ModelClass;
