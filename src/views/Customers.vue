<template>
  <v-container grid-list-xl>
    <v-layout column>
      <v-flex class="text-right">
        <v-btn color="primary" @click.stop="createCustomer">
          <v-icon left>mdi-plus-circle</v-icon>
          Create customer
        </v-btn>
      </v-flex>
      <v-flex>
        <v-data-table
          :headers="customerHeaders"
          :items="customers"
          :server-items-length="10"
        ></v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Customers',
  computed: {
    ...mapState('customers', [
      'customerHeaders',
      'customers'
    ])
  },
  methods: {
    createCustomer () {

    }
  }
}
</script>

<style>

</style>
