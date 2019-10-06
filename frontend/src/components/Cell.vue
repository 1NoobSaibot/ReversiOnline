<template>
  <td :class="c === 1 ? 'white' : 'black'">{{ value }}</td>
</template>

<style scoped>
.white {
  color: white
}
.black {
  color: black
}
td {
  width: 30px;
  background-color: darkgreen;
  text-align: center;
  font-size: 18px
}
</style>

<script>
export default {
  props: ['c', 'prob'],
  computed: {
    value () {
      if (this.c) return '⬤'
      if (this.prob) {
        let s = (this.prob.w + this.prob.d + this.prob.l)
        let r = 100 * this.prob.w / s
        r = Math.trunc(r)
        return r > 99 ? 99 : r
      }
      return ' '
    }
  }
}
</script>
