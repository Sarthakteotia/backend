// models/Key.js

const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
  key: String,
  expiryTimeFrame: String,
});

module.exports = mongoose.model('Key', keySchema);
