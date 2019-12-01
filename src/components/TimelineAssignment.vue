<template>
  <v-timeline class="mt-2" align-top dense>
    <timeline-item-assignment
      v-for="(assignment, i) in assignments"
      :key="i"
      v-bind="assignment"
    ></timeline-item-assignment>
  </v-timeline>
</template>

<script>
import TimelineItemAssignment from '@/components/TimelineItemAssignment.vue'

export default {
  name: 'TimelineAssignment',
  components: {
    TimelineItemAssignment
  },
  props: {
    assignments: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
/* Make timeline divider thinner */
.v-timeline--dense:not(.v-timeline--reverse)::before {
  left: calc(12px - 1px);
}
</style>
