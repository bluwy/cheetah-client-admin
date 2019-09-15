<template>
  <v-container>
    <section>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <dialog-create-job v-model="createJobDialog"></dialog-create-job>
          <v-btn color="primary" @click.stop="createJobDialog = true">
            <v-icon left>mdi-plus-circle</v-icon>
            Create
          </v-btn>
        </v-col>
      </v-row>
    </section>
    <section>
      <v-data-table
        :headers="jobHeaders"
        :items="jobs"
        :server-items-length="10"
      ></v-data-table>
    </section>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import DialogCreateJob from '@/components/DialogCreateJob.vue'

export default {
  name: 'Jobs',
  components: {
    DialogCreateJob
  },
  data: () => ({
    createJobDialog: false
  }),
  computed: {
    ...mapState('jobs', [
      'jobHeaders',
      'jobs'
    ])
  }
}
</script>

<style>

</style>
