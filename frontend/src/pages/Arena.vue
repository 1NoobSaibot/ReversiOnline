<template>
  <div>
    <Game :value="$store.state.game.game"/>
    <q-form>
      <q-checkbox v-model="tips">Tips</q-checkbox>
      <q-checkbox v-model="hardBot">Hard Mode</q-checkbox>
      <q-checkbox v-model="sleep">CPU Sleep</q-checkbox>
    </q-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tips: false,
      hardBot: false,
      sleep: false,
      isRunning: false
    }
  },
  computed: {
    isGameOver () {
      return this.$store.getters['game/isOver']
    }
  },
  methods: {
    async run () {
      this.isRunning = true
      let i = 0
      do {
        await this.$store.dispatch('game/start')
        do {
          await this.$store.dispatch('game/cpuMove', { tips: this.tips ? true : undefined })
          await this.threadSleep(5)
        } while (!this.isGameOver)
        console.log(`Game ${i++} is over`)
      } while (this.isRunning)
    },
    async threadSleep (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, ms)
      })
    }
  },
  async mounted () {
    this.run()
  },
  beforeRouteLeave () {
    this.isRunning = false
  }
}
</script>
