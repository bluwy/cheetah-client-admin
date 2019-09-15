<template>
  <v-container>
    <section>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn color="primary" @click.stop="createCustomerDialog = true">
            <v-icon left>mdi-import</v-icon>
            Import
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <dialog-create-customer v-model="createCustomerDialog"></dialog-create-customer>
          <v-btn color="primary" @click.stop="createCustomerDialog = true">
            <v-icon left>mdi-plus-circle</v-icon>
            Create
          </v-btn>
        </v-col>
      </v-row>
    </section>
    <section>
      <v-data-table
        :headers="customerHeaders"
        :items="customers"
        :server-items-length="10"
      ></v-data-table>
    </section>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import DialogCreateCustomer from '@/components/DialogCreateCustomer.vue'

export default {
  name: 'Customers',
  components: {
    DialogCreateCustomer
  },
  data: () => ({
    createCustomerDialog: false
  }),
  computed: {
    ...mapState('customers', [
      'customerHeaders',
      'customers'
    ])
  }
}
</script>

<style>

</style>
