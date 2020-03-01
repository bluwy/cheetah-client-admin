<template>
  <input-text-unique
    v-bind="$attrs"
    :apollo-query="query"
    :apollo-variables="v => ({ name: { equals: v } })"
    :apollo-update="v => v.companyCount"
    v-on="$listeners"
  />
</template>

<script>
import InputTextUnique from '@/components/Common/InputTextUnique.vue'
import COMPANY_COUNT from '@/graphql/Company/Count.graphql'

export default {
  name: 'CompanyInputName',
  components: {
    InputTextUnique
  },
  data: () => ({
    query: COMPANY_COUNT
  })
}
</script>
