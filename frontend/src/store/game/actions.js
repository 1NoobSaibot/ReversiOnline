export async function move ({ dispatch, getters }, params) {
  let res = (await this.$axios.get('/game/simple/move', { params })).data
  if (res === 'accepted') {
    await dispatch('updateGame')
    if (getters.gameOver) {
      await dispatch('restart')
    } else if (getters.isCpuMove) {
      await dispatch('cpuMove')
    }
  }
  return res
}

export async function start ({ dispatch, getters }) {
  let res = (await this.$axios.get('/game/simple/start')).data
  if (res !== 'GameIsReady') throw new Error('ERROR! Game is not ready')
  await dispatch('updateGame')
  if (getters.isCpuMove) await dispatch('cpuMove')
  return res
}

export async function cpuMove ({ dispatch, getters }) {
  let accepted = false
  do {
    let res = (await this.$axios.get('game/simple/cpumove')).data
    if (res === 'accepted') {
      accepted = true
      dispatch('updateGame')
      if (getters.gameOver) {
        dispatch('restart')
        break
      }
    }
  } while (getters.isCpuMove)
  return accepted
}

export async function restart ({ dispatch }) {
  await dispatch('start')
}

export async function updateGame ({ commit, state }) {
  let arg = { params: { tips: state.settings.tips } }
  let game = (await this.$axios.get('/game/simple/game', arg)).data
  commit('setGame', game)
}
