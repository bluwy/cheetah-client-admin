<template>
  <base-dialog
    ref="dialog"
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    :is-editing.sync="isEditing"
    :show-actions="isEditing"
    :is-dirty="isDirty"
    is-editable
    dialog-title="Job Info"
    v-on="$listeners"
    @close="resetForm"
  >
    <template #toolbar>
      <template v-if="canReassign">
        <job-dialog-reassign
          ref="dialogReassign"
          v-model="dialogReassign"
          @reassign-job="$emit('reassign-job')"
        />
        <v-btn
          color="primary"
          @click="$refs.dialogReassign.open(item.id)"
        >
          Reassign
        </v-btn>
      </template>
    </template>
    <customer-autocomplete
      v-model="newFormJob.customerId"
      :rules="rule.customerId"
      label="Customer"
      dense
      clearable
    />
    <v-autocomplete
      v-model="newFormJob.address"
      :rules="rule.address"
      :items="customerAddresses"
      class="mb-3"
      label="Address"
      hide-selected
      hide-no-data
    />
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <staff-autocomplete
          v-model="newFormJob.staffPrimaryId"
          :rules="rule.staffPrimaryId"
          :filter="v => v.id !== newFormJob.staffSecondaryId"
          label="Technician 1"
          dense
          clearable
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <staff-autocomplete
          v-model="newFormJob.staffSecondaryId"
          :rules="rule.staffSecondaryId"
          :filter="v => v.id !== newFormJob.staffPrimaryId"
          label="Technician 2"
          dense
          clearable
        />
      </v-col>
    </v-row>
    <input-date-time
      v-model="newFormJob.startDate"
      :date-props="{
        label: 'Start date',
        rules: rule.startDate
      }"
      :time-props="{
        label: 'Start time',
        rules: rule.startDate
      }"
    />
    <input-list-task
      :tasks="newFormJob.tasks"
      label="Tasks"
    />
    <v-input prepend-icon="mdi-cake-variant">
      {{ formatDate(job.createdAt) }}
    </v-input>
    <v-input prepend-icon="mdi-update">
      {{ formatDate(job.updatedAt) }}
    </v-input>
  </base-dialog>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash-es'
import { updatedDiff } from 'deep-object-diff'
import { cacheObjKeys, formatDate } from '@/utils/common'
import { required, email } from '@/utils/inputRules'
import BaseDialog from '@/components/Common/BaseDialog.vue'
import CustomerAutocomplete from '@/components/Customer/Autocomplete.vue'
import StaffAutocomplete from '@/components/Staff/Autocomplete.vue'
import JobDialogReassign from '@/components/Job/DialogReassign.vue'
import { pushSnack } from './SnackbarGlobal.vue'
import JOB_GET_ONE from '@/graphql/Job/GetOne.graphql'
import JOB_UPDATE from '@/graphql/Job/Update.graphql'
import JOB_SET_TASKS from '@/graphql/Job/SetTasks.graphql'

export default {
  name: 'JobDialogInfo',
  apollo: {
    job: {
      query: JOB_GET_ONE,
      variables: {
        id: this.jobId
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    BaseDialog,
    CustomerAutocomplete,
    StaffAutocomplete,
    JobDialogReassign
  },
  data: () => ({
    isEditing: false,
    loadingCount: 0,
    job: {},
    jobId: '',
    formJobFactory: () => ({}),
    formTasksFactory: () => [],
    newFormJob: {},
    newFormTasks: [],
    rule: {
      code: [required],
      name: [required],
      email: [email],
      companyBelongId: [required],
      staffPrimaryId: [required]
    },
    dialogReassign: true
  }),
  computed: {
    isDirty () {
      return this.isJobDirty || this.isTasksDirty
    },
    isJobDirty () {
      return !isEqual(this.newFormJob, this.formJobFactory())
    },
    isTasksDirty () {
      return !isEqual(this.newFormTasks, this.formTasksFactory())
    },
    canReassign () {
      // Haven't check out means haven't done
      return this.job.checkOut == null
    }
  },
  watch: {
    job (val) {
      this.formJobFactory = () => ({
        customerId: val.customer.id,
        address: val.address,
        startDate: val.startDate,
        staffPrimaryId: val.staffPrimary.id,
        staffSecondaryId: val.staffSecondary ? val.staffSecondary.id : ''
      })

      this.formTasksFactory = () => cloneDeep(val.tasks)

      this.resetForm()
    }
  },
  methods: {
    formatDate,
    open (jobId) {
      this.jobId = jobId
      this.$emit('input', true)
    },
    resetForm () {
      this.newFormJob = this.formJobFactory()
      this.$refs.dialog.$refs.form.resetValidation()
    },
    async updateJob () {
      const { cache, restore } = cacheObjKeys(this, ['jobId', 'formJobFactory', 'formTasksFactory', 'newFormJob', 'newFormTasks'])

      // Switch to view mode
      this.isEditing = false

      pushSnack({ color: 'success', messge: 'Updated job' })

      try {
        const updateJob = this.isJobDirty && this.$apollo.mutate({
          mutation: JOB_UPDATE,
          variables: { id: cache.jobId, ...updatedDiff(cache.formJobFactory(), cache.newFormJob) }
        })

        const setTasks = this.isTasksDirty && this.$apollo.mutate({
          mutation: JOB_SET_TASKS,
          variables: { id: cache.jobId, tasks: this.newFormTasks }
        })

        // The below is not necessary but I only wanted to await the above
        await Promise.all([updateJob, setTasks])
      } catch (e) {
        console.error(e)

        restore()

        // Re-open since user might close dialog
        this.open(cache.jobId)
        this.isEditing = true

        pushSnack({ color: 'error', message: 'Unable to update job' })
      }
    }
  }
}
</script>
