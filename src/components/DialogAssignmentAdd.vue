<template>
  <v-dialog :value="value" persistent width="600" max-width="95vw">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>Add Assignment</v-card-title>
        <v-card-text>
          <v-container fluid>
            <input-staff v-model="assignment.staffIds" multiple :rules="rule.staffIds"></input-staff>
            <input-list-task ref="tasksInput" :tasks="assignment.tasks"></input-list-task>
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
          <v-btn color="primary" @click="add()">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { cloneDeep } from 'lodash-es'
import { getErrorMessages } from '@/utils/apollo'
import { required, minArrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputListTask from '@/components/InputListTask.vue'
import InputStaff from '@/components/InputStaff.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import ASSIGNMENT_BATCH_ADD from '@/graphql/AssignmentBatchAdd.graphql'
import JOB_GET from '@/graphql/JobGet.graphql'

const formAssignmentFactory = () => ({
  staffIds: [],
  tasks: []
})

export default {
  name: 'DialogAssignmentAdd',
  components: {
    DialogYesNo,
    InputListTask,
    InputStaff
  },
  props: {
    value: {
      type: Boolean
    },
    jobId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    valid: false,
    assignment: formAssignmentFactory(),
    rule: {
      staffIds: [required, minArrLength(1)],
      tasks: [required, minArrLength(1)]
    },
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      return !!(this.assignment.staffIds.length || this.$refs.tasksInput.isDirty)
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
      this.assignment = formAssignmentFactory()
    },
    async add () {
      if (this.$refs.form.validate() && this.isDirty) {
        const cacheAssignment = cloneDeep(this.assignment)

        this.cancel(true)

        try {
          const { data: { addAssignmentBatch } } = await this.$apollo.mutate({
            mutation: ASSIGNMENT_BATCH_ADD,
            variables: {
              jobId: this.jobId,
              staffIds: cacheAssignment.staffIds,
              tasks: cacheAssignment.tasks
            },
            update: (store, { data: { addAssignmentBatch } }) => {
              if (addAssignmentBatch.success) {
                const data = store.readQuery({
                  query: JOB_GET,
                  variables: {
                    id: this.jobId
                  }
                })

                if (data.job) {
                  data.job.assignments.push(addAssignmentBatch.assignment)

                  store.writeQuery({
                    query: JOB_GET,
                    variables: {
                      id: this.jobId
                    },
                    data
                  })
                }
              } else {
                throw new Error(addAssignmentBatch.message)
              }
            }
          })

          snackbarPush({ color: 'success', message: addAssignmentBatch.message })
        } catch (e) {
          this.assignment = cacheAssignment
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
