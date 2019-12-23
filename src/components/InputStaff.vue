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
    queryWhere () {
      return this.query ? {
        username: { contains: this.query }
      } : undefined
    },
    mapStaffs () {
      return this.staffs.map(v => ({ text: v.username, value: v.id }))
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
