<template>
  <v-container>
    <section>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <dialog-create-job
            v-model="createJobDialog"
            @create="$refs.table.refetch()"
          ></dialog-create-job>
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
import DialogCreateJob from '@/components/DialogCreateJob.vue'
import TableJob from '@/components/TableJob.vue'

export default {
  name: 'Jobs',
  components: {
    DialogCreateJob,
    TableJob
  },
  data: () => ({
    createJobDialog: false
  })
}
</script>

<style>

</style>
