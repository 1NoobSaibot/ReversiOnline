<template>
  <Game :value="$store.state.game.game"></Game>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('game/start')
  }
}
</script>
