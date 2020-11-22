const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  identificationCard: {
    type: String,
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  team: {
    type: String,
    enum: [
      'Tech Términus',
      'Tech infraestructura',
      'Tech Big Data',
      'Data',
      'Tech Front´s',
      'Tech QA',
      'Diseño',
      'Tech PM´s',
      'CTO',
    ],
  },
  isAdmin: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);

