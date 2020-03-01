<template>
  <v-container>
    <job-table searchable />
    <customer-table searchable />
  </v-container>
</template>

<script>
import JobTable from '@/components/Job/Table.vue'
import CustomerTable from '@/components/Customer/Table.vue'

export default {
  name: 'Home',
  components: {
    JobTable,
    CustomerTable
  }
}
</script>
