import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import state from './state'

import settings from './settings'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    settings
  }
}
