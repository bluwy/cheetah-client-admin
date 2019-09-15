<template>
  <v-overflow-btn
    :value="value"
    :search-input.sync="query"
    :loading="isQuerying"
    :items="staffs"
    :multiple="multiple"
    placeholder="Select staff"
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
  name: 'InputStaff',
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
    staffs: []
  }),
  created () {
    this.debQueryStaffs = debounce(async (val) => {
      this.staffs = await this.queryStaffs({ staffUsername: val })
    }, this.queryWait)
  },
  watch: {
    query (val) {
      this.debQueryStaffs(val)
    }
  },
  methods: {
    ...mapActions('staffs', [
      'queryStaffs'
    ])
  }
}
</script>

<style>

</style>
