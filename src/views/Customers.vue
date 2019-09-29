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
          <dialog-create-customer
            v-model="createCustomerDialog"
            @create="$refs.table.refetch()"
          ></dialog-create-customer>
          <v-btn color="primary" @click.stop="createCustomerDialog = true">
            <v-icon left>mdi-plus-circle</v-icon>
            Create
          </v-btn>
        </v-col>
      </v-row>
    </section>
    <section>
      <table-customer ref="table"></table-customer>
    </section>
  </v-container>
</template>

<script>
import DialogCreateCustomer from '@/components/DialogCreateCustomer.vue'
import TableCustomer from '@/components/TableCustomer.vue'

export default {
  name: 'Customers',
  components: {
    DialogCreateCustomer,
    TableCustomer
  },
  data: () => ({
    createCustomerDialog: false
  })
}
</script>

<style>

</style>
