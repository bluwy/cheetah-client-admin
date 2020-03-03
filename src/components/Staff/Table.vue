<template>
  <v-data-table
    :headers="headers"
    :items="staffs"
    :loading="!!loadingCount"
    :search="searchQuery"
    sort-by="username"
    hide-default-footer
    must-sort
    @click:row="openSidebarItemInfo()"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Staffs</v-toolbar-title>
        <v-spacer />
        <v-text-field
          v-if="searchable"
          v-model="searchQuery"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
        <v-btn
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <template #item.paired="{ item }">
      <v-icon
        v-if="item.paired"
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
    <template #item.active="{ item }">
      <v-checkbox
        class="my-0 py-0"
        :input-value="item.active"
        hide-details
        dense
        @change="updateActive(item.id, $event.target.checked)"
      />
    </template>
    <template #item.menu="{ item }">
      <table-item-menu :staff-id="item.id" />
    </template>
  </v-data-table>
</template>

<script>
import StaffSidebarItemInfo from '@/components/Admin/SidebarItemInfo.vue'
import TableItemMenu from '@/components/Staff/TableItemMenu.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import STAFF_GET_ALL from '@/graphql/Staff/GetAll.graphql'
import STAFF_UPDATE from '@/graphql/Staff/Update.graphql'

export default {
  name: 'StaffTable',
  apollo: {
    staffs: {
      query: STAFF_GET_ALL,
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
    TableItemMenu
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
      { text: 'Full Name', value: 'fullName' },
      { text: 'Device Paired', value: 'paired' },
      { text: 'Active', value: 'active' },
      { text: '', value: 'menu', sortable: false }
    ],
    searchQuery: '',
    staffs: []
  }),
  methods: {
    refetch () {
      this.$apollo.queries.staffs.refetch()
    },
    openSidebarItemInfo (staffId) {
      this.addSidebarItem({
        component: StaffSidebarItemInfo,
        props: {
          staffId
        }
      })
    },
    async updateActive (staffId, newActive) {
      try {
        await this.$apollo.mutate({
          mutation: STAFF_UPDATE,
          variables: { id: staffId, active: newActive }
        })
      } catch (e) {
        console.error(e)

        pushSnack({ color: 'error', message: 'Unable to toggle active' })
      }
    }
  }
}
</script>
