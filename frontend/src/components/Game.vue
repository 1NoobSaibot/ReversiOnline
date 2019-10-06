<template>
  <div>
    <div>White({{wCounter}}) Black({{bCounter}}) </div>
    <Board :m="value ? value.board.m : null"/>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data: () => {
    return {
      wCounter: 0,
      bCounter: 0
    }
  },
  watch: {
    value (game) {
      this.wCounter = 0
      this.bCounter = 0
      if (!game) return
      let m = game.board.m
      for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
          if (m[i][j] === 1) this.wCounter++
          else if (m[i][j] === 2) this.bCounter++
        }
      }
    }
  }
}
</script>
