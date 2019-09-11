import Vue from 'vue'
import Vuex from 'vuex'
import customers from './store/customers'
import staffs from './store/staffs'
import jobs from './store/jobs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    customers,
    staffs,
    jobs
  },
  state: {

  },
  mutations: {

  },
  actions: {

  }
})
