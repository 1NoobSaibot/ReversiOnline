<template>
  <table @click="onClick">
    <BoardRow :v="m ? m[0] : null" :probs="probs ? probs[0] : null"/>
    <BoardRow :v="m ? m[1] : null" :probs="probs ? probs[1] : null"/>
    <BoardRow :v="m ? m[2] : null" :probs="probs ? probs[2] : null"/>
    <BoardRow :v="m ? m[3] : null" :probs="probs ? probs[3] : null"/>
    <BoardRow :v="m ? m[4] : null" :probs="probs ? probs[4] : null"/>
    <BoardRow :v="m ? m[5] : null" :probs="probs ? probs[5] : null"/>
    <BoardRow :v="m ? m[6] : null" :probs="probs ? probs[6] : null"/>
    <BoardRow :v="m ? m[7] : null" :probs="probs ? probs[7] : null"/>
  </table>
</template>

<script>
export default {
  props: ['m', 'probs'],
  methods: {
    async onClick (event) {
      let target = event.target
      if (target.tagName !== 'TD') return
      let x = target.cellIndex
      let y = target.parentNode.rowIndex
      await this.$store.dispatch('game/move', { x, y })
    }
  }
}
</script>
