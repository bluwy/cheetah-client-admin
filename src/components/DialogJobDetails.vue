<template>
  <v-dialog :value="value" @input="$emit('input', $event)" width="700">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col>Job Details</v-col>
          <v-col cols="auto">
            <v-btn icon color="primary">
              <v-icon @click="$emit('input', false)">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-container fluid>
        <v-card-title class="pt-0">{{ customerName }}</v-card-title>
        <v-card-subtitle>Issued {{ issueDate }}</v-card-subtitle>
        <v-card-text>
          <div class="subtitle-1">Assignments</div>
          <v-timeline
            v-for="(assignment, i) in job.assignments"
            :key="i"
            class="mt-2"
            align-top
            dense
          >
            <v-timeline-item right fill-dot small>
              <div class="py-1">{{ formatCheckTime(assignment.checkIn, assignment.checkOut) }}</div>
              <v-card outlined style="background-color: rgba(0, 0, 0, .02)">
                <v-card-text>
                  <v-chip
                    v-for="(staff, i) in assignment.staffs"
                    :key="i"
                    class="mr-2"
                  >
                    {{ staff.username }}
                  </v-chip>
                </v-card-text>
                <v-card-text class="pt-0">
                  <v-card-title class="subtitle-1 black--text pa-0">Tasks</v-card-title>
                  <ul>
                    <li v-show="!assignment.tasks || !assignment.tasks.length" key="empty">No tasks</li>
                    <li
                      v-for="(task, i) in assignment.tasks"
                      :key="i"
                    >
                      <v-chip small label class="mr-2">{{ task.type }}</v-chip>
                      {{ task.remarks }}
                    </li>
                  </ul>
                </v-card-text>
                <v-card-text class="pt-0">
                  <v-card-title class="subtitle-1 black--text pa-0">Actions</v-card-title>
                  <ul>
                    <li v-show="!assignment.actions || !assignment.actions.length" key="empty">No actions</li>
                    <li
                      v-for="(action, i) in assignment.actions"
                      :key="i"
                    >
                      <v-chip small label class="mr-2">{{ action.type }}</v-chip>
                      {{ action.remarks }}
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { format, isSameDay } from 'date-fns'
import JOB_GET from '@/graphql/JobGet.graphql'

export default {
  name: 'DialogJobDetails',
  apollo: {
    job: {
      query: JOB_GET,
      variables () {
        return {
          id: this.jobId
        }
      },
      skip () {
        return !this.value
      }
    }
  },
  props: {
    value: {
      type: Boolean
    },
    jobId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    job: {}
  }),
  computed: {
    customerName () {
      return this.job.customer && this.job.customer.name
    },
    issueDate () {
      return this.job.dateIssued && format(this.job.dateIssued, 'd MMM yyyy')
    }
  },
  methods: {
    formatCheckTime (checkIn, checkOut) {
      if (checkIn == null) {
        return 'Not started'
      }

      const text = [
        format(checkIn, 'd MMM yyyy'),
        format(checkIn, 'HHmm'),
        '-'
      ]

      if (checkOut == null) {
        text.push('now')
      } else {
        text.push([
          isSameDay(checkIn, checkOut) ? '' : format(checkOut, 'd MMM yyyy'),
          format(checkOut, 'HHmm')
        ])
      }

      return text.filter(v => !!v).join(' ')
    }
  }
}
</script>

<style scoped>
/* Make timeline divider thinner */
.v-timeline--dense:not(.v-timeline--reverse)::before {
  left: calc(12px - 1px);
}

.v-timeline >>> .v-timeline-item__divider {
  min-width: 24px;
}

.v-timeline >>> .v-timeline-item__body {
  max-width: calc(100% - 24px);
  padding-left: 16px;
}

.v-timeline-item .v-card::before, .v-timeline-item .v-card::after {
  display: none;
}

.v-card__text ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
