<template>
  <v-data-table
    :headers="headers"
    :items="customers"
    :server-items-length="queryLimit"
    :page.sync="page"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :loading="!!loadingCount"
    must-sort
  ></v-data-table>
</template>

<script>
import CUSTOMER_GET_ALL from '@/graphql/CustomerGetAll.graphql'
import { snakeCase } from 'lodash-es'

export default {
  name: 'TableCustomer',
  apollo: {
    customers: {
      query: CUSTOMER_GET_ALL,
      variables () {
        return {
          temp: this.temp,
          sortBy: this.customerSortBy,
          sortDesc: this.sortDesc,
          limit: this.queryLimit,
          offset: this.pageOffset
        }
      },
      loadingKey: 'loadingCount'

    }
  },
  props: {
    temp: {
      type: Boolean,
      default: false
    },
    queryLimit: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Code', value: 'code' },
      { text: 'Name', value: 'name' },
      { text: 'Address', value: 'address' },
      { text: 'Phone', value: 'phoneNumber' },
      { text: 'Email', value: 'email' },
      { text: 'PIC', value: 'personInCharge.username', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    page: 1,
    sortBy: 'id',
    sortDesc: false,
    customers: []
  }),
  computed: {
    pageOffset () {
      return this.queryLimit * (this.page - 1)
    },
    customerSortBy () {
      return snakeCase(this.sortBy).toUpperCase()
    }
  },
  methods: {
    refetch () {
      console.log(this.$apollo.queries)
      this.$apollo.queries.customers.refetch()
    }
  }
}
</script>

<style>

</style>
