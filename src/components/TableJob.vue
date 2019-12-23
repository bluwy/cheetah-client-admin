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
        <v-btn class="mr-3" icon color="primary" @click="refetch()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <dialog-job-create v-model="dialogCreate" @create-job="refetch()">
          <template #activator>
            <v-btn color="primary" @click.stop="dialogCreate = true">
              <v-icon left>mdi-plus-circle</v-icon>
              Create
            </v-btn>
          </template>
        </dialog-job-create>
        <dialog-job-details v-model="dialogDetails" :jobId="targetJobId"></dialog-job-details>
        <dialog-assignment-create v-model="dialogAssignmentCreate" :jobId="targetJobId"></dialog-assignment-create>
        <dialog-job-delete v-model="dialogDelete" :jobId="targetJobId" @delete-job="refetch()"></dialog-job-delete>
      </v-toolbar>
    </template>
    <template #item.dateIssued="{ item }">
      {{ formatIssueDate(item.dateIssued) }}
    </template>
    <template #item.needsFollowUp="{ item }">
      <v-icon v-if="item.needsFollowUp" small>$warning</v-icon>
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Details</span>
        <template #activator="{ on }">
          <v-btn icon small color="primary" v-on="on" @click="openDialogDetails(item.id)">
            <v-icon small>mdi-information</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Add assignment</span>
        <template #activator="{ on }">
          <v-btn icon small color="warning" :disabled="!item.needsFollowUp" v-on="on" @click="openDialogAssignmentCreate(item.id)">
            <v-icon small>mdi-file-plus</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Remove job</span>
        <template #activator="{ on }">
          <v-btn icon small color="error" v-on="on" @click="openDialogDelete(item.id)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { format } from 'date-fns'
import DialogAssignmentCreate from '@/components/DialogAssignmentCreate.vue'
import DialogJobCreate from '@/components/DialogJobCreate.vue'
import DialogJobDetails from '@/components/DialogJobDetails.vue'
import DialogJobDelete from '@/components/DialogJobDelete.vue'
import JOB_GET_ALL from '@/graphql/JobGetAll.graphql'

export default {
  name: 'TableJob',
  apollo: {
    jobs: {
      query: JOB_GET_ALL,
      variables () {
        return {
          offset: this.queryOffset,
          limit: this.queryLimit,
          orderBy: this.queryOrderBy,
          where: this.queryWhere
        }
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    DialogAssignmentCreate,
    DialogJobCreate,
    DialogJobDetails,
    DialogJobDelete
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
      { text: 'Code', value: 'code' },
      { text: 'Customer', value: 'customer.name', sortable: false },
      { text: 'Date Issued', value: 'dateIssued' },
      { text: 'Follow Up', value: 'needsFollowUp' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    page: 1,
    sortBy: 'id',
    sortDesc: false,
    jobs: [],
    dialogCreate: false,
    dialogDetails: false,
    dialogAssignmentCreate: false,
    dialogDelete: false,
    targetJobId: ''
  }),
  computed: {
    queryOffset () {
      return this.queryLimit * (this.page - 1)
    },
    queryOrderBy () {
      return { [this.sortBy]: this.sortDesc ? 'desc' : 'asc' }
    },
    queryWhere () {
      return {}
    }
  },
  methods: {
    refetch () {
      this.$apollo.queries.jobs.refetch()
    },
    formatIssueDate (issueDate) {
      return format(new Date(issueDate), 'd MMM yyyy')
    },
    openDialogDetails (jobId) {
      this.targetJobId = jobId
      this.dialogDetails = true
    },
    openDialogAssignmentCreate (jobId) {
      this.targetJobId = jobId
      this.dialogAssignmentCreate = true
    },
    openDialogDelete (jobId) {
      this.targetJobId = jobId
      this.dialogDelete = true
    }
  }
}
</script>

<style>

</style>
