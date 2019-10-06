<template>
  <q-form>
    <q-checkbox v-model="tips" @input="valueChanged">Tips</q-checkbox>
  </q-form>
</template>

<script>
export default {
  data: () => {
    return {
      tips: false
    }
  },
  methods: {
    valueChanged (value) {
      this.$store.commit('game/settings/tips', value)
    }
  }
}
</script>
