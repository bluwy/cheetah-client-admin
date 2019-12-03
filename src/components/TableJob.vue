<template>
  <v-data-table
    :headers="headers"
    :items="jobs"
    :server-items-length="queryLimit"
    :page.sync="page"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :loading="!!loadingCount"
    must-sort
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Jobs</v-toolbar-title>
        <v-spacer></v-spacer>
        <dialog-job-create v-model="dialogCreate" @create="refetch()">
          <template #activator>
            <v-btn color="primary" @click.stop="dialogCreate = true">
              <v-icon left>mdi-plus-circle</v-icon>
              Create
            </v-btn>
          </template>
        </dialog-job-create>
        <dialog-job-details v-model="dialogDetails" :jobId="targetJobId"></dialog-job-details>
        <dialog-assignment-add v-model="dialogAssignmentAdd" :jobId="targetJobId"></dialog-assignment-add>
      </v-toolbar>
    </template>
    <template #item.dateIssued="{ item }">
      {{ formatIssueDate(item.dateIssued) }}
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Details</span>
        <template #activator="{ on }">
          <v-btn icon small v-on="on" @click="openDialogDetails(item.id)">
            <v-icon small>mdi-information</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Add assignment</span>
        <template #activator="{ on }">
          <v-btn icon small :disabled="!canAddAssignment(item)" v-on="on" @click="openDialogAssignmentAdd(item.id)">
            <v-icon small>mdi-file-plus</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Remove job</span>
        <template #activator="{ on }">
          <v-btn icon small v-on="on">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { format } from 'date-fns'
import { snakeCase } from 'lodash-es'
import DialogAssignmentAdd from '@/components/DialogAssignmentAdd.vue'
import DialogJobCreate from '@/components/DialogJobCreate.vue'
import DialogJobDetails from '@/components/DialogJobDetails.vue'
import JOB_GET_ALL from '@/graphql/JobGetAll.graphql'

export default {
  name: 'TableJob',
  apollo: {
    jobs: {
      query: JOB_GET_ALL,
      variables () {
        return {
          sortBy: this.jobSortBy,
          sortDesc: this.sortDesc,
          limit: this.queryLimit,
          offset: this.pageOffset
        }
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    DialogAssignmentAdd,
    DialogJobCreate,
    DialogJobDetails
  },
  props: {
    queryLimit: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Customer', value: 'customer.name', sortable: false },
      { text: 'Date Issued', value: 'dateIssued' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    page: 1,
    sortBy: 'id',
    sortDesc: false,
    jobs: [],
    dialogCreate: false,
    dialogDetails: false,
    dialogAssignmentAdd: false,
    targetJobId: '0'
  }),
  computed: {
    pageOffset () {
      return this.queryLimit * (this.page - 1)
    },
    jobSortBy () {
      return snakeCase(this.sortBy).toUpperCase()
    }
  },
  methods: {
    refetch () {
      console.log(this.$apollo.queries)
      this.$apollo.queries.jobs.refetch()
    },
    formatIssueDate (issueDate) {
      return format(issueDate, 'd MMM yyyy')
    },
    canAddAssignment (job) {
      if (!job.assignments || !job.assignments.length) {
        return true
      } else {
        const last = job.assignments[job.assignments.length - 1]
        return last.checkIn != null && last.checkOut != null && last.needsFollowUp
      }
    },
    openDialogDetails (jobId) {
      this.targetJobId = jobId
      this.dialogDetails = true
    },
    openDialogAssignmentAdd (jobId) {
      this.targetJobId = jobId
      this.dialogAssignmentAdd = true
    }
  }
}
</script>

<style>

</style>
