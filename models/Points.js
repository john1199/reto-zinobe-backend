const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
  selfDevelopmentPoints: {
    type: Number,
  },
  assistancePoints: {
    type: Number,
  },
  directPoints: {
    type: Number,
  },
  challengePoints: {
    type: Number,
  },
  exhibitionPoints: {
    type: Number,
  },
  teamPoints: {
    type: Number,
  },
});

module.exports = mongoose.model('points', pointsSchema);
