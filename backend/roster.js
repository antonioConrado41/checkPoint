
const mongoose = require("mongoose");
const roster = new mongoose.Schema({
  userId: mongoose.ObjectId,
  week: Array,
}, { collection: 'roster' });

module.exports = mongoose.model("roster", roster);