<template>
  <v-data-table
    :headers="headers"
    :items="staffs"
  ></v-data-table>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'TableStaff',
  apollo: {
    staffs: {
      query: gql`
        query GetStaffs {
          staffs(limit: 100) {
            id
            username
            fullName
          }
        }
      `
    }
  },
  data: () => ({
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
