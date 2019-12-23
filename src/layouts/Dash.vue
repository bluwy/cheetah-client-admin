<template>
  <v-app>
    <v-app-bar
      app
      elevation="0"
    >
      <v-toolbar-title class="app-bar__title">
        e-Job Sheet
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        class="mr-2"
        large
        text
        to="jobs"
      >
        Jobs
      </v-btn>
      <v-btn
        class="mr-2"
        large
        text
        to="customers"
      >
        Customers
      </v-btn>
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn
            large
            text
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
            to="staffs"
          >
            <v-list-item-icon>
              <v-icon>mdi-worker</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>View staffs</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="isPrivilegeFull"
            to="admins"
          >
            <v-list-item-icon>
              <v-icon>mdi-shield-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>View admins</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="handleLogout()">
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
import { mapActions, mapState, mapGetters } from 'vuex'
import SnackbarGlobal from '@/components/SnackbarGlobal.vue'
import ADMIN_GET from '@/graphql/AdminGet.graphql'

export default {
  name: 'Dash',
  apollo: {
    admin: {
      query: ADMIN_GET,
      variables () {
        return {
          id: this.userData.id
        }
      },
      skip () {
        return !this.userData.id
      }
    }
  },
  components: {
    SnackbarGlobal
  },
  data: () => ({
    admin: {}
  }),
  computed: {
    ...mapState([
      'userData'
    ]),
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

.app-bar__title {
  text-transform: capitalize;
}

.nav-list__item--inactive {
  opacity: .8;
}

.nav-list__item--active {
  opacity: 1;
}
</style>
