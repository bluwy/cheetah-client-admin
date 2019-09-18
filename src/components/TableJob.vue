<template>
  <v-data-table
    :headers="headers"
    :items="jobs"
    :server-items-length="queryLimit"
    :page.sync="page"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :options.sync="options"
    :loading="loading"
    must-sort
  ></v-data-table>
</template>

<script>
import gql from 'graphql-tag'
import { snakeCase } from 'lodash-es'

export default {
  name: 'TableJob',
  apollo: {
    jobs: {
      query: gql`
        query GetJobs($sortBy: JobSortBy, $sortDesc: Boolean, $limit: Int, $offset: Int) {
          jobs(sortBy: $sortBy, sortDesc: $sortDesc, limit: $limit, offset: $offset) {
            customer {
              name
            }
            dateIssued
          }
        }
      `,
      variables () {
        return {
          sortBy: snakeCase(this.sortBy).toUpperCase(),
          sortDesc: this.sortDesc,
          limit: this.queryLimit,
          offset: this.pageOffset
        }
      }
    }
  },
  props: {
    queryLimit: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    loading: false,
    headers: [
      { text: 'Customer', value: 'customer.name' },
      { text: 'Date Issued', value: 'dateIssued' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    options: {},
    page: 1,
    sortBy: 'id',
    sortDesc: false,
    jobs: []
  }),
  watch: {
    options: {
      deep: true,
      handler (val) {
        console.log(val)
      }
    }
  },
  computed: {
    pageOffset () {
      return this.queryLimit * (this.page - 1)
    }
  }
}
</script>

<style>

</style>
