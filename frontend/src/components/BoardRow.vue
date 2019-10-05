<template>
  <tr>
    <Cell :c="v ? v[0] : 0"></Cell>
    <Cell :c="v ? v[1] : 0"></Cell>
    <Cell :c="v ? v[2] : 0"></Cell>
    <Cell :c="v ? v[3] : 0"></Cell>
    <Cell :c="v ? v[4] : 0"></Cell>
    <Cell :c="v ? v[5] : 0"></Cell>
    <Cell :c="v ? v[6] : 0"></Cell>
    <Cell :c="v ? v[7] : 0"></Cell>
  </tr>
</template>

<style scoped>
tr {
  height: 30px;
}
</style>

<script>
export default {
  props: ['v']
}
</script>
