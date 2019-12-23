<template>
  <v-dialog
    :value="value"
    width="700"
    max-width="95vw"
    @input="$emit('input', $event)"
  >
    <template
      v-for="(_, slot) in $scopedSlots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col>Job Details</v-col>
          <v-col cols="auto">
            <v-btn
              icon
              color="primary"
            >
              <v-icon @click="$emit('input', false)">
                mdi-close
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-container fluid>
        <v-card-title class="pt-0">
          {{ customerName }}
        </v-card-title>
        <v-card-subtitle>Issued {{ issueDate }}</v-card-subtitle>
        <v-card-text>
          <div class="subtitle-1">
            Assignments
          </div>
          <timeline-assignment
            :assignments="job.assignments"
            :job-id="jobId"
          />
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { format } from 'date-fns'
import TimelineAssignment from '@/components/TimelineAssignment.vue'
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
  components: {
    TimelineAssignment
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
  }
}
</script>

<style>

</style>
