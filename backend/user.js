
const mongoose = require("mongoose");
const user = new mongoose.Schema({
  email: String,
  password: String,

}, { collection: 'users' });

module.exports = mongoose.model("users", user);