<template>
  <v-autocomplete
    v-bind="$attrs"
    :search-input.sync="query"
    :items="mapCustomers"
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
import CUSTOMER_INPUT_GET_ALL from '@/graphql/Customer/InputGetAll.graphql'

export default {
  name: 'InputCustomer',
  apollo: {
    customers: {
      query: CUSTOMER_INPUT_GET_ALL,
      variables () {
        return {
          first: this.queryLimit,
          query: this.searchQuery
        }
      },
      debounce: 300
    }
  },
  props: {
    filter: {
      type: Function,
      default: () => true
    },
    queryLimit: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    searchQuery: '',
    customers: []
  }),
  computed: {
    mapCustomers () {
      return this.customers.filter(this.filter).map(v => ({
        text: `${v.code} - ${v.name}`,
        value: v.id
      }))
    }
  }
}
</script>
