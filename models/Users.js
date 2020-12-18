const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  identificationCard: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  team: {
    type: String,
  },
  points: {
    type: Object,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
