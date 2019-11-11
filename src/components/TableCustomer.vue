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
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Customers</v-toolbar-title>
        <v-spacer></v-spacer>
        <dialog-customer-create v-model="dialogCreate" @create="refetch()">
          <template #activator>
            <v-btn color="primary" @click.stop="dialogCreate = true">
              <v-icon left>mdi-plus-circle</v-icon>
              Create
            </v-btn>
          </template>
        </dialog-customer-create>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
import { snakeCase } from 'lodash-es'
import DialogCustomerCreate from '@/components/DialogCustomerCreate.vue'
import CUSTOMER_GET_ALL from '@/graphql/CustomerGetAll.graphql'

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
  components: {
    DialogCustomerCreate
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
    customers: [],
    dialogCreate: false
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
