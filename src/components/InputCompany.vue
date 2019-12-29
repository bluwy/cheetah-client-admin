<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="mapCompanies"
    v-on="$listeners"
  >
    <template
      v-for="(_, slot) in $scopedSlots"
      #[slot]="scope"
    >
      <slot
        v-bind="scope"
        :name="slot"
      />
    </template>
  </v-autocomplete>
</template>

<script>
import COMPANY_GET_ALL from '@/graphql/CompanyGetAll.graphql'

export default {
  name: 'InputCompany',
  apollo: {
    companies: {
      query: COMPANY_GET_ALL
    }
  },
  props: {
    companiesFilter: {
      type: Function,
      default: () => true
    }
  },
  data: () => ({
    companies: []
  }),
  computed: {
    mapCompanies () {
      return this.companies.filter(this.companiesFilter).map(v => ({ text: v.name, value: v.id }))
    }
  }
}
</script>

<style>

</style>
