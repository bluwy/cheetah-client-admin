<template>
  <v-dialog
    v-bind="$attrs"
    persistent
    width="700"
    max-width="95vw"
    v-on="$listeners"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="createJob()"
    >
      <v-card>
        <v-card-title>Create Job</v-card-title>
        <v-card-text>
          <v-container fluid>
            <input-customer
              v-model="formJob.customerId"
              :rules="rule.customerId"
              label="Customer"
              dense
              clearable
            />
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <input-staff
                  v-model="formJob.staffPrimaryId"
                  :rules="rule.staffPrimaryId"
                  :staffs-filter="v => v.id !== formJob.staffSecondaryId"
                  label="Handled by"
                  dense
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <input-staff
                  v-model="formJob.staffSecondaryId"
                  :rules="rule.staffSecondaryId"
                  :staffs-filter="v => v.id !== formJob.staffPrimaryId"
                  label="Assisted by"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-autocomplete
              v-model="formJob.address"
              :search-input.sync="formJob.address"
              :rules="rule.address"
              :items="customerAddresses"
              class="mb-3"
              label="Address"
              hide-selected
              hide-no-data
            />
            <input-date-time
              v-model="formJob.preferTime"
              :date-props="{
                label: 'Start date',
                rules: rule.preferTime
              }"
              :time-props="{
                label: 'Preferred time',
                rules: rule.preferTime
              }"
            />
            <input-list-task
              :tasks="formJob.tasks"
              label="Tasks"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <dialog-yes-no
            v-model="cancelDialog"
            header="Are you sure?"
            message="You cannot undo this action."
            @yes="cancel(true)"
          />
          <v-btn
            outlined
            color="error"
            @click.stop="cancel()"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { formatISO } from 'date-fns'
import { cloneDeep, isEqual } from 'lodash-es'
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { cacheObjKeys, transformObj } from '@/utils/common'
import { required, minArrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputCustomer from '@/components/InputCustomer.vue'
import InputDateTime from '@/components/InputDateTime.vue'
import InputStaff from '@/components/InputStaff.vue'
import InputListTask from '@/components/InputListTask.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import CUSTOMER_JOB_CREATE_GET from '@/graphql/CustomerJobCreateGet.graphql'
import JOB_CREATE from '@/graphql/JobCreate.graphql'

const formJobFactory = () => ({
  customerId: '',
  address: '',
  preferTime: formatISO(new Date()),
  staffPrimaryId: '',
  staffSecondaryId: '',
  tasks: [{ type: '', remarks: '' }]
})

export default {
  name: 'DialogJobCreate',
  apollo: {
    customer: {
      query: CUSTOMER_JOB_CREATE_GET,
      variables () {
        return {
          id: this.formJob.customerId
        }
      },
      skip () {
        return !(this.formJob && this.formJob.customerId)
      }
    }
  },
  components: {
    DialogYesNo,
    InputCustomer,
    InputDateTime,
    InputStaff,
    InputListTask
  },
  data: () => ({
    valid: false,
    customer: {},
    formJob: formJobFactory(),
    rule: {
      customerId: [required],
      preferTime: [required],
      staffPrimaryId: [required],
      address: [required],
      tasks: [required, minArrLength(1)]
    },
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formJob, formJobFactory())
    },
    customerAddresses () {
      let addresses = (this.customer && this.customer.addresses) || []

      // The address may not be in the list since it's also bound by search-input
      // Add it if not in list, otherwise Vuetify will clear it
      if (this.formJob.address && !addresses.includes(this.formJob.address)) {
        addresses = [...addresses, this.formJob.address]
      }

      return addresses
    }
  },
  watch: {
    customer (val) {
      if (val) {
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
    }
  },
  methods: {
    cancel (force) {
      if (!force && this.isDirty) {
        this.cancelDialog = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.formJob = formJobFactory()
      this.$refs.form && this.$refs.form.resetValidation()
    },
    parseFormToVars (form) {
      const vars = transformObj(cloneDeep(form), [
        { from: 'staffSecondaryId', to: 'staffSecondaryWhere', value: v => ({ id: v }) }
      ])

      vars.preferTime = new Date(vars.preferTime)

      return vars
    },
    async createJob () {
      if (this.$refs.form.validate() && this.isDirty) {
        const { cache, restore } = cacheObjKeys(this, ['formJob'])

        this.cancel(true)

        try {
          await this.$apollo.mutate({
            mutation: JOB_CREATE,
            variables: this.parseFormToVars(cache.formJob),
            update: (store, { data: { createJob } }) => {
              if (createJob != null) {
                storeDeleteQuery(store, /^jobs/)
                console.log(store)
                this.$emit('create-job')
              } else {
                throw new Error('Unable to create formJob')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Job created' })
        } catch (e) {
          restore()
          this.$emit('input', true)

          snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
        }
      }
    }
  }
}
</script>

<style>

</style>
