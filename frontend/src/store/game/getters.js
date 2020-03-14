export function isOver (state) {
  return state.game.board.gameOver
}

export function isCpuMove (state) {
  return state.game.cpuSide === state.game.board.currentPlayer
}

export function board (state) {
  return state.game.board
}

export function wCount (state) {
  try {
    let sum = 0
    let m = state.game.board.m
    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m[i].length; j++) {
        if (m[i][j] === 1) sum++
      }
    }
    return sum
  } catch {}
  return 0
}

export function bCount (state) {
  try {
    let sum = 0
    let m = state.game.board.m
    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m[i].length; j++) {
        if (m[i][j] === 2) sum++
      }
    }
    return sum
  } catch {}
  return 0
}
