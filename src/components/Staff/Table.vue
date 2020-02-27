<template>
  <v-data-table
    :headers="headers"
    :items="staffs"
    :loading="!!loadingCount"
    sort-by="username"
    hide-default-footer
    must-sort
    @click:row="$refs.dialogUpdate.open($event.id)"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Staffs</v-toolbar-title>
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
        <staff-dialog-create v-model="dialogCreate" />
        <staff-dialog-update
          ref="dialogUpdate"
          v-model="dialogUpdate"
        />
        <staff-dialog-reset-pairing
          ref="dialogResetPairing"
          v-model="dialogResetPairing"
        />
        <staff-dialog-delete
          ref="dialogDelete"
          v-model="dialogDelete"
        />
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
            color="warning"
            @click.stop="$refs.dialogResetPairing.open(item.id)"
          >
            <v-list-item-icon>
              <v-icon>mdi-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Reset pairing</v-list-item-title>
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
              <v-list-item-title>Remove staff</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>

<script>
import { required, maxStrLength } from '@/utils/inputRules'
import StaffDialogCreate from '@/components/Staff/DialogCreate.vue'
import StaffDialogUpdate from '@/components/Staff/DialogUpdate.vue'
import StaffDialogDelete from '@/components/Staff/DialogDelete.vue'
import StaffDialogResetPairing from '@/components/Staff/DialogResetPairing.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'
import STAFF_UPDATE from '@/graphql/StaffUpdate.graphql'

export default {
  name: 'TableStaff',
  apollo: {
    staffs: {
      query: STAFF_GET_ALL,
      loadingKey: 'loadingCount'
    }
  },
  components: {
    StaffDialogCreate,
    StaffDialogUpdate,
    StaffDialogDelete,
    StaffDialogResetPairing
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
    staffs: [],
    rules: {
      fullName: [required, maxStrLength(128)]
    },
    dialogCreate: false,
    dialogUpdate: false,
    dialogResetPairing: false,
    dialogDelete: false
  }),
  methods: {
    refetch () {
      this.$apollo.queries.staffs.refetch()
    },
    async updateActive (staffId, newActive) {
      try {
        await this.$apollo.mutate({
          mutation: STAFF_UPDATE,
          variables: { id: staffId, active: newActive }
        })
      } catch (e) {
        console.error(e)

        snackbarPush({ color: 'error', message: 'Unable to toggle active' })
      }
    }
  }
}
</script>
