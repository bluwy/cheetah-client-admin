import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebarItems: [],
    sidebarItemsCounter: 0,
    sidebarMaxItems: 20
  },
  mutations: {
    ADD_SIDEBAR_ITEM (state, { component, props, hidden }) {
      if (state.sidebarItems.length < state.sidebarMaxItems) {
        const key = state.sidebarItemsCounter++
        state.sidebarItems.push({ key, component, props, hidden })
      }
    },
    REMOVE_SIDEBAR_ITEM (state, { key }) {
      state.sidebarItems = state.sidebarItems.filter(v => v.key !== key)
    },
    UPDATE_SIDEBAR_ITEM_HIDDEN (state, { key, hidden }) {
      const index = state.sidebarItems.findIndex(v => v.key === key)

      if (~index) {
        state.sidebarItems[index].hidden = hidden
      }
    }
  },
  actions: {
    addSidebarItem ({ commit }, { component, props, hidden = false }) {
      commit('ADD_SIDEBAR_ITEM', { component, props, hidden })
    },
    removeSidebarItem ({ commit }, { key }) {
      commit('REMOVE_SIDEBAR_ITEM', { key })
    },
    updateSidebarItemHidden ({ commit }, { key, hidden }) {
      commit('UPDATE_SIDEBAR_ITEM_HIDDEN', { key, hidden })
    }
  }
})
