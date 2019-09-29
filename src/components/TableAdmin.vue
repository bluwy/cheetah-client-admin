<template>
  <v-data-table
    :headers="headers"
    :items="admins"
    :loading="!!loadingCount"
  ></v-data-table>
</template>

<script>
import ADMIN_GET_ALL from '@/graphql/AdminGetAll.graphql'

export default {
  name: 'TableAdmin',
  apollo: {
    admins: {
      query: ADMIN_GET_ALL,
      loadingKey: 'loadingCount'
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Username', value: 'username' }
    ],
    admins: []
  })
}
</script>

<style>

</style>
