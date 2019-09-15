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
      <v-data-table
        :headers="staffHeaders"
        :items="staffs"
        :server-items-length="10"
      ></v-data-table>
    </section>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import DialogCreateStaff from '@/components/DialogCreateStaff.vue'

export default {
  name: 'Staffs',
  components: {
    DialogCreateStaff
  },
  data: () => ({
    createStaffDialog: false
  }),
  computed: {
    ...mapState('staffs', [
      'staffHeaders',
      'staffs'
    ])
  }
}
</script>

<style>

</style>
