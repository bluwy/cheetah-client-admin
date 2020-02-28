<template>
  <input-text-unique
    v-bind="$attrs"
    :apollo-query="query"
    :apollo-variables="v => ({ username: { equals: v } })"
    :apollo-update="v => v.adminCount"
    v-on="$listeners"
  />
</template>

<script>
import InputTextUnique from '@/components/InputTextUnique.vue'
import ADMIN_COUNT from '@/graphql/Admin/Count.graphql'

export default {
  name: 'AdminInputName',
  components: {
    InputTextUnique
  },
  data: () => ({
    query: ADMIN_COUNT
  })
}
</script>
