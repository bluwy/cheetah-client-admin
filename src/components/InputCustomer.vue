<template>
  <v-overflow-btn
    :value="value"
    :search-input.sync="query"
    :loading="isQuerying"
    :items="customers"
    :multiple="multiple"
    placeholder="Select customer"
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
import { mapActions } from 'vuex'
import { debounce } from 'lodash-es'

export default {
  name: 'InputCustomer',
  props: {
    value: {
      type: [Number, Array]
    },
    multiple: {
      type: Boolean
    },
    queryWait: {
      type: Number,
      default: 500
    },
    maxQueryResult: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    query: '',
    isQuerying: false,
    customers: []
  }),
  created () {
    this.debQueryCustomers = debounce(async (val) => {
      this.customers = await this.queryCustomers({ customerName: val })
    }, this.queryWait)
  },
  watch: {
    query (val) {
      this.debQueryCustomers(val)
    }
  },
  methods: {
    ...mapActions('customers', [
      'queryCustomers'
    ])
  }
}
</script>

<style>

</style>
