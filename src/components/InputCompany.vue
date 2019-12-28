<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="mapCompanies"
    placeholder="Select company"
    clearable
    v-on="$listeners"
    @input="$emit('input', $event)"
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
  data: () => ({
    companies: []
  }),
  computed: {
    mapCompanies () {
      return this.companies.map(v => ({ text: v.name, value: v.id }))
    }
  }
}
</script>

<style>

</style>
