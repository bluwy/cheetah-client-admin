import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebarItems: [],
    sidebarMaxItems: 20
  },
  mutations: {
    ADD_SIDEBAR_ITEM (state, { component, props, hidden }) {
      if (state.sidebarItems.length < state.sidebarMaxItems) {
        state.sidebarItems.push({ component, props, hidden })
      }
    },
    REMOVE_SIDEBAR_ITEM_INDEX (state, { index }) {
      state.sidebarItems.splice(index)
    },
    UPDATE_SIDEBAR_ITEM_HIDDEN (state, { index, hidden }) {
      if (index < state.sidebarItems.length) {
        state.sidebarItems[index].hidden = hidden
      }
    }
  },
  actions: {
    addSidebarItem ({ commit }, { component, props, hidden = false }) {
      commit('ADD_SIDEBAR_ITEM', { component, props, hidden })
    },
    removeSidebarItemIndex ({ commit }, { index }) {
      commit('REMOVE_SIDEBAR_ITEM_INDEX', { index })
    },
    updateSidebarItemHidden ({ commit }, { index, hidden }) {
      commit('UPDATE_SIDEBAR_ITEM_HIDDEN', { index, hidden })
    }
  }
})
