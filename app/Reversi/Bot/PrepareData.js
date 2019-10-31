'use strict'

const Field = use('App/Models/Field')

module.exports = async function cpuMove(board) {
  let counts = null
  const field = await Field.search(board.getFriendsFoes())
  const moves = board.getPossibleMoves()
  if (field) counts = field.getOptions()

  bindProbabilitiesToMoves(moves, counts)
  return moves
}

function bindProbabilitiesToMoves(moves, counts) {
  for (let i = 0; i < moves.length; i++) {
    const { x, y } = moves[i];
    if (!counts || !counts[x] || !counts[x][y]) {
      moves[i].w = 0.333;
      moves[i].d = 0.333;
      moves[i].l = 0.333;
    }
    else attachValue(moves[i], counts[x][y]);
  }
}

function attachValue(move, {w, d, l}) {
  const sum = (w + d + l) + 3.0
  move.w = (w + 1) / sum;
  move.d = (d + 1) / sum;
  move.l = (l + 1) / sum;
}
