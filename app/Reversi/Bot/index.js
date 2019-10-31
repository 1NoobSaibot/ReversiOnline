'use strict'

const BotHard = use('./BotHard.js')
const BotVar = use('./BotVarComplexity.js')
const Prepare = use('./PrepareData.js')
const Field = use('App/Models/Field')
const Transform = use('App/Reversi/Transform')
const Board = use('App/Reversi/Board')

async function move (board, hard) {
  let moves = await Prepare(board)
  if (hard) return BotHard(moves)
  return BotVar(moves)
}

async function learn(game) {
  //Сбор игровой статистики
  const winner = game.getWinner()

  const stack = game.stack;
  for (let i = 0; i < stack.length; i++) {
    const move = stack[i];
    let field = await Field.search(move.ffm);
    if (!field) {
      let transform = new Transform(move.ffm);
      transform = transform.toMinDt();
      let groups = transform.getGroups(move.possibleMoves);
      if (groups.length > 1) {
        const { x, y } = transform.translate({ x: move.x, y: move.y });
        let options = [];
        options[x] = [];
        options[x][y] = getNewOption(winner, move.player);
        field = await Field.create({
          dt: transform.getDt().toString(),
          last_time: Date.now() / 1000,
          options
        });
      }
    }
    else {
      const result = getResult(winner, move.player);
      field.add(move.x, move.y, result);
    }
    if (field) await field.save();
  }
}

function getNewOption(winner, player) {
  if (winner == Board.Cell.Empty) return { w: 0, d: 1, l: 0 };
  if (winner == player) return { w: 1, d: 0, l: 0 };
  return { w: 0, d: 0, l: 1 };
}

function getResult(winner, player) {
  if (winner == Board.Cell.Empty) return 1;
  if (winner == player) return 2;
  return 0;
}

module.exports = { move, learn }
