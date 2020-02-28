<template>
  <input-text-unique
    v-bind="$attrs"
    :apollo-query="query"
    :apollo-variables="v => ({ fullName: { equals: v } })"
    :apollo-update="v => v.staffCount"
    v-on="$listeners"
  />
</template>

<script>
import InputTextUnique from '@/components/InputTextUnique.vue'
import STAFF_COUNT from '@/graphql/Staff/Count.graphql'

export default {
  name: 'StaffInputFullName',
  components: {
    InputTextUnique
  },
  data: () => ({
    query: STAFF_COUNT
  })
}
</script>
