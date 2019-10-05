<template>
  <td :class="c === 1 ? 'white' : 'black'">{{ c ? '⬤' : ' ' }}</td>
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
  text-align: center
}
</style>

<script>
export default {
  props: ['c']
}
</script>
