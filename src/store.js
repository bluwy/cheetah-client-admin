import Vue from 'vue'
import Vuex from 'vuex'
import { isEmpty } from 'lodash-es'
import { apolloClient } from './plugins/apollo'
import { authToken } from './utils/localStorage'

import ADMIN_CHECK from '@/graphql/AdminCheck.graphql'
import ADMIN_LOGIN from '@/graphql/AdminLogin.graphql'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userChecked: false,
    userData: {}
  },
  mutations: {
    SET_USER_CHECKED (state, { val }) {
      state.userChecked = !!val
    },
    SET_USER_DATA (state, { data }) {
      state.userData = data || {}
    }
  },
  actions: {
    // Used by router
    async checkUser ({ state, commit }, { force = false } = {}) {
      if (!force && state.userChecked) { return }

      commit('SET_USER_CHECKED', { val: true })

      const token = authToken()

      if (token) {
        try {
          const { data: { checkAdmin: userData } } = await apolloClient.query({
            query: ADMIN_CHECK,
            variables: { token }
          })

          commit('SET_USER_DATA', { data: userData })
        } catch (e) {
          console.log(e)
          commit('SET_USER_DATA', { data: null })
        }
      }
    },
    uncheckUser ({ commit }) {
      commit('SET_USER_CHECKED', { val: false })
    },
    async login ({ commit }, { username, password }) {
      try {
        const { data: { loginAdmin } } = await apolloClient.mutate({
          mutation: ADMIN_LOGIN,
          variables: { username, password }
        })

        if (loginAdmin.success) {
          authToken(loginAdmin.token)
          commit('SET_USER_DATA', { data: loginAdmin.userData })
          commit('SET_USER_CHECKED', { val: true })
          return true
        } else {
          throw new Error(loginAdmin.message)
        }
      } catch (e) {
        commit('SET_USER_DATA', { data: null })
        throw e
      }
    },
    logout ({ commit }) {
      authToken(null)
      commit('SET_USER_DATA', { data: null })
      return true
    }
  },
  getters: {
    isAuthed (state) {
      return !isEmpty(state.userData)
    },
    isPrivilegeFull (state, getters) {
      return getters.isAuthed && state.userData.privilege.toLowerCase() === 'full'
    },
    isPrivilegeBasic (state, getters) {
      return getters.isAuthed && state.userData.privilege.toLowerCase() === 'basic'
    }
  }
})
