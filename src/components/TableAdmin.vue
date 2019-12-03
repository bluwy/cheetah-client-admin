<template>
  <v-data-table
    :headers="headers"
    :items="admins"
    :loading="!!loadingCount"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Admins</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="mr-3" icon color="primary" @click="refetch()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <dialog-admin-create v-model="dialogCreate" @create="refetch()">
          <template #activator>
            <v-btn color="primary" @click.stop="dialogCreate = true">
              <v-icon left>mdi-plus-circle</v-icon>
              Create
            </v-btn>
          </template>
        </dialog-admin-create>
        <dialog-admin-remove v-model="dialogRemove" :adminId="targetAdminId"></dialog-admin-remove>
      </v-toolbar>
    </template>
    <template #item.privilege="{ item }">
      <v-chip small>
        {{ item.privilege }}
      </v-chip>
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Remove admin</span>
        <template #activator="{ on }">
          <v-btn icon small v-on="on" @click.stop="openDialogRemove(item.id)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import DialogAdminCreate from '@/components/DialogAdminCreate.vue'
import DialogAdminRemove from '@/components/DialogAdminRemove.vue'
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
    DialogAdminRemove
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
    dialogRemove: false,
    targetAdminId: '0'
  }),
  methods: {
    refetch () {
      this.$apollo.queries.admins.refetch()
    },
    openDialogRemove (adminId) {
      this.targetAdminId = adminId
      this.dialogRemove = true
    }
  }
}
</script>

<style>

</style>
