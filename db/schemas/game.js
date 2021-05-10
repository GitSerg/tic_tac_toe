const mongoose = require('mongoose');
const crypto = require('crypto');

function getHash() {
  return crypto.createHash('sha1').update(`${Date.now()}${Math.random()}`).digest('hex')
}
const gameSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  hashId: {
    type: String,
    default: getHash,
    index: true,
  },
  state: {
    enum: [
      'turn_x',
      // 'turn_o',
      'win_x',
      'win_o',
      'win_draw',
    ],
    type: String,
    default: 'turn_x',
  },
  currentTurn: { type: Number, default: 0 },
  firstTurnPlayer: { type: Boolean, default: true }, // true - x
  maxX: { type: Number, default: 3 },
  maxY: { type: Number, default: 3 },
  // sorted list
  playingField: [{
    turn: { type: Number, min: 1 },
    x: { type: Number, min: 1 }, // [1, maxX]
    y: { type: Number, min: 1 }, // [1, maxY]
    value: { type: String, enum: ['x', 'o', ''] }
  }],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game
