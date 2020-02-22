<template>
  <v-container>
    <v-row class="mb-3">
      <v-col cols="auto">
        <v-text-field
          v-model="searchQuery"
          :clearable="searchQuery"
          prepend-icon="mdi-magnify"
          label="Search All"
          single-line
          hide-details
          dense
        />
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          color="primary"
          @click.stop="dialogCreate = true"
        >
          <v-icon left>
            mdi-plus-circle
          </v-icon>
          Create Job
        </v-btn>
        <dialog-job-create
          v-model="dialogCreate"
          @create-job="refetch()"
        />
      </v-col>
    </v-row>
    <table-job
      class="mb-3 elevation-1"
      table-title="Current Jobs"
      :extra-query-where="{ needsFollowUp: { equals: null } }"
      searchable
    />
    <table-job
      class="mb-3 elevation-1"
      table-title="Needs Follow-up"
      :extra-query-where="{ needsFollowUp: { equals: true } }"
    />
    <table-job
      class="mb-3 elevation-1"
      table-title="Past Jobs"
      :extra-query-where="{ needsFollowUp: { equals: false } }"
    />
  </v-container>
</template>

<script>
import DialogJobCreate from '@/components/DialogJobCreate.vue'
import TableJob from '@/components/TableJob.vue'

export default {
  name: 'Jobs',
  components: {
    DialogJobCreate,
    TableJob
  },
  data: () => ({
    searchQuery: '',
    dialogCreate: false
  })
}
</script>

<style>

</style>
