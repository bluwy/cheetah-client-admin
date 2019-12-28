<template>
  <v-autocomplete
    :value="value"
    :search-input.sync="query"
    :loading="!!loadingCount"
    :items="mapCustomers"
    :cache-items="multiple"
    :multiple="multiple"
    :placeholder="placeholder"
    :rules="rules"
    editable
    solo
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
        return this.multiple ? false : this.value
      },
      debounce: 500,
      loadingKey: 'loadingCount'
    }
  },
  props: {
    value: {
      type: [String, Array],
      required: true
    },
    rules: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean
    },
    queryLimit: {
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
    queryWhere () {
      return this.query ? {
        OR: [
          { code: { contains: this.query } },
          { name: { contains: this.query } }
        ]
      } : undefined
    },
    mapCustomers () {
      return this.customers.map(v => ({
        text: `${v.code} - ${v.name}`,
        value: v.id
      }))
    }
  },
  watch: {
    value (val) {
      if (this.multiple) {
        this.query = ''
      }
    }
  }
}
</script>

<style>

</style>
