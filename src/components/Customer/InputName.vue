<template>
  <input-text-unique
    v-bind="$attrs"
    :apollo-query="query"
    :apollo-variables="v => ({ name: { equals: v } })"
    :apollo-update="v => v.customerCount"
    v-on="$listeners"
  />
</template>

<script>
import InputTextUnique from '@/components/InputTextUnique.vue'
import CUSTOMER_COUNT from '@/graphql/Customer/Count.graphql'

export default {
  name: 'CustomerInputName',
  components: {
    InputTextUnique
  },
  data: () => ({
    query: CUSTOMER_COUNT
  })
}
</script>
