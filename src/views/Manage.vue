<template>
  <v-container>
    <admin-table searchable />
    <staff-table searchable />
    <company-table searchable />
  </v-container>
</template>

<script>
import AdminTable from '@/components/Admin/Table.vue'
import StaffTable from '@/components/Staff/Table.vue'
import CompanyTable from '@/components/Company/Table.vue'

export default {
  name: 'Manage',
  components: {
    AdminTable,
    StaffTable,
    CompanyTable
  }
}
</script>
