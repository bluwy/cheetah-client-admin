<template>
  <v-list>
    <v-list-item key="header">
      <v-list-item-content>
        <v-list-item-title slot="title">
          Tasks
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          icon
          small
          color="primary"
          @click.stop="addEmptyTask()"
        >
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
        :task-remarks.sync="task.remarks"
        icon-type="remove"
        @click:icon="tasks.splice(i, 1)"
      />
    </v-list-item>
  </v-list>
</template>

<script>
import InputTask from '@/components/InputTask.vue'

export default {
  name: 'InputListTask',
  components: {
    InputTask
  },
  props: {
    tasks: {
      type: Array,
      required: true
    },
    minOneTask: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isDirty () {
      // Every task object is not empty
      return this.tasks.length && this.tasks.some(task => Object.values(task).some(v => !!v))
    }
  },
  watch: {
    tasks: {
      handler (val) {
        if (this.minOneTask && this.tasks.length <= 0) {
          this.addEmptyTask()
        }
      },
      immediate: true
    }
  },
  methods: {
    addEmptyTask () {
      this.tasks.push({ type: '', remarks: '' })
    }
  }
}
</script>

<style>

</style>
