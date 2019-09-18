<template>
  <v-data-table
    :headers="headers"
    :items="customers"
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
  name: 'TableCustomer',
  apollo: {
    customers: {
      query: gql`
        query GetCustomers($temp: Boolean, $sortBy: CustomerSortBy, $sortDesc: Boolean, $limit: Int, $offset: Int) {
          customers(temp: $temp, sortBy: $sortBy, sortDesc: $sortDesc, limit: $limit, offset: $offset) {
            id
            code
            name
            address
            phoneNumber
            email
            personInCharge {
              username
            }
          }
        }
      `,
      variables () {
        return {
          temp: this.temp,
          sortBy: snakeCase(this.sortBy).toUpperCase(),
          sortDesc: this.sortDesc,
          limit: this.queryLimit,
          offset: this.pageOffset
        }
      }
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
    loading: false,
    headers: [
      { text: 'Code', value: 'code' },
      { text: 'Name', value: 'name' },
      { text: 'Address', value: 'address' },
      { text: 'Phone', value: 'phoneNumber' },
      { text: 'Email', value: 'email' },
      { text: 'PIC', value: 'personInCharge.username' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    options: {},
    page: 1,
    sortBy: 'id',
    sortDesc: false,
    customers: []
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
