<template>
  <v-dialog
    v-bind="$attrs"
    :persistent="isDirty"
    width="600"
    max-width="95vw"
    v-on="$listeners"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="createAssignment()"
    >
      <v-card>
        <v-card-title>Re-assign</v-card-title>
        <v-container>
          <v-card-title class="pt-0">
            <v-skeleton-loader
              :loading="!!loadingCount"
              transition="fade-transition"
              type="heading"
              width="100%"
              height="32px"
            >
              <div>
                {{ customerName }}
              </div>
            </v-skeleton-loader>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <input-staff
                  v-model="formAssignment.staffPrimaryId"
                  :rules="rule.staffPrimaryId"
                  :staffs-filter="v => v.id !== formAssignment.staffSecondaryId"
                  :loading="!!loadingCount"
                  label="Technician 1*"
                  hide-details
                  dense
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <input-staff
                  v-model="formAssignment.staffSecondaryId"
                  :rules="rule.staffSecondaryId"
                  :staffs-filter="v => v.id !== formAssignment.staffPrimaryId"
                  :loading="!!loadingCount"
                  label="Technician 2"
                  hide-details
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-autocomplete
              v-model="formAssignment.address"
              :rules="rule.address"
              :items="customerAddresses"
              :loading="!!loadingCount"
              label="Address*"
            />
            <input-date-time
              v-model="formAssignment.preferTime"
              :date-props="{
                label: 'Start date*',
                rules: rule.preferTime
              }"
              :time-props="{
                label: 'Preferred time*',
                rules: rule.preferTime
              }"
            />
            <input-list-task
              :tasks="formAssignment.tasks"
              label="Tasks"
            />
          </v-card-text>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <dialog-yes-no
            v-model="dialogCancel"
            header="Are you sure?"
            message="Data you have entered are not saved"
            @yes="close(true)"
          />
          <v-btn
            outlined
            color="error"
            @click.stop="close()"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { formatISO } from 'date-fns'
import { cloneDeep, isEqual, get } from 'lodash-es'
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys, transformObj } from '@/utils/common'
import { required, minArrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputDateTime from '@/components/InputDateTime.vue'
import InputListTask from '@/components/InputListTask.vue'
import InputStaff from '@/components/InputStaff.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import ASSIGNMENT_CREATE from '@/graphql/AssignmentCreate.graphql'
import JOB_ASSIGNMENT_CREATE_GET from '@/graphql/JobAssignmentCreateGet.graphql'
import JOB_GET from '@/graphql/JobGet.graphql'

export default {
  name: 'DialogAssignmentCreate',
  apollo: {
    job: {
      query: JOB_ASSIGNMENT_CREATE_GET,
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
    DialogYesNo,
    InputDateTime,
    InputListTask,
    InputStaff
  },
  data: () => ({
    valid: false,
    loadingCount: 0,
    job: {},
    jobId: '',
    formAssignmentFactory: () => ({
      address: '',
      preferTime: '',
      staffPrimaryId: '',
      staffSecondaryId: '',
      tasks: [{ type: '', remarks: '' }]
    }),
    formAssignment: {},
    rule: {
      customerId: [required],
      preferTime: [required],
      staffPrimaryId: [required],
      tasks: [required, minArrLength(1)]
    },
    dialogCancel: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formAssignment, this.formAssignmentFactory())
    },
    customerName () {
      const code = get(this, 'job.customer.code')
      const name = get(this, 'job.customer.name')

      if (code && name) {
        return code + ' - ' + name
      } else {
        return ''
      }
    },
    customerAddresses () {
      let addresses = get(this, 'job.customer.addresses', [])

      // The address may not be in the list since it's also bound by search-input
      // Add it if not in list, otherwise Vuetify will clear it
      if (this.formAssignment.address && !addresses.includes(this.formAssignment.address)) {
        addresses = [...addresses, this.formAssignment.address]
      }

      return addresses
    }
  },
  watch: {
    job (val) {
      const address = get(val, 'customer.addresses[0]', '')
      const staffPrimaryId = get(val, 'customer.staffPrimary.id', '')
      const staffSecondaryId = get(val, 'customer.staffSecondary.id', '')

      this.formAssignmentFactory = () => ({
        address,
        staffPrimaryId,
        staffSecondaryId,
        preferTime: formatISO(new Date()),
        tasks: [{ type: '', remarks: '' }]
      })

      this.reset()
    }
  },
  created () {
    this.reset()
  },
  methods: {
    open (jobId) {
      this.jobId = jobId
      this.$emit('input', true)
    },
    close (force) {
      if (!force && this.isDirty) {
        this.dialogCancel = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.formAssignment = this.formAssignmentFactory()
      this.$refs.form && this.$refs.form.resetValidation()
    },
    parseFormToVars (form) {
      const vars = transformObj(cloneDeep(form), [
        { from: 'staffSecondaryId', to: 'staffSecondaryWhere', value: v => ({ id: v }) }
      ])

      vars.preferTime = new Date(vars.preferTime)

      return vars
    },
    async createAssignment () {
      if (this.$refs.form.validate() && this.isDirty) {
        const { cache, restore } = cacheObjKeys(this, ['jobId', 'formAssignment'])

        this.close(true)

        try {
          await this.$apollo.mutate({
            mutation: ASSIGNMENT_CREATE,
            variables: {
              jobId: cache.jobId,
              ...this.parseFormToVars(cache.formAssignment)
            },
            update: (store, { data: { createAssignment } }) => {
              const data = store.readQuery({
                query: JOB_GET,
                variables: { id: cache.jobId }
              })

              // All existing assignments are expired
              const newAssignments = data.job.assignments.map((assignment) => {
                return {
                  ...assignment,
                  expired: true
                }
              }).concat([createAssignment])

              store.writeQuery({
                query: JOB_GET,
                variables: { id: cache.jobId },
                data: {
                  job: {
                    ...data.job,
                    assignments: newAssignments
                  }
                }
              })
            }
          })

          snackbarPush({ color: 'success', message: 'Assignment created' })
        } catch (e) {
          restore()
          this.open(cache.jobId)

          snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
        }
      }
    }
  }
}
</script>

<style>

</style>
