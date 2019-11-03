<template>
  <v-data-table
    :headers="headers"
    :items="staffs"
    :loading="!!loadingCount"
  >
    <template #header>
      <dialog-staff-edit v-model="dialogEdit" :staffId="targetStaffId"></dialog-staff-edit>
      <dialog-staff-remove v-model="dialogRemove" :staffId="targetStaffId"></dialog-staff-remove>
    </template>
    <template #item.action="{ item }">
      <v-btn icon small @click.stop="openDialogEdit(item.id)">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon small>mdi-lock</v-icon>
      </v-btn>
      <v-btn icon small @click.stop="openDialogRemove(item.id)">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import DialogStaffEdit from './DialogStaffEdit.vue'
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
    DialogStaffEdit,
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
    dialogEdit: false,
    dialogRemove: false,
    targetStaffId: '0'
  }),
  methods: {
    openDialogEdit (staffId) {
      this.targetStaffId = staffId
      this.dialogEdit = true
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
