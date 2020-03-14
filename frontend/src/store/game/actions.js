export async function start ({ commit }) {
  let game = (await this.$axios.get('/game/simple/start')).data
  commit('setGame', game)
}

export async function move ({ commit, dispatch, getters }, params) {
  let data = (await this.$axios.get('/game/simple/move', { params })).data
  if (data.status === 'success') {
    commit('setGame', data.game)
    if (getters.gameOver) {
      await dispatch('gameOver')
    } else if (getters.isCpuMove) {
      await dispatch('cpuMove')
    }
  }
  return data
}

export async function cpuMove ({ commit, dispatch, getters }, params) {
  let res = await this.$axios.get('game/simple/cpumove', { params })
  commit('setGame', res.data.game)
}

export async function updateGame ({ commit, state }, params) {
  let game = (await this.$axios.get('/game/simple/game', { params })).data
  commit('setGame', game)
}
