<template>
  <base-sidebar-item
    ref="item"
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    :is-editing.sync="isEditing"
    :show-actions="isEditing"
    :is-dirty="isDirty"
    is-editable
    item-title="Job Info"
    v-on="$listeners"
  >
    <template #toolbar>
      <template v-if="canReassign">
        <v-btn
          color="primary"
          @click="openSidebarItemReassign()"
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
  </base-sidebar-item>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash-es'
import { updatedDiff } from 'deep-object-diff'
import { formatDate } from '@/utils/common'
import { required, email } from '@/utils/inputRules'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
import JobSidebarItemReassign from '@/components/Job/SidebarItemReassign.vue'
import CustomerAutocomplete from '@/components/Customer/Autocomplete.vue'
import StaffAutocomplete from '@/components/Staff/Autocomplete.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import JOB_GET_ONE from '@/graphql/Job/GetOne.graphql'
import JOB_UPDATE from '@/graphql/Job/Update.graphql'
import JOB_SET_TASKS from '@/graphql/Job/SetTasks.graphql'

export default {
  name: 'JobSidebarItemInfo',
  apollo: {
    job: {
      query: JOB_GET_ONE,
      variables () {
        return {
          id: this.jobId
        }
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    BaseSidebarItem,
    CustomerAutocomplete,
    StaffAutocomplete
  },
  props: {
    jobId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    isEditing: false,
    loadingCount: 0,
    job: {},
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
    }
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
    resetForm () {
      this.newFormJob = this.formJobFactory()
      this.$refs.item.$refs.form.resetValidation()
    },
    openSidebarItemReassign () {
      this.addSidebarItem({
        component: JobSidebarItemReassign,
        props: {
          prevJobId: this.jobId
        }
      })
    },
    async updateJob () {
      this.isEditing = false

      pushSnack({ color: 'success', messge: 'Updated job' })

      try {
        const updateJob = this.isJobDirty && this.$apollo.mutate({
          mutation: JOB_UPDATE,
          variables: {
            id: this.jobId,
            ...updatedDiff(this.formJobFactory(), this.newFormJob)
          }
        })

        const setTasks = this.isTasksDirty && this.$apollo.mutate({
          mutation: JOB_SET_TASKS,
          variables: {
            id: this.jobId,
            tasks: this.newFormTasks
          }
        })

        // The below is not necessary but I only wanted to await the above
        await Promise.all([updateJob, setTasks])
      } catch (e) {
        console.error(e)

        this.isEditing = true

        pushSnack({ color: 'error', message: 'Unable to update job' })
      }
    }
  }
}
</script>
