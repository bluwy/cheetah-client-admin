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
        <staff-dialog-reset-device
          ref="dialogResetDevice"
          v-model="dialogResetDevice"
        />
        <staff-dialog-delete
          ref="dialogDelete"
          v-model="dialogDelete"
        />
      </v-toolbar>
    </template>
    <template #item.linked="{ item }">
      <v-icon
        v-if="item.linked"
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
        @change="toggleActive(item)"
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
            @click.stop="$refs.dialogResetDevice.open(item.id)"
          >
            <v-list-item-icon>
              <v-icon>mdi-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Reset device</v-list-item-title>
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
import StaffDialogCreate from '@/components/Staff/DialogCreate.vue'
import StaffDialogUpdate from '@/components/Staff/DialogUpdate.vue'
import StaffDialogDelete from '@/components/Staff/DialogDelete.vue'
import StaffDialogResetDevice from '@/components/Staff/DialogResetDevice.vue'
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
    StaffDialogResetDevice
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Full Name', value: 'fullName' },
      { text: 'Device Linked', value: 'linked' },
      { text: 'Active', value: 'active' },
      { text: '', value: 'menu', sortable: false }
    ],
    staffs: [],
    dialogCreate: false,
    dialogUpdate: false,
    dialogResetDevice: false,
    dialogDelete: false
  }),
  methods: {
    refetch () {
      this.$apollo.queries.staffs.refetch()
    },
    async toggleActive (staff) {
      const { id, active } = staff

      try {
        await this.$apollo.mutate({
          mutation: STAFF_UPDATE,
          variables: { id, active: !active }
        })
      } catch (e) {
        console.error(e)

        snackbarPush({ color: 'error', message: 'Unable to toggle active' })
      }
    }
  }
}
</script>

<style>

</style>
