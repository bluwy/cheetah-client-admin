<template>
  <v-list>
    <v-list-item key="header">
      <v-list-item-content>
        <v-list-item-title slot="title">Tasks</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon small color="primary" @click.stop="tasks.push({ type: '', remarks: '' })">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-list-item v-for="(task, i) in tasks" :key="i">
      <input-task
        :task-type.sync="task.type"
        :task-remarks.sync="task.remarks"
        icon-type="remove"
        @click:icon="tasks.splice(i, 1)"
      ></input-task>
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
    }
  }
}
</script>

<style>

</style>
