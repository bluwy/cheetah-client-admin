<template>
  <v-timeline
    class="mt-2"
    align-top
    dense
  >
    <timeline-item-assignment
      v-for="(assignment, i) in assignments"
      :key="i"
      v-bind="assignment"
    />
    <v-timeline-item
      right
      fill-dot
      small
    >
      <v-btn
        block
        color="primary"
        @click.stop="$refs.dialogAssignmentCreate.open(jobId)"
      >
        <v-icon left>
          mdi-plus
        </v-icon>
        Add assignment
      </v-btn>
      <dialog-assignment-create
        ref="dialogAssignmentCreate"
        v-model="dialogAssignmentCreate"
      />
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import DialogAssignmentCreate from '@/components/DialogAssignmentCreate.vue'
import TimelineItemAssignment from '@/components/TimelineItemAssignment.vue'

export default {
  name: 'TimelineAssignment',
  components: {
    DialogAssignmentCreate,
    TimelineItemAssignment
  },
  props: {
    assignments: {
      type: Array,
      default: () => []
    },
    jobId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    dialogAssignmentCreate: false
  })
}
</script>

<style scoped>
/* Make timeline divider thinner */
.v-timeline--dense:not(.v-timeline--reverse)::before {
  left: calc(12px - 1px);
}

.v-timeline-item >>> .v-timeline-item__divider {
  min-width: 24px;
}

.v-timeline-item >>> .v-timeline-item__body {
  max-width: calc(100% - 24px);
  padding-left: 16px;
}
</style>
