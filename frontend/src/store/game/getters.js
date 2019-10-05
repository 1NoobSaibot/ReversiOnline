export function gameOver (state) {
  return state.game.board.gameOver
}

export function isCpuMove (state) {
  return state.game.cpuSide === state.game.board.currentPlayer
}

export function board (state) {
  return state.game.board
}
