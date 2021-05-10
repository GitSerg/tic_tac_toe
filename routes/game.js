const express = require('express');
const router = express.Router();
const Game = require('../db/schemas/game')
const { CROSS, ZERO } = require('../consts')
const checkWin = require('../model/game/checkWin')
const computerTurn = require('../model/game/computerTurn')
const pushPoint = require('../model/game/pushPoint')

router.post('/newgame', async (req, res) => {
  const newGame = new Game({})
  await newGame.save()
  res.json(newGame.toObject())
})

const inProgress = {}
router.post('/click/:hashId', async (req, res) => {
  try {
    const result = await click(req)
    res.json(result)
  } catch (error) {
    console.error(error)
    if (error.response) {
      console.error(error.response)
    }
    res.json({
      answer: error,
      message: error.message || error,
      stask: error.stack,
    })
  }
})
async function click(req) {
  const { hashId } = req.params
  // принимаем ход и сразу отвечаем ходом противника
  if (inProgress[hashId]) return { answer: 'processing' }
  const { click: { x, y } } = req.body
  const game = await Game.findOne({ hashId }).exec()
  if (!game) return {
    answer: 'game_not_found',
  }
  if (game.state.indexOf('win') > -1) return {
    answer: game.state,
    game: game.toObject(),
  }
  game.currentTurn += 1
  let enemyTurn
  let winState
  if (
    game.playingField
      .find(point => point.x === x
        && point.y === y)
  ) {
    return {
      answer: 'not_free'
    }
  } else {
    pushPoint(game, { x, y }, true)
    winState = checkWin(game)
    if (!winState) {
      enemyTurn = computerTurn(game)
      if (enemyTurn) pushPoint(game, enemyTurn)
      // console.log('     enemyTurn', game, enemyTurn)
    }
  }
  if (!winState) {
    winState = checkWin(game)
  }
  if (winState === CROSS) {
    game.state = 'win_x'
  } else if (winState === ZERO) {
    game.state = 'win_o'
  }
  if (game.playingField.length >= game.maxX * game.maxY) {
    game.state = 'win_draw'
  }
  await game.save()
  delete inProgress[hashId]
  return {
    answer: game.state,
    game: game.toObject(),
    playerTurn: { x, y },
    enemyTurn,
  }
}

router.post('/state/:hashId', async (req, res) => {
  const { hashId } = req.params
  const game = await Game.findOne({ hashId }).lean().exec()
  res.json(game)
})

module.exports = router;
