<template>
  <v-dialog
    :value="value"
    persistent
    width="700"
    max-width="95vw"
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
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-card>
        <v-card-title>Create Job</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col
                class="py-0"
                cols="12"
                md="6"
              >
                <input-customer
                  v-model="job.customerId"
                  :rules="rule.customerId"
                />
              </v-col>
              <v-col
                class="py-0"
                cols="12"
                md="6"
              >
                <input-staff
                  v-model="job.staffIds"
                  multiple
                  :rules="rule.staffIds"
                />
              </v-col>
            </v-row>
            <input-list-task
              ref="tasksInput"
              :tasks="job.tasks"
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
          >
            <template #activator>
              <v-btn
                outlined
                color="error"
                @click.stop="cancel()"
              >
                Cancel
              </v-btn>
            </template>
          </dialog-yes-no>
          <v-btn
            color="primary"
            @click="createJob()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { cloneDeep } from 'lodash-es'
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { required, minArrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputCustomer from '@/components/InputCustomer.vue'
import InputStaff from '@/components/InputStaff.vue'
import InputListTask from '@/components/InputListTask.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import JOB_CREATE from '@/graphql/JobCreate.graphql'

const formJobFactory = () => ({
  customerId: null,
  staffIds: [],
  tasks: []
})

export default {
  name: 'DialogJobCreate',
  components: {
    DialogYesNo,
    InputCustomer,
    InputStaff,
    InputListTask
  },
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    valid: false,
    job: formJobFactory(),
    rule: {
      customerId: [required],
      staffIds: [required, minArrLength(1)],
      tasks: [required, minArrLength(1)]
    },
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      const j = this.job
      return !!(j.customerId || j.staffIds.length || this.$refs.tasksInput.isDirty)
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
      this.$refs.form.reset()
      this.job = formJobFactory()
    },
    async createJob () {
      if (this.$refs.form.validate() && this.isDirty) {
        const cacheJob = cloneDeep(this.job)

        this.cancel(true)

        try {
          await this.$apollo.mutate({
            mutation: JOB_CREATE,
            variables: cacheJob,
            update: (store, { data: { createJob } }) => {
              if (createJob != null) {
                storeDeleteQuery(store, /^jobs/)
                console.log(store)
                this.$emit('createJob')
              } else {
                throw new Error('Unable to create job')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Job created' })
        } catch (e) {
          this.job = cacheJob
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
