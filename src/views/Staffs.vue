<template>
  <v-container>
    <section>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <dialog-create-staff v-model="createStaffDialog"></dialog-create-staff>
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
import DialogCreateStaff from '@/components/DialogCreateStaff.vue'
import TableStaff from '@/components/TableStaff.vue'

export default {
  name: 'Staffs',
  components: {
    DialogCreateStaff,
    TableStaff
  },
  data: () => ({
    createStaffDialog: false
  })
}
</script>

<style>

</style>
