<template>
  <base-dialog
    ref="dialog"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    dialog-title="Add New Job"
    v-on="$listeners"
    @close="resetForm()"
    @ok="createJob()"
  >
    <customer-autocomplete
      v-model="formJob.customerId"
      :rules="rule.customerId"
      label="Customer"
      dense
      clearable
    />
    <v-autocomplete
      v-model="formJob.address"
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
          v-model="formJob.staffPrimaryId"
          :rules="rule.staffPrimaryId"
          :filter="v => v.id !== formJob.staffSecondaryId"
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
          v-model="formJob.staffSecondaryId"
          :rules="rule.staffSecondaryId"
          :filter="v => v.id !== formJob.staffPrimaryId"
          label="Technician 2"
          dense
          clearable
        />
      </v-col>
    </v-row>
    <input-date-time
      v-model="formJob.startDate"
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
      :tasks="formJob.tasks"
      label="Tasks"
    />
  </base-dialog>
</template>

<script>
import { formatISO } from 'date-fns'
import { get, isEqual, cloneDeep } from 'lodash-es'
import { storeDeleteQuery } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import { required, minArrLength } from '@/utils/inputRules'
import BaseDialog from '@/components/Common/BaseDialog.vue'
import CustomerAutocomplete from '@/components/Customer/Autocomplete.vue'
import StaffAutocomplete from '@/components/Staff/Autocomplete.vue'
import InputDateTime from '@/components/Common/InputDateTime.vue'
import InputListTask from '@/components/Common/InputListTask.vue'
import { snackbarPush } from '@/components/Common/SnackbarGlobal.vue'
import JOB_CREATE from '@/graphql/Job/Create.graphql'
import JOB_FOLLOW_UP_GET_ONE from '@/graphql/Job/FollowUpGetOne.graphql'
import CUSTOMER_GET_ONE from '@/graphql/Customer/GetOne.graphql'

const formJobFactory = () => ({
  customerId: '',
  address: '',
  startDate: formatISO(new Date()),
  staffPrimaryId: '',
  staffSecondaryId: '',
  tasks: [{ type: '', remarks: '' }]
})

export default {
  name: 'JobDialogCreate',
  apollo: {
    customer: {
      query: CUSTOMER_GET_ONE,
      variables () {
        return {
          id: this.formJob.customerId
        }
      },
      skip () {
        return !(this.formJob && this.formJob.customerId)
      }
    },
    followUpJob: {
      query: JOB_FOLLOW_UP_GET_ONE,
      variables () {
        return {
          id: this.followUpJobId
        }
      },
      update: v => v.job,
      skip () {
        return !this.followUpJobId
      }
    }
  },
  components: {
    BaseDialog,
    CustomerAutocomplete,
    StaffAutocomplete,
    InputDateTime,
    InputListTask
  },
  data: () => ({
    followUpJobId: '',
    customer: {},
    followUpJob: {},
    formJob: formJobFactory(),
    rule: {
      customerId: [required],
      preferTime: [required],
      staffPrimaryId: [required],
      address: [required],
      tasks: [required, minArrLength(1)]
    }
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formJob, formJobFactory())
    },
    customerAddresses () {
      return get(this.customer, 'addresses', [])
    }
  },
  watch: {
    customer (val) {
      // If is a follow up, that will take precendence (function below)
      if (val && !this.followUpJobId) {
        if (val.staffPrimary && val.staffPrimary.id) {
          this.formJob.staffPrimaryId = val.staffPrimary.id
        }

        if (val.staffSecondary && val.staffSecondary.id) {
          this.formJob.staffSecondaryId = val.staffSecondary.id
        }

        if (val.addresses && val.addresses.length) {
          this.formJob.address = val.addresses[0]
        }
      }
    },
    followUpJob (val) {
      if (val) {
        this.formJob.customerId = val.customer.id
        this.formJob.address = val.address
        this.formJob.staffPrimaryId = val.staffPrimary.id
        this.formJob.staffSecondaryId = val.staffSecondary.id
        this.formJob.tasks = val.actions.map(v => ({
          type: '',
          remarks: v.remarks
        }))
      }
    }
  },
  methods: {
    open (followUpJobId) {
      this.followUpJobId = followUpJobId
    },
    resetForm () {
      this.followUpJobId = ''
      this.followUpJob = {}
      this.formJob = formJobFactory()
      this.$refs.dialog.$refs.form.resetValidation()
    },
    parseFormToVars (form) {
      const vars = cloneDeep(form)

      vars.startDate = new Date(vars.startDate)

      return vars
    },
    async createJob () {
      const { cache, restore } = cacheObjKeys(this, ['followUpJob', 'followUpJobId', 'formJob'])

      // This will reset form, as triggered by dialog close event
      this.$emit('input', false)

      snackbarPush({ color: 'success', message: 'Added new job' })

      try {
        await this.$apollo.mutate({
          mutation: JOB_CREATE,
          variables: this.parseFormToVars(cache.formJob),
          update: (store, { data: { createJob } }) => {
            if (createJob != null) {
              storeDeleteQuery(store, /^jobs/)
            }
          }
        })

        this.$emit('create-job')
      } catch (e) {
        console.error(e)

        restore()

        this.$emit('input', true)

        snackbarPush({ color: 'error', message: 'Unable to add new job' })
      }
    }
  }
}
</script>
