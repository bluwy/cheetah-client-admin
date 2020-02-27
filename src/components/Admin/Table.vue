<template>
  <v-data-table
    :headers="headers"
    :items="admins"
    :loading="!!loadingCount"
    sort-by="username"
    hide-default-footer
    must-sort
    @click:row="$refs.dialogInfo.open($event.id)"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Admins</v-toolbar-title>
        <v-spacer />
        <v-btn
          class="mr-3"
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          @click.stop="dialogCreate = true"
        >
          <v-icon left>
            mdi-plus-circle
          </v-icon>
          Create
        </v-btn>
        <admin-dialog-create v-model="dialogCreate" />
        <admin-dialog-delete
          ref="dialogDelete"
          v-model="dialogDelete"
        />
        <admin-dialog-info
          ref="dialogInfo"
          v-model="dialogInfo"
        />
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
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="primary"
            v-on="on"
          >
            <v-icon>
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            color="primary"
            @click.stop="$refs.dialogInfo.open(item.id)"
          >
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Info</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            color="error"
            @click.stop="$refs.dialogDelete.open(item.id)"
          >
            <v-list-item-icon>
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Remove</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>

<script>
import AdminDialogCreate from '@/components/Admin/DialogCreate.vue'
import AdminDialogDelete from '@/components/Admin/DialogDelete.vue'
import AdminDialogInfo from '@/components/Admin/DialogInfo.vue'
import ADMIN_GET_ALL from '@/graphql/Admin/GetAll.graphql'

export default {
  name: 'TableAdmin',
  apollo: {
    admins: {
      query: ADMIN_GET_ALL,
      loadingKey: 'loadingCount'
    }
  },
  components: {
    AdminDialogCreate,
    AdminDialogDelete,
    AdminDialogInfo
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Full Access', value: 'privilege' },
      { text: '', value: 'menu', sortable: false }
    ],
    admins: [],
    dialogCreate: false,
    dialogDelete: false,
    dialogInfo: false
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
