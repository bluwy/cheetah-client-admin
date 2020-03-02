<template>
  <v-app>
    <the-app-bar />
    <the-sidebar />
    <v-content>
      <transition mode="out-in">
        <router-view />
      </transition>
    </v-content>
    <snackbar-global />
  </v-app>
</template>

<script>
import TheAppBar from '@/components/Dash/TheAppBar.vue'
import TheSidebar from '@/components/Dash/TheSidebar.vue'
import SnackbarGlobal from '@/components/Common/SnackbarGlobal.vue'

export default {
  name: 'Dash',
  components: {
    TheAppBar,
    TheSidebar,
    SnackbarGlobal
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
