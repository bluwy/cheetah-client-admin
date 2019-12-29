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
import CUSTOMER_INPUT_GET_ALL from '@/graphql/CustomerInputGetAll.graphql'

export default {
  name: 'InputCustomer',
  apollo: {
    customers: {
      query: CUSTOMER_INPUT_GET_ALL,
      variables () {
        return {
          limit: this.queryLimit,
          where: this.queryWhere
        }
      },
      skip () {
        return this.$attrs.multiple ? false : this.$attrs.value
      },
      debounce: 500
    }
  },
  props: {
    customersFilter: {
      type: Function,
      default: () => true
    },
    queryLimit: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    query: '',
    customers: []
  }),
  computed: {
    queryWhere () {
      return this.query ? {
        OR: [
          { code: { contains: this.query } },
          { name: { contains: this.query } }
        ]
      } : undefined
    },
    mapCustomers () {
      return this.customers.filter(this.customersFilter).map(v => ({
        text: `${v.code} - ${v.name}`,
        value: v.id
      }))
    }
  }
}
</script>

<style>

</style>
