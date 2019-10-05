import axios from 'axios'

export default async ({ Vue, store }) => {
  Vue.prototype.$axios = axios
  store.constructor.prototype.$axios = axios
}
