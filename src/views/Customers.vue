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
          <dialog-customer-create
            v-model="createCustomerDialog"
            @create="$refs.table.refetch()"
          ></dialog-customer-create>
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
import DialogCustomerCreate from '@/components/DialogCustomerCreate.vue'
import TableCustomer from '@/components/TableCustomer.vue'

export default {
  name: 'Customers',
  components: {
    DialogCustomerCreate,
    TableCustomer
  },
  data: () => ({
    createCustomerDialog: false
  })
}
</script>

<style>

</style>
