<template>
  <v-overflow-btn
    :value="value"
    :search-input.sync="query"
    :loading="!!loadingCount"
    :items="mapStaffs"
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
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'

export default {
  name: 'InputStaff',
  apollo: {
    staffs: {
      query: STAFF_GET_ALL,
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
      default: 5
    }
  },
  data: () => ({
    loadingCount: 0,
    query: '',
    staffs: []
  }),
  computed: {
    placeholder () {
      return 'Select staff' + (this.multiple ? '(s)' : '')
    },
    mapStaffs () {
      return this.staffs.map(v => ({ text: v.username, value: v.id }))
    }
  }
}
</script>

<style>

</style>
