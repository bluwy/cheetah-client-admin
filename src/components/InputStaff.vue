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
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'

export default {
  name: 'InputStaff',
  apollo: {
    staffs: {
      query: STAFF_GET_ALL
    }
  },
  props: {
    staffsFilter: {
      type: Function,
      default: () => true
    }
  },
  data: () => ({
    query: '',
    staffs: []
  }),
  computed: {
    mapStaffs () {
      return this.staffs.filter(this.staffsFilter).map(v => ({ text: v.username, value: v.id }))
    }
  }
}
</script>

<style>

</style>
