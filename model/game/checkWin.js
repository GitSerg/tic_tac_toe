const { CROSS, ZERO } = require('../../consts')

const winCombo = []
for (let i = 1; i <= 3; i++) {
  winCombo.push([[i,1],[i,2],[i,3]])
  winCombo.push([[1,i],[2,i],[3,i]])
}
winCombo.push([[1,1],[2,2],[3,3]])
winCombo.push([[1,3],[2,2],[3,1]])
// console.log(winCombo)
function checkWin(game) {
  for (let i = 0; i < winCombo.length; i++) {
    const combo = winCombo[i]
    let xWin = true
    let oWin = true
    for (let index = 0; index < 3; index++) {
      const point = combo[index]
      if (!game.playingField.find(gpoint =>
        gpoint.x === point[0]
        && gpoint.y === point[1]
        && gpoint.value === CROSS)) {
          xWin = false
        }
      if (!game.playingField.find(gpoint =>
        gpoint.x === point[0]
        && gpoint.y === point[1]
        && gpoint.value === ZERO)) {
          oWin = false
        }
    }
    if (xWin) return CROSS
    if (oWin) return ZERO
  }
  return false
}
// Game.findOne({ hashId: 'e2738dc53dcd6240eba4f9d9b043e40e3c61d3c0' }).exec((err, game) => {
//   console.log('checkWin(game)', checkWin(game))
// })

module.exports = checkWin
