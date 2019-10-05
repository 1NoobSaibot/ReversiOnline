<template>
  <div>
    <div>Это мой первый компонент Game</div>
    <Board :m="value ? value.board.m : null"/>
  </div>
</template>

<script>
export default {
  props: ['value']
}
</script>
