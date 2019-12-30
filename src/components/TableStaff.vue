<template>
  <v-data-table
    :headers="headers"
    :items="staffs"
    :loading="!!loadingCount"
    hide-default-footer
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
        <dialog-staff-create v-model="dialogCreate" />
        <dialog-staff-update
          ref="dialogUpdate"
          v-model="dialogUpdate"
        />
        <dialog-staff-reset-password
          ref="dialogResetPassword"
          v-model="dialogResetPassword"
        />
        <dialog-staff-delete
          ref="dialogDelete"
          v-model="dialogDelete"
        />
      </v-toolbar>
    </template>
    <template #item.username="{ item }">
      <span>{{ item.username }}</span>
      <v-tooltip
        v-if="item.passwordForgotten"
        top
      >
        <span>Staff has forgotten his/her password</span>
        <template #activator="{ on }">
          <v-icon
            right
            dense
            color="warning"
            v-on="on"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-tooltip>
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Update staff</span>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            color="warning"
            v-on="on"
            @click.stop="$refs.dialogUpdate.open(item.id)"
          >
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Reset password</span>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            color="error"
            v-on="on"
            @click.stop="$refs.dialogResetPassword.open(item.id)"
          >
            <v-icon small>
              mdi-lock
            </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Remove staff</span>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            color="error"
            v-on="on"
            @click.stop="$refs.dialogDelete.open(item.id)"
          >
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import DialogStaffCreate from '@/components/DialogStaffCreate.vue'
import DialogStaffUpdate from '@/components/DialogStaffUpdate.vue'
import DialogStaffDelete from '@/components/DialogStaffDelete.vue'
import DialogStaffResetPassword from '@/components/DialogStaffResetPassword.vue'
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'

export default {
  name: 'TableStaff',
  apollo: {
    staffs: {
      query: STAFF_GET_ALL,
      loadingKey: 'loadingCount'
    }
  },
  components: {
    DialogStaffCreate,
    DialogStaffUpdate,
    DialogStaffResetPassword,
    DialogStaffDelete
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Full Name', value: 'fullName' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    staffs: [],
    dialogCreate: false,
    dialogUpdate: false,
    dialogResetPassword: false,
    dialogDelete: false
  }),
  methods: {
    refetch () {
      this.$apollo.queries.staffs.refetch()
    }
  }
}
</script>

<style>

</style>
