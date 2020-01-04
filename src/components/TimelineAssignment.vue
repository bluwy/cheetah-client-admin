<template>
  <v-timeline
    class="mt-2"
    align-top
    dense
  >
    <v-timeline-item
      v-if="loading"
      key="skeleton"
      color="grey"
      right
      fill-dot
      small
    >
      <v-skeleton-loader
        class="py-1"
        type="text"
        width="240px"
        max-width="100%"
      />
      <v-skeleton-loader
        class="skeleton-card"
        :types="{
          taskItem: 'chip, text',
          staff: 'avatar, chip@2',
          preferTime: 'avatar, text',
          address: 'avatar, text',
          task: 'heading, taskItem@2',
          action: 'heading, text@2'
        }"
        type="staff, preferTime, address, task, action"
      />
    </v-timeline-item>
    <template v-else>
      <timeline-item-assignment
        v-for="(assignment, i) in assignments"
        :key="i"
        v-bind="assignment"
      />
      <v-timeline-item
        key="createAssignment"
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
    </template>
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
    },
    loading: {
      type: Boolean,
      default: false
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

.skeleton-card {
  background: rgba(0, 0, 0, .06);
  padding: 1rem;
}

.skeleton-card::v-deep > .v-skeleton-loader__bone {
  margin-bottom: 10px;
}

.skeleton-card >>> .v-skeleton-loader__text {
  margin-bottom: 0;
}

.skeleton-card >>> .v-skeleton-loader__heading {
  width: 120px;
  margin-bottom: 6px;
}

.skeleton-card >>> .v-skeleton-loader__avatar {
  width: 32px;
  height: 32px;
  margin-right: 6px;
}

.skeleton-card >>> .v-skeleton-loader__chip {
  display: inline-block;
  margin-right: 6px;
}

.skeleton-card >>> .v-skeleton-loader__staff,
.skeleton-card >>> .v-skeleton-loader__preferTime,
.skeleton-card >>> .v-skeleton-loader__address,
.skeleton-card >>> .v-skeleton-loader__taskItem {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.skeleton-card >>> .v-skeleton-loader__taskItem .v-skeleton-loader__chip {
  width: 64px;
  height: 24px;
  border-radius: 4px;
}

.skeleton-card >>> .v-skeleton-loader__task {
  margin-top: 16px;
}

.skeleton-card >>> .v-skeleton-loader__action {
  margin: 0;
}

.skeleton-card >>> .v-skeleton-loader__action .v-skeleton-loader__text {
  margin-top: 12px;
}
</style>
