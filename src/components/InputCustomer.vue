<template>
  <v-overflow-btn
    :value="value"
    :search-input.sync="query"
    :loading="!!loadingCount"
    :items="mapCustomers"
    :multiple="multiple"
    :placeholder="placeholder"
    :rules="rules"
    editable
    solo
    flat
    @input="$emit('input', $event)"
  >
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot v-bind="scope" :name="slot"></slot>
    </template>
  </v-overflow-btn>
</template>

<script>
import CUSTOMER_GET_ALL from '@/graphql/CustomerGetAll.graphql'

export default {
  name: 'InputCustomer',
  apollo: {
    customers: {
      query: CUSTOMER_GET_ALL,
      variables () {
        return {
          query: this.query || '',
          limit: this.maxQueryResult
        }
      },
      debounce: 500,
      loadingKey: 'loadingCount'
    }
  },
  props: {
    value: {
      type: [String, Array]
    },
    rules: {
      type: Array
    },
    multiple: {
      type: Boolean
    },
    maxQueryResult: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    loadingCount: 0,
    query: '',
    customers: []
  }),
  computed: {
    placeholder () {
      return 'Select customer' + (this.multiple ? '(s)' : '')
    },
    mapCustomers () {
      return this.customers.map(v => ({ text: v.name, value: v.id }))
    }
  }
}
</script>

<style>

</style>
