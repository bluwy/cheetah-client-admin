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
            <v-icon large left>mdi-account-circle</v-icon>
            <span class="ml-3">{{ username }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in userMenuItems"
            :key="item.title"
            link
            :to="item.link"
            @click="item.action || false"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
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
  </v-app>
</template>

<script>
export default {
  name: 'Dash',
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
      }
    ],
    username: 'John Bob',
    userMenuItems: [
      {
        title: 'Profile',
        icon: 'mdi-account',
        link: '/settings#profile'
      },
      {
        title: 'Settings',
        icon: 'mdi-settings',
        link: '/settings'
      },
      {
        title: 'Log out',
        icon: 'mdi-logout',
        action: () => {}
      }
    ]
  })
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
