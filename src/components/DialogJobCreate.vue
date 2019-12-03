<template>
  <v-dialog :value="value" persistent width="700">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>Create Job</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col class="py-0" cols=12 md="6">
                <input-customer v-model="job.customerId" :rules="rule.customerId"></input-customer>
              </v-col>
              <v-col class="py-0" cols=12 md="6">
                <input-staff v-model="job.staffIds" multiple :rules="rule.staffIds"></input-staff>
              </v-col>
            </v-row>
            <input-list-task :tasks="job.tasks"></input-list-task>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <dialog-yes-no
            v-model="cancelDialog"
            header="Are you sure?"
            message="You cannot undo this action."
            @yes="cancel(true)"
          >
            <template #activator>
              <v-btn outlined color="error" @click.stop="cancel()">Cancel</v-btn>
            </template>
          </dialog-yes-no>
          <v-btn color="primary" @click="create()">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { storeDeleteQuery } from '@/utils/apollo'
import { required, minArrLength } from '@/utils/inputRules'
import DialogYesNo from './DialogYesNo.vue'
import InputCustomer from './InputCustomer.vue'
import InputStaff from './InputStaff.vue'
import InputListTask from './InputListTask.vue'
import JOB_BATCH_CREATE from '@/graphql/JobBatchCreate.graphql'

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
      return !!(j.customerId || j.staffIds.length || j.tasks.length)
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
    create () {
      if (this.$refs.form.validate()) {
        const cacheJob = { ...this.job }

        this.cancel(true)

        this.$apollo.mutate({
          mutation: JOB_BATCH_CREATE,
          variables: cacheJob,
          update: (store, { data: { createJobBatch } }) => {
            if (createJobBatch.success) {
              storeDeleteQuery(store, /^jobs/)
              console.log(store)
              this.$emit('create')
            } else {
              throw new Error(createJobBatch.message)
            }
          }
        })
          .then((data) => {
            console.log(data)
            this.cancel(true)
          })
          .catch((e) => {
            console.log(e)
            this.job = cacheJob
            this.$emit('input', true)
          })
      }
    }
  }
}
</script>

<style>

</style>
