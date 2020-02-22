<template>
  <v-data-table
    :headers="headers"
    :items="jobs"
    :server-items-length="jobCount"
    :items-per-page.sync="queryLimit"
    :page.sync="page"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :loading="!!loadingCount"
    :footer-props="{ itemsPerPageOptions: [5, 10, 15, 20] }"
    must-sort
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
        <v-spacer />
        <v-text-field
          v-if="searchable"
          v-model="searchQuery"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
        <v-btn
          class="mr-3"
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <dialog-job-details
          ref="dialogDetails"
          v-model="dialogDetails"
        />
        <dialog-job-delete
          ref="dialogDelete"
          v-model="dialogDelete"
          @delete-job="refetch()"
        />
      </v-toolbar>
    </template>
    <template #item.dateIssued="{ item }">
      {{ formatIssueDate(item.dateIssued) }}
    </template>
    <template #item.needsFollowUp="{ item }">
      <v-icon
        v-if="item.needsFollowUp"
        small
      >
        $warning
      </v-icon>
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Details</span>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            color="primary"
            v-on="on"
            @click="$refs.dialogDetails.open(item.id)"
          >
            <v-icon small>
              mdi-information
            </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Remove job</span>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            color="error"
            v-on="on"
            @click="$refs.dialogDelete.open(item.id)"
          >
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { format } from 'date-fns'
import DialogJobDetails from '@/components/DialogJobDetails.vue'
import DialogJobDelete from '@/components/DialogJobDelete.vue'
import JOB_GET_ALL from '@/graphql/JobGetAll.graphql'
import JOB_COUNT from '@/graphql/JobCount.graphql'

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
    },
    jobCount: {
      query: JOB_COUNT,
      variables () {
        return {
          where: this.queryWhere
        }
      }
    }
  },
  components: {
    DialogJobDetails,
    DialogJobDelete
  },
  props: {
    tableTitle: {
      type: String,
      default: 'Jobs'
    },
    searchable: {
      type: Boolean,
      default: false
    },
    extraQueryWhere: {
      type: Object,
      default: () => undefined
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Code', value: 'code' },
      { text: 'Customer', value: 'customer.name', sortable: false },
      { text: 'Date Issued', value: 'dateIssued' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    page: 1,
    queryLimit: 20,
    sortBy: 'dateIssued',
    sortDesc: true,
    searchQuery: '',
    jobs: [],
    jobCount: 0,
    dialogDetails: false,
    dialogDelete: false
  }),
  computed: {
    queryOffset () {
      return this.queryLimit * (this.page - 1)
    },
    queryOrderBy () {
      return { [this.sortBy]: this.sortDesc ? 'desc' : 'asc' }
    },
    queryWhere () {
      const andWheres = []

      if (this.extraQueryWhere) {
        andWheres.push(this.extraQueryWhere)
      }

      if (this.searchable && this.searchQuery) {
        andWheres.push({
          OR: [
            { code: { contains: this.searchQuery } },
            { customer: { name: { contains: this.searchQuery } } }
          ]
        })
      }

      return andWheres.length > 0 ? { AND: andWheres } : undefined
    }
  },
  methods: {
    refetch () {
      this.$apollo.queries.jobs.refetch()
    },
    formatIssueDate (issueDate) {
      return format(new Date(issueDate), 'd MMM yyyy')
    }
  }
}
</script>

<style>

</style>
