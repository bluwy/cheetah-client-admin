<template>
  <v-data-table
    v-if="isPrivilegeFull"
    :headers="headers"
    :items="staffs"
    :loading="!!loadingCount"
    hide-default-footer
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Staffs</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="mr-3" icon color="primary" @click="refetch()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <dialog-staff-create v-model="dialogCreate">
          <template #activator>
            <v-btn color="primary" @click.stop="dialogCreate = true">
              <v-icon left>mdi-plus-circle</v-icon>
              Create
            </v-btn>
          </template>
        </dialog-staff-create>
        <dialog-staff-update v-model="dialogUpdate" :staffId="targetStaffId"></dialog-staff-update>
        <dialog-staff-reset-password v-model="dialogResetPassword" :staffId="targetStaffId"></dialog-staff-reset-password>
        <dialog-staff-delete v-model="dialogDelete" :staffId="targetStaffId"></dialog-staff-delete>
      </v-toolbar>
    </template>
    <template #item.username="{ item }">
      <span>{{ item.username }}</span>
      <v-tooltip v-if="item.passwordForgotten" top>
        <span>Staff has forgotten his/her password</span>
        <template #activator="{ on }">
          <v-icon right color="warning" v-on="on">mdi-alert-circle</v-icon>
        </template>
      </v-tooltip>
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Update staff</span>
        <template #activator="{ on }">
          <v-btn icon small color="warning" v-on="on" @click.stop="openDialogUpdate(item.id)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Reset password</span>
        <template #activator="{ on }">
          <v-btn icon small color="error" v-on="on" @click.stop="openDialogResetPassword(item.id)">
            <v-icon small>mdi-lock</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Remove staff</span>
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
    dialogDelete: false,
    targetStaffId: ''
  }),
  computed: {
    ...mapGetters([
      'isPrivilegeFull'
    ])
  },
  methods: {
    refetch () {
      this.$apollo.queries.staffs.refetch()
    },
    openDialogUpdate (staffId) {
      this.targetStaffId = staffId
      this.dialogUpdate = true
    },
    openDialogResetPassword (staffId) {
      this.targetStaffId = staffId
      this.dialogResetPassword = true
    },
    openDialogDelete (staffId) {
      this.targetStaffId = staffId
      this.dialogDelete = true
    }
  }
}
</script>

<style>

</style>
