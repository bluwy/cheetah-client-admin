<template>
  <v-app>
    <v-app-bar app elevation="0">
      <v-app-bar-nav-icon @click.stop="sideNavOpen = !sideNavOpen"></v-app-bar-nav-icon>
      <v-toolbar-title class="app-bar__title">
        {{ $route.name }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn large text v-on="on">
            <v-icon large :left="!!admin.username">mdi-account-circle</v-icon>
            <span v-if="admin.username" class="ml-3">{{ admin.username }}</span>
          </v-btn>
        </template>
        <v-list dense>
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
    <v-navigation-drawer v-model="sideNavOpen" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline text-center">
            {{ appTitle }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list nav>
        <v-list-item
          v-for="item in sideNavItems"
          :key="item.title"
          :to="item.link"
          class="nav-list__item--inactive"
          active-class="nav-list__item--active"
          color="primary"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
    <snackbar-global></snackbar-global>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
    appTitle: 'Hello Title',
    sideNavOpen: null,
    sideNavItems: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        link: '/dashboard'
      },
      {
        title: 'Jobs',
        icon: 'mdi-briefcase',
        link: '/jobs'
      },
      {
        title: 'Customers',
        icon: 'mdi-account-multiple',
        link: '/customers'
      },
      {
        title: 'Staffs',
        icon: 'mdi-worker',
        link: '/staffs'
      },
      {
        title: 'Admins',
        icon: 'mdi-shield-account',
        link: '/admins'
      }
    ],
    admin: {}
  }),
  computed: {
    ...mapState([
      'userData'
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
