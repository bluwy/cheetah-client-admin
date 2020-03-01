import Vue from 'vue'
import Vuex from 'vuex'
import { isEmpty } from 'lodash-es'
import { apolloClient } from './plugins/apollo'
import AUTH_LOGIN from '@/graphql/Auth/Login.graphql'
import AUTH_LOGOUT from '@/graphql/Auth/Logout.graphql'
import ADMIN_GET_ONE from '@/graphql/Admin/GetOne.graphql'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: {}
  },
  mutations: {
    SET_USER_DATA (state, { data }) {
      state.userData = data || {}
    }
  },
  actions: {
    /** Gets the user data if doesn't exist, unless force */
    async getUserData ({ state, commit }, { force = false } = {}) {
      if (!force && state.userData != null) { return }

      // Get self data, calling AMIN_GET_ONE without id gets current session data
      const { data: { admin } } = await apolloClient.mutate({
        mutation: ADMIN_GET_ONE
      })

      if (admin != null) {
        commit('SET_USER_DATA', { data: admin })

        return true
      } else {
        commit('SET_USER_DATA', { data: undefined })

        throw new Error('Invalid session')
      }
    },
    removeUserData ({ commit }) {
      commit('SET_USER_DATA', { data: undefined })
    },
    async login ({ commit, dispatch }, { username, password }) {
      try {
        const { data: { loginAdmin } } = await apolloClient.mutate({
          mutation: AUTH_LOGIN,
          variables: { username, password }
        })

        if (loginAdmin) {
          await dispatch('getUserData')

          return true
        } else {
          throw new Error('Unable to login')
        }
      } catch (e) {
        commit('SET_USER_DATA', { data: undefined })

        throw e
      }
    },
    async logout ({ commit }) {
      try {
        const { data: { logoutAdmin } } = await apolloClient.mutate({
          mutation: AUTH_LOGOUT
        })

        if (!logoutAdmin) {
          throw new Error('Unable to logout')
        }
      } catch (e) {
        // If logout failed, just log to console, no need to prevent client.
        // This is because the session if not logout will also expire anyway.
        console.error(e)
      }

      commit('SET_USER_DATA', { data: undefined })

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
