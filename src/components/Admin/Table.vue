<template>
  <v-data-table
    :headers="headers"
    :items="admins"
    :loading="!!loadingCount"
    :search="searchQuery"
    class="overflow-hidden"
    sort-by="username"
    hide-default-footer
    must-sort
    @click:row="openSidebarItemInfo($event.id)"
  >
    <template #top>
      <v-toolbar
        flat
        color="primary lighten-5"
      >
        <v-toolbar-title>Admins</v-toolbar-title>
        <v-spacer />
        <input-search
          v-if="searchable"
          v-model="searchQuery"
        />
        <v-btn
          class="mx-3"
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          @click.stop="openSidebarItemCreate()"
        >
          <v-icon left>
            mdi-plus-circle
          </v-icon>
          Add Admin
        </v-btn>
      </v-toolbar>
    </template>
    <template #item.privilege="{ item }">
      <v-icon
        v-if="item.privilege === 'FULL'"
        small
        color="success"
      >
        mdi-check
      </v-icon>
      <v-icon
        v-else
        small
        color="error"
      >
        mdi-close
      </v-icon>
    </template>
    <template #item.menu="{ item }">
      <table-item-menu :admin-id="item.id" />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions } from 'vuex'
import AdminSidebarItemCreate from '@/components/Admin/SidebarItemCreate.vue'
import AdminSidebarItemInfo from '@/components/Admin/SidebarItemInfo.vue'
import InputSearch from '@/components/Common/InputSearch.vue'
import TableItemMenu from '@/components/Admin/TableItemMenu.vue'
import ADMIN_GET_ALL from '@/graphql/Admin/GetAll.graphql'

export default {
  name: 'AdminTable',
  apollo: {
    admins: {
      query: ADMIN_GET_ALL,
      variables () {
        return this.searchable && this.searchQuery ? {
          query: this.searchQuery
        } : undefined
      },
      fetchPolicy () {
        return this.searchable && this.searchQuery ? 'network-only' : 'cache-first'
      },
      debounce: 300,
      loadingKey: 'loadingCount'
    }
  },
  components: {
    TableItemMenu,
    InputSearch
  },
  props: {
    searchable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Full Access', value: 'privilege' },
      { text: '', value: 'menu', sortable: false }
    ],
    searchQuery: '',
    admins: []
  }),
  methods: {
    ...mapActions(['addSidebarItem']),
    refetch () {
      this.$apollo.queries.admins.refetch()
    },
    openSidebarItemCreate () {
      this.addSidebarItem({ component: AdminSidebarItemCreate })
    },
    openSidebarItemInfo (adminId) {
      this.addSidebarItem({
        component: AdminSidebarItemInfo,
        props: {
          adminId
        }
      })
    }
  }
}
</script>
