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
                <input-customer v-model.number="customer"></input-customer>
              </v-col>
              <v-col class="py-0" cols=12 md="6">
                <input-staff v-model="staffs" multiple></input-staff>
              </v-col>
            </v-row>
            <v-list>
              <v-list-item key="header">
                <v-list-item-content>
                  <v-list-item-title>Tasks</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small @click.stop="tasks.push({ type: '', remarks: '' })">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item
                v-for="(task, i) in tasks"
                :key="i"
              >
                <input-task
                  :task-type.sync="task.type"
                  :task-remarks="task.remarks"
                  icon-type="remove"
                  @click:icon="tasks.splice(i, 1)"
                ></input-task>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <dialog-yes-no
            v-model="cancelDialog"
            header="Are you sure?"
            message="You cannot undo this action."
            @yes="confirmCancel"
          >
            <template #activator>
              <v-btn outlined color="error" @click.stop="cancel">Cancel</v-btn>
            </template>
          </dialog-yes-no>
          <v-btn color="primary" @click="create">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import DialogYesNo from './DialogYesNo.vue'
import InputCustomer from './InputCustomer.vue'
import InputStaff from './InputStaff.vue'
import InputTask from './InputTask.vue'

export default {
  name: 'DialogCreateJob',
  components: {
    DialogYesNo,
    InputCustomer,
    InputStaff,
    InputTask
  },
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    valid: false,
    customer: null,
    staffs: [],
    tasks: [],
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      return !!(this.customer || this.staffs.length || this.tasks.length)
    }
  },
  methods: {
    cancel () {
      if (this.isDirty) {
        this.cancelDialog = true
      } else {
        this.confirmCancel()
      }
    },
    confirmCancel () {
      this.customer = null
      this.staffs = []
      this.tasks = []

      this.$emit('input', false)
    },
    create () {
      if (this.$refs.form.validate()) {
        // Create job
      }
    }
  }
}
</script>

<style>

</style>
