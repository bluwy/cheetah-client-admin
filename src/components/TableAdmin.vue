<template>
  <v-data-table
    v-if="isPrivilegeFull"
    :headers="headers"
    :items="admins"
    :loading="!!loadingCount"
    hide-default-footer
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Admins</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="mr-3" icon color="primary" @click="refetch()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <dialog-admin-create v-model="dialogCreate">
          <template #activator>
            <v-btn color="primary" @click.stop="dialogCreate = true">
              <v-icon left>mdi-plus-circle</v-icon>
              Create
            </v-btn>
          </template>
        </dialog-admin-create>
        <dialog-admin-delete v-model="dialogDelete" :adminId="targetAdminId"></dialog-admin-delete>
      </v-toolbar>
    </template>
    <template #item.privilege="{ item }">
      <v-chip small :color="getPrivilegeColor(item.privilege)">
        {{ item.privilege }}
      </v-chip>
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Remove admin</span>
        <template #activator="{ on }">
          <v-btn icon small color="error" v-on="on" @click.stop="openDialogDelete(item.id)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogAdminCreate from '@/components/DialogAdminCreate.vue'
import DialogAdminDelete from '@/components/DialogAdminDelete.vue'
import ADMIN_GET_ALL from '@/graphql/AdminGetAll.graphql'

export default {
  name: 'TableAdmin',
  apollo: {
    admins: {
      query: ADMIN_GET_ALL,
      loadingKey: 'loadingCount'
    }
  },
  components: {
    DialogAdminCreate,
    DialogAdminDelete
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Privilege', value: 'privilege' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    admins: [],
    dialogCreate: false,
    dialogDelete: false,
    targetAdminId: ''
  }),
  computed: {
    ...mapGetters([
      'isPrivilegeFull'
    ])
  },
  methods: {
    refetch () {
      this.$apollo.queries.admins.refetch()
    },
    getPrivilegeColor (privilege) {
      switch (privilege.toLowerCase()) {
        case 'full':
          return 'success'
        case 'basic':
          return 'warning'
        default:
          return ''
      }
    },
    openDialogDelete (adminId) {
      this.targetAdminId = adminId
      this.dialogDelete = true
    }
  }
}
</script>

<style>

</style>
