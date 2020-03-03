<template>
  <v-container>
    <admin-table
      :class="tableClass"
      searchable
    />
    <staff-table
      :class="tableClass"
      searchable
    />
    <company-table
      :class="tableClass"
      searchable
    />
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
  },
  data: () => ({
    tableClass: 'my-3 elevation-3'
  })
}
</script>
