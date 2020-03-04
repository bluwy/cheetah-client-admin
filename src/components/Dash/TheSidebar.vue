<template>
  <v-navigation-drawer
    width="400"
    app
    hide-overlay
    right
  >
    <v-expansion-panels
      :value="activePanel"
      flat
    >
      <v-fade-transition
        class="transition-group"
        group
        leave-absolute
      >
        <component
          :is="item.component"
          v-for="item in sidebarItems"
          v-show="!item.hidden"
          :key="item.key"
          v-bind="item.props"
          class="panel ma-3 mb-0"
          @hide="updateSidebarItemHidden({ key: item.key, hidden: true })"
          @unhide="updateSidebarItemHidden({ key: item.key, hidden: false })"
          @close="removeSidebarItem({ key: item.key })"
        />
      </v-fade-transition>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DashTheSidebar',
  data: () => ({
    activePanel: 0
  }),
  computed: {
    ...mapState(['sidebarItems']),
    sidebarItemsCount () {
      return this.sidebarItems.length
    }
  },
  watch: {
    sidebarItemsCount (val, oldVal) {
      if (val > oldVal) {
        // When add, open last
        this.activePanel = val - 1
      }
    }
  },
  methods: {
    ...mapActions([
      'removeSidebarItem',
      'updateSidebarItemHidden'
    ])
  }
}
</script>

<style scoped>
.panel {
  flex-basis: 80%;
}

.transition-group {
  width: 100%;
  height: 100%;
}
</style>
