<template>
  <v-container>
    <section>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <dialog-staff-create v-model="createStaffDialog"></dialog-staff-create>
          <v-btn color="primary" @click.stop="createStaffDialog = true">
            <v-icon left>mdi-plus-circle</v-icon>
            Create
          </v-btn>
        </v-col>
      </v-row>
    </section>
    <section>
      <table-staff></table-staff>
    </section>
  </v-container>
</template>

<script>
import DialogStaffCreate from '@/components/DialogStaffCreate.vue'
import TableStaff from '@/components/TableStaff.vue'

export default {
  name: 'Staffs',
  components: {
    DialogStaffCreate,
    TableStaff
  },
  data: () => ({
    createStaffDialog: false
  })
}
</script>

<style>

</style>
