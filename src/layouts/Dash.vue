<template>
  <v-app>
    <v-app-bar
      app
      elevate-on-scroll
    >
      <v-toolbar-title>
        <v-btn
          text
          to="/"
        >
          E-JOB
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn
            large
            text
            color="primary"
            v-on="on"
          >
            <v-icon
              large
              :left="!!admin.username"
            >
              mdi-account-circle
            </v-icon>
            <span
              v-if="admin.username"
              class="ml-3"
            >{{ admin.username }}</span>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-if="isPrivilegeFull"
            color="primary"
            to="/manage"
            link
          >
            <v-list-item-icon>
              <v-icon>mdi-shield</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Manage</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            color="primary"
            @click="handleLogout()"
          >
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Log out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <transition mode="out-in">
        <router-view />
      </transition>
    </v-content>
    <snackbar-global />
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SnackbarGlobal from '@/components/Common/SnackbarGlobal.vue'
import ADMIN_GET_ONE from '@/graphql/Admin/GetOne.graphql'

export default {
  name: 'Dash',
  apollo: {
    admin: {
      // Get session admin
      query: ADMIN_GET_ONE
    }
  },
  components: {
    SnackbarGlobal
  },
  data: () => ({
    admin: {}
  }),
  computed: {
    ...mapGetters([
      'isPrivilegeFull'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    async handleLogout () {
      if (await this.logout()) {
        this.$router.push({ path: '/login' })
      }
    }
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
