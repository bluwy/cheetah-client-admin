<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="mapStaffs"
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
import STAFF_GET_ALL from '@/graphql/Staff/GetAll.graphql'

export default {
  name: 'InputStaff',
  apollo: {
    staffs: {
      query: STAFF_GET_ALL
    }
  },
  props: {
    filter: {
      type: Function,
      default: () => true
    }
  },
  data: () => ({
    staffs: []
  }),
  computed: {
    mapStaffs () {
      return this.staffs.filter(this.filter).map(v => ({ text: v.username, value: v.id }))
    }
  }
}
</script>
