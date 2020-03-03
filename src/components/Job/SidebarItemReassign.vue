<template>
  <base-sidebar-item
    ref="item"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    item-title="Add New Job"
    v-on="$listeners"
    @ok="createJob()"
  >
    <customer-autocomplete
      :value="customerId"
      :rules="rule.customerId"
      label="Customer"
      dense
      clearable
      readonly
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
  </base-sidebar-item>
</template>

<script>
import { get, isEqual, cloneDeep } from 'lodash-es'
import { storeDeleteQuery } from '@/utils/apollo'
import { required, minArrLength } from '@/utils/inputRules'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
import CustomerAutocomplete from '@/components/Customer/Autocomplete.vue'
import StaffAutocomplete from '@/components/Staff/Autocomplete.vue'
import InputDateTime from '@/components/Common/InputDateTime.vue'
import InputListTask from '@/components/Common/InputListTask.vue'
import { refetch } from '@/components/Job/Table.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import JOB_REASSIGN from '@/graphql/Job/Reassign.graphql'
import JOB_REASSIGN_GET_ONE from '@/graphql/Job/ReassignGetOne.graphql'

export default {
  name: 'JobSidebarItemReassign',
  apollo: {
    prevJob: {
      query: JOB_REASSIGN_GET_ONE,
      variables () {
        return {
          id: this.prevJobId
        }
      },
      update: v => v.job,
      skip () {
        return !this.prevJobId
      }
    }
  },
  components: {
    BaseSidebarItem,
    CustomerAutocomplete,
    StaffAutocomplete,
    InputDateTime,
    InputListTask
  },
  props: {
    prevJobId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    prevJob: {},
    formJobFactory: () => ({}),
    newFormJob: {},
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
      return !isEqual(this.newFormJob, this.formJobFactory())
    },
    customerId () {
      return get(this.prevJob, 'customer.id', '')
    },
    customerAddresses () {
      return get(this.prevJob, 'customer.addresses', [])
    }
  },
  watch: {
    prevJob (val) {
      if (val) {
        this.formJobFactory = () => ({
          address: val.address,
          startDate: val.startDate,
          staffPrimaryId: val.staffPrimary.id,
          staffSecondaryId: val.staffSecondary.id,
          tasks: val.tasks
        })

        this.resetForm()
      }
    }
  },
  methods: {
    resetForm () {
      this.newFormJob = this.formJobFactory()
      this.$refs.item.$refs.form.resetValidation()
    },
    parseFormToVars (form) {
      const vars = cloneDeep(form)

      vars.startDate = new Date(vars.startDate)

      return vars
    },
    async createJob () {
      this.$refs.item.hide()

      pushSnack({ color: 'success', message: 'Reassigned job' })

      try {
        await this.$apollo.mutate({
          mutation: JOB_REASSIGN,
          variables: {
            id: this.prevJobId,
            data: this.parseFormToVars(this.newFormJob)
          },
          update: (store, { data: { reassignJob } }) => {
            if (reassignJob != null) {
              storeDeleteQuery(store, /^jobs/)
            }
          }
        })

        this.$refs.item.close()

        refetch()
      } catch (e) {
        console.error(e)

        this.$refs.item.unhide()

        pushSnack({ color: 'error', message: 'Unable to reassign job' })
      }
    }
  }
}
</script>
