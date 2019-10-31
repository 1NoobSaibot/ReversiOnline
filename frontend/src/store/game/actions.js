export async function start ({ dispatch, getters }) {
  let res = (await this.$axios.get('/game/simple/start')).data
  if (res !== 'GameIsReady') throw new Error('ERROR! Game is not ready')
  await dispatch('updateGame')
  if (getters.isCpuMove) await dispatch('cpuMove')
  return res
}

export async function move ({ dispatch, getters }, params) {
  let res = (await this.$axios.get('/game/simple/move', { params })).data
  if (res === 'accepted') {
    await dispatch('updateGame')
    if (getters.gameOver) {
      await dispatch('gameOver')
    } else if (getters.isCpuMove) {
      await dispatch('cpuMove')
    }
  }
  return res
}

export async function cpuMove ({ dispatch, state, getters }) {
  let accepted = false
  do {
    if (state.settings.sleep) await sleep(4000)
    let res = (await this.$axios.get('game/simple/cpumove')).data
    if (res === 'accepted') {
      accepted = true
      await dispatch('updateGame')
      if (getters.gameOver) {
        await dispatch('gameOver')
        break
      }
    }
  } while (!getters.gameOver && getters.isCpuMove)
  return accepted
}

export async function gameOver ({ getters }) {
  console.log(`Game Over. White(${getters.wCount}) Black(${getters.bCount})`)
}

export async function updateGame ({ commit, state }) {
  let arg = { params: { tips: state.settings.tips } }
  let game = (await this.$axios.get('/game/simple/game', arg)).data
  commit('setGame', game)
}

export async function run ({ dispatch, state, getters }) {
  do {
    await dispatch('start')
    do {
      await dispatch('cpuMove')
      await dispatch('updateGame')
    } while (!getters.gameOver && state.isRunning)
    if (getters.gameOver) await dispatch('gameOver')
  } while (state.isRunning)
}

async function sleep (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
