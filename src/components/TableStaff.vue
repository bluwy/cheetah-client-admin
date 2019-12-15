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
        <dialog-staff-edit v-model="dialogEdit" :staffId="targetStaffId"></dialog-staff-edit>
        <dialog-staff-password-reset v-model="dialogPasswordReset" :staffId="targetStaffId"></dialog-staff-password-reset>
        <dialog-staff-remove v-model="dialogRemove" :staffId="targetStaffId"></dialog-staff-remove>
      </v-toolbar>
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Edit staff</span>
        <template #activator="{ on }">
          <v-btn icon small color="warning" v-on="on" @click.stop="openDialogEdit(item.id)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Reset password</span>
        <template #activator="{ on }">
          <v-btn icon small color="error" v-on="on" @click.stop="openDialogPasswordReset(item.id)">
            <v-icon small>mdi-lock</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Remove staff</span>
        <template #activator="{ on }">
          <v-btn icon small color="error" v-on="on" @click.stop="openDialogRemove(item.id)">
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
import DialogStaffEdit from '@/components/DialogStaffEdit.vue'
import DialogStaffPasswordReset from '@/components/DialogStaffPasswordReset.vue'
import DialogStaffRemove from '@/components/DialogStaffRemove.vue'
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
    DialogStaffEdit,
    DialogStaffPasswordReset,
    DialogStaffRemove
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
    dialogEdit: false,
    dialogPasswordReset: false,
    dialogRemove: false,
    targetStaffId: '0'
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
    openDialogEdit (staffId) {
      this.targetStaffId = staffId
      this.dialogEdit = true
    },
    openDialogPasswordReset (staffId) {
      this.targetStaffId = staffId
      this.dialogPasswordReset = true
    },
    openDialogRemove (staffId) {
      this.targetStaffId = staffId
      this.dialogRemove = true
    }
  }
}
</script>

<style>

</style>
