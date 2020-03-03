<template>
  <v-container>
    <job-table
      :class="tableClass"
      searchable
    />
    <customer-table
      :class="tableClass"
      searchable
    />
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
  },
  data: () => ({
    tableClass: 'my-3 elevation-3'
  })
}
</script>
