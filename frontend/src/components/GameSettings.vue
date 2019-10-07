<template>
  <q-form>
    <q-checkbox v-model="tips" @input="valueChanged">Tips</q-checkbox>
    <q-checkbox v-model="hardBot" @input="setMode">Hard Mode</q-checkbox>
    <q-checkbox v-model="sleep" @input="setSleep">CPU Sleep</q-checkbox>
  </q-form>
</template>

<script>
export default {
  data: () => {
    return {
      tips: false,
      hardBot: false,
      sleep: false
    }
  },
  methods: {
    valueChanged (value) {
      this.$store.commit('game/settings/tips', value)
    },
    setMode (value) {
      this.$axios.get('/game/simple/cpumode', { params: { hard: value } })
    },
    setSleep (value) {
      this.$store.commit('game/settings/sleep', value)
    }
  }
}
</script>
