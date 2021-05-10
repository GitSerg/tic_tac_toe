
function rand(amax) {
  return Math.floor(Math.random() * amax)
}
function incDirection(val, direction, maxVal) {
  val += direction
  if (val <= 0) val = maxVal
  if (val > maxVal) val = 1
  return val
}
function computerTurn(game) {
  const xDirection = rand(2) ? 1 : -1
  const yDirection = rand(2) ? 1 : -1
  let x = 1 + rand(game.maxX)
  let y = 1 + rand(game.maxY)
  // console.log('!1', xDirection, yDirection, x, y)
  for (let i = 0; i < game.maxX; i++) {
    for (let j = 0; j < game.maxY; j++) {
      // console.log('!2', x, y)
      if (!game.playingField
        .find(point => point.x === x
          && point.y === y)
      ) {
        return { x, y }
      }
      x = incDirection(x, xDirection, game.maxX)
    }
    y = incDirection(y, yDirection, game.maxY)
  }
}

module.exports = computerTurn
