<template>
  <v-container grid-list-xl>
    <v-layout column>
      <v-flex class="text-right">
        <v-btn color="primary" @click.stop="createJob">
          <v-icon left>mdi-plus-circle</v-icon>
          Create job
        </v-btn>
      </v-flex>
      <v-flex>
        <v-data-table
          :headers="jobHeaders"
          :items="jobs"
          :server-items-length="10"
        ></v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Jobs',
  computed: {
    ...mapState('jobs', [
      'jobHeaders',
      'jobs'
    ])
  },
  methods: {
    createJob () {

    }
  }
}
</script>

<style>

</style>
