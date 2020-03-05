<template>
  <v-app>
    <the-app-bar />
    <the-sidebar
      :value="$vuetify.breakpoint.smAndDown ? sidebarOpen : true"
      @input="setSidebarOpen({ value: $event })"
    />
    <v-content>
      <v-container v-if="$vuetify.breakpoint.smAndDown">
        <v-row no-gutters>
          <v-spacer />
          <v-btn
            text
            @click="setSidebarOpen({ value: !sidebarOpen })"
          >
            Toggle Sidebar
            <v-icon right>
              mdi-menu
            </v-icon>
          </v-btn>
        </v-row>
      </v-container>
      <transition mode="out-in">
        <router-view />
      </transition>
    </v-content>
    <snackbar-global />
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TheAppBar from '@/components/Dash/TheAppBar.vue'
import TheSidebar from '@/components/Dash/TheSidebar.vue'
import SnackbarGlobal from '@/components/Common/SnackbarGlobal.vue'

export default {
  name: 'Dash',
  components: {
    TheAppBar,
    TheSidebar,
    SnackbarGlobal
  },
  computed: {
    ...mapState(['sidebarOpen'])
  },
  methods: {
    ...mapActions(['setSidebarOpen'])
  }
}
</script>

<style scoped>
.v-enter-active, .v-leave-active {
  transition: opacity .2s ease;
}

.v-enter, .v-leave-to {
  opacity: 0;
}
</style>
