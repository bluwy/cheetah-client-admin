<template>
  <v-navigation-drawer
    v-bind="$attrs"
    :width="$vuetify.breakpoint.smAndDown ? '100%' : '30%'"
    :mobile-break-point="$vuetify.breakpoint.thresholds.sm"
    :temporary="$vuetify.breakpoint.smAndDown"
    app
    stateless
    hide-overlay
    right
    disable-route-watcher
    v-on="$listeners"
  >
    <v-container v-if="$vuetify.breakpoint.smAndDown">
      <v-btn
        icon
        @click="$emit('input', false)"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-container>
    <v-expansion-panels
      v-model="activePanel"
      flat
    >
      <v-fade-transition
        class="transition-group"
        group
        leave-absolute
      >
        <component
          :is="item.component"
          v-for="(item, i) in sidebarItems"
          v-show="!item.hidden"
          :key="item.key"
          v-bind="item.props"
          class="panel ma-3 mb-0"
          @hide="handleUpdateSidebarItemHidden(i, { key: item.key, hidden: true })"
          @unhide="handleUpdateSidebarItemHidden(i, { key: item.key, hidden: false })"
          @close="handleRemoveSidebarItem(i, { key: item.key })"
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

        if (this.$vuetify.breakpoint.smAndDown) {
          this.setSidebarOpen({ value: true })
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'setSidebarOpen',
      'removeSidebarItem',
      'updateSidebarItemHidden'
    ]),
    validateActiveIndex (index) {
      if (this.activePanel === index) {
        this.activePanel = undefined
      }
    },
    handleSetSidebarOpen (index, arg) {
      this.validateActiveIndex(index)
      this.setSidebarOpen(arg)
    },
    handleRemoveSidebarItem (index, arg) {
      this.validateActiveIndex(index)
      this.removeSidebarItem(arg)
    },
    handleUpdateSidebarItemHidden (index, arg) {
      this.validateActiveIndex(index)
      this.updateSidebarItemHidden(arg)
    }
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
