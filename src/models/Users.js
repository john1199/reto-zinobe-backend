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
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  team: {
    //toca modificarlo para que quede con el id del modelo de teams
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
    type: Boolean,
    required: true,
  },
  scopes:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('user', userSchema);

