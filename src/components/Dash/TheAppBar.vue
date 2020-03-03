<template>
  <v-app-bar
    app
    elevate-on-scroll
  >
    <v-toolbar-title>
      <v-btn
        large
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
          color="error"
          @click="logout()"
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
</template>

<script>
import { get } from 'lodash-es'
import ADMIN_GET_ONE from '@/graphql/Admin/GetOne.graphql'
import AUTH_LOGOUT from '@/graphql/Auth/Logout.graphql'

export default {
  name: 'DashTheAppBar',
  apollo: {
    admin: {
      // Get session admin
      query: ADMIN_GET_ONE
    }
  },
  data: () => ({
    admin: {}
  }),
  computed: {
    isPrivilegeFull () {
      return get(this.admin, 'privilege') === 'FULL'
    }
  },
  methods: {
    async logout () {
      try {
        const { data: { logoutAdmin } } = await this.$apollo.mutate({
          mutation: AUTH_LOGOUT
        })

        if (!logoutAdmin) {
          throw new Error('Unable to logout')
        }
      } catch (e) {
        // If logout failed, just log to console, no need to prevent client.
        // This is because the session if not logout will also expire anyway.
        console.error(e)
      }

      this.$router.push({ path: '/login' })
    }
  }
}
</script>
