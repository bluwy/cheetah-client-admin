<template>
  <v-data-table
    :headers="headers"
    :items="staffs"
    :loading="!!loadingCount"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Staffs</v-toolbar-title>
        <v-spacer></v-spacer>
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
      <v-btn icon small @click.stop="openDialogEdit(item.id)">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon small @click.stop="openDialogPasswordReset(item.id)">
        <v-icon small>mdi-lock</v-icon>
      </v-btn>
      <v-btn icon small @click.stop="openDialogRemove(item.id)">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import DialogStaffCreate from '@/components/DialogStaffCreate.vue'
import DialogStaffEdit from './DialogStaffEdit.vue'
import DialogStaffPasswordReset from './DialogStaffPasswordReset.vue'
import DialogStaffRemove from './DialogStaffRemove.vue'
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
  methods: {
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
