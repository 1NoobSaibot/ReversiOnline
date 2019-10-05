import Game from '../components/Game.vue'
import Board from '../components/Board.vue'
import BoardRow from '../components/BoardRow.vue'
import Cell from '../components/Cell.vue'

export default ({ Vue }) => {
  Vue.component('Game', Game)
  Vue.component('Board', Board)
  Vue.component('BoardRow', BoardRow)
  Vue.component('Cell', Cell)
}
