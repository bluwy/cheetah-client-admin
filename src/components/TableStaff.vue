<template>
  <v-data-table
    :headers="headers"
    :items="staffs"
    :loading="!!loadingCount"
  ></v-data-table>
</template>

<script>
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'

export default {
  name: 'TableStaff',
  apollo: {
    staffs: {
      query: STAFF_GET_ALL,
      loadingKey: 'loadingCount'
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Full Name', value: 'fullName' }
    ],
    staffs: []
  })
}
</script>

<style>

</style>
