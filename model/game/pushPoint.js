const { CROSS, ZERO } = require('../../consts')

function pushPoint(game, point, isPlayer = false) {
  let value = CROSS
  if (isPlayer) {
    if (!game.firstTurnPlayer) value = ZERO
  } else {
    if (game.firstTurnPlayer) value = ZERO
  }
  game.playingField.push({
    ...point,
    turn: game.currentTurn,
    value,
  })
  game.markModified('playingField')
}

module.exports = pushPoint
