<template>
  <tr>
    <Cell :c="v ? v[0] : 0" :prob="probs ? probs[0] : null"></Cell>
    <Cell :c="v ? v[1] : 0" :prob="probs ? probs[1] : null"></Cell>
    <Cell :c="v ? v[2] : 0" :prob="probs ? probs[2] : null"></Cell>
    <Cell :c="v ? v[3] : 0" :prob="probs ? probs[3] : null"></Cell>
    <Cell :c="v ? v[4] : 0" :prob="probs ? probs[4] : null"></Cell>
    <Cell :c="v ? v[5] : 0" :prob="probs ? probs[5] : null"></Cell>
    <Cell :c="v ? v[6] : 0" :prob="probs ? probs[6] : null"></Cell>
    <Cell :c="v ? v[7] : 0" :prob="probs ? probs[7] : null"></Cell>
  </tr>
</template>

<style scoped>
tr {
  height: 30px;
}
</style>

<script>
export default {
  props: ['v', 'probs']
}
</script>
