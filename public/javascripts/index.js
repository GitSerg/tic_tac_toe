const state = {
  hashId: null,
  playingField: {},
  text: document.createElement('p'),
}
function sendData(url, data, cb) {
  let xhr = new XMLHttpRequest()
  xhr.open('POST', url, [true])
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'json'
  xhr.send(JSON.stringify(data))
  xhr.onload = () => cb(xhr.response);
}
const playingField = []
const body = document.getElementsByTagName('body')[0]
const field = document.createElement('dir')
body.append(field)
body.append(state.text)
sendData('/game/newgame', {}, (game) => {
  state.game = game
  state.hashId = game.hashId
})
const texts = {
  win_x: 'Player win!!!',
  win_o: 'Computer win!!!',
  win_draw: 'Draw',
}
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    const butt = document.createElement('button')
    playingField[`${i},${j}`] = {
      button: butt,
    }
    butt.onclick = function () {
      sendData(
        `game/click/${state.hashId}`,
        { click: { x: i, y: j } },
        (responseObj) => {
          console.log('answer', responseObj)
          const { enemyTurn, playerTurn } = responseObj
          if (responseObj.answer === 'not_free') return
          if (
            playerTurn
            && playerTurn.x === i
            && playerTurn.y === j
          ) {
            butt.innerText = "x"
          }
          if (texts[responseObj.answer]) {
            state.text.innerText = texts[responseObj.answer]
          }
          if (enemyTurn) {
            const { x, y } = enemyTurn
            playingField[`${x},${y}`].button.innerText = 'o'
          }
        }
      )
    }
    field.append(butt)
  }
  field.append(document.createElement('br'))
}

