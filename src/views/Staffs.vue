<template>
  <v-container grid-list-xl>
    <v-layout column>
      <v-flex class="text-right">
        <v-btn color="primary" @click.stop="createStaff">
          <v-icon left>mdi-plus-circle</v-icon>
          Create staff
        </v-btn>
      </v-flex>
      <v-flex>
        <v-data-table
          :headers="staffHeaders"
          :items="staffs"
          :server-items-length="10"
        ></v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Staffs',
  computed: {
    ...mapState('staffs', [
      'staffHeaders',
      'staffs'
    ])
  },
  methods: {
    createStaff () {

    }
  }
}
</script>

<style>

</style>
