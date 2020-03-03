<template>
  <v-navigation-drawer
    app
    clipped
    hide-overlay
    right
  >
    <v-expansion-panels multiple>
      <component
        :is="item.component"
        v-for="(item, i) in sidebarItems"
        v-show="!item.hidden"
        :key="i"
        v-bind="item.props"
        @hide="updateSidebarItemHidden({ index: i, hidden: true })"
        @unhide="updateSidebarItemHidden({ index: i, hidden: false })"
        @close="removeSidebarItemIndex({ index: i })"
      />
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DashTheSidebar',
  computed: {
    ...mapState(['sidebarItems'])
  },
  methods: {
    ...mapActions([
      'removeSidebarItemIndex',
      'updateSidebarItemHidden'
    ])
  }
}
</script>
