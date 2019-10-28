<template>
  <div>
    <div>White({{wCounter()}}) Black({{bCounter()}}) </div>
    <Board
      :m="value ? value.board.m : null"
      :probs="value ? value.board.probs : null"
    />
    <GameSettings/>
  </div>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    wCounter () {
      return this.$store.getters['game/wCount']
    },
    bCounter () {
      return this.$store.getters['game/bCount']
    }
  }
}
</script>
