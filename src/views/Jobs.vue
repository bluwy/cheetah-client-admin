<template>
  <v-container>
    <section>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <dialog-job-create
            v-model="createJobDialog"
            @create="$refs.table.refetch()"
          ></dialog-job-create>
          <v-btn color="primary" @click.stop="createJobDialog = true">
            <v-icon left>mdi-plus-circle</v-icon>
            Create
          </v-btn>
        </v-col>
      </v-row>
    </section>
    <section>
      <table-job ref="table"></table-job>
    </section>
  </v-container>
</template>

<script>
import DialogJobCreate from '@/components/DialogJobCreate.vue'
import TableJob from '@/components/TableJob.vue'

export default {
  name: 'Jobs',
  components: {
    DialogJobCreate,
    TableJob
  },
  data: () => ({
    createJobDialog: false
  })
}
</script>

<style>

</style>
