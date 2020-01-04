<template>
  <v-dialog
    v-bind="$attrs"
    width="700"
    max-width="95vw"
    v-on="$listeners"
  >
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
          <v-skeleton-loader
            :loading="!!loadingCount"
            transition="fade-transition"
            type="heading"
            width="100%"
            height="30px"
          >
            <div>
              {{ jobCode }} - {{ customerName }}
            </div>
          </v-skeleton-loader>
        </v-card-title>
        <v-card-subtitle>
          <v-skeleton-loader
            :loading="!!loadingCount"
            transition="fade-transition"
            type="text"
            width="160px"
            max-width="100%"
          >
            <div>
              Issued {{ issueDate }}
            </div>
          </v-skeleton-loader>
        </v-card-subtitle>
        <v-card-text>
          <div class="subtitle-1">
            Assignments
          </div>
          <timeline-assignment
            :assignments="job.assignments"
            :job-id="jobId"
            :loading="!!loadingCount"
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
        return !this.jobId
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    TimelineAssignment
  },
  data: () => ({
    loadingCount: 0,
    jobId: '',
    job: {}
  }),
  computed: {
    jobCode () {
      return this.job.code
    },
    customerName () {
      return this.job.customer && this.job.customer.name
    },
    issueDate () {
      return this.job.dateIssued && format(new Date(this.job.dateIssued), 'd MMM yyyy')
    }
  },
  methods: {
    open (jobId) {
      this.jobId = jobId
      this.$emit('input', true)
    }
  }
}
</script>

<style>

</style>
