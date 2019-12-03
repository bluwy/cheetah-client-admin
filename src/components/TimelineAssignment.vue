<template>
  <v-timeline class="mt-2" align-top dense>
    <timeline-item-assignment
      v-for="(assignment, i) in assignments"
      :key="i"
      v-bind="assignment"
    ></timeline-item-assignment>
    <v-timeline-item v-if="canAddAssignment" right fill-dot small>
      <dialog-assignment-add v-model="dialogAssignmentAdd" :jobId="jobId">
        <template #activator>
          <v-btn block color="primary" @click.stop="dialogAssignmentAdd = true">
            <v-icon left>mdi-plus</v-icon>
            Add assignment
          </v-btn>
        </template>
      </dialog-assignment-add>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import DialogAssignmentAdd from '@/components/DialogAssignmentAdd.vue'
import TimelineItemAssignment from '@/components/TimelineItemAssignment.vue'

export default {
  name: 'TimelineAssignment',
  components: {
    DialogAssignmentAdd,
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
    dialogAssignmentAdd: false
  }),
  computed: {
    canAddAssignment () {
      if (!this.assignments.length) {
        return true
      } else {
        const last = this.assignments[this.assignments.length - 1]
        return last.checkIn != null && last.checkOut != null && last.needsFollowUp
      }
    }
  }
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
