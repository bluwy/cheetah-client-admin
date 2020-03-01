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
import COMPANY_GET_ALL from '@/graphql/Company/GetAll.graphql'

export default {
  name: 'CompanyAutocomplete',
  apollo: {
    companies: {
      query: COMPANY_GET_ALL
    }
  },
  props: {
    filter: {
      type: Function,
      default: () => true
    }
  },
  data: () => ({
    companies: []
  }),
  computed: {
    mapCompanies () {
      return this.companies.filter(this.filter).map(v => ({ text: v.name, value: v.id }))
    }
  }
}
</script>
