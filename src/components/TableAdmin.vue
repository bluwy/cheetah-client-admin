<template>
  <v-data-table
    :headers="headers"
    :items="admins"
  ></v-data-table>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'TableAdmin',
  apollo: {
    admins: {
      query: gql`
        query GetAdmins {
          admins(limit: 100) {
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
    admins: []
  })
}
</script>

<style>

</style>
