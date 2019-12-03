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
      </v-toolbar>
    </template>
    <template #item.privilege="{ item }">
      <v-chip small>
        {{ item.privilege }}
      </v-chip>
    </template>
    <template #item.action>
      <v-tooltip top>
        <span>Remove admin</span>
        <template #activator="{ on }">
          <v-btn icon small v-on="on">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import DialogAdminCreate from '@/components/DialogAdminCreate.vue'
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
    DialogAdminCreate
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Privilege', value: 'privilege' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    admins: [],
    dialogCreate: false
  }),
  methods: {
    refetch () {
      this.$apollo.queries.admins.refetch()
    }
  }
}
</script>

<style>

</style>
