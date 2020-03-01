<template>
  <v-input
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-row no-gutters>
      <v-col
        v-if="label"
        class="subtitle-1"
        cols="12"
      >
        {{ label }}
      </v-col>
      <v-col cols="12">
        <v-row no-gutters>
          <v-col
            v-for="(task, i) in tasks"
            :key="i"
            cols="12"
          >
            <input-task
              :task-type.sync="task.type"
              :task-remarks.sync="task.remarks"
              append-icon="mdi-close"
              @click:append="tasks.splice(i, 1)"
            />
          </v-col>
          <v-col
            key="footer"
            cols="12"
          >
            <v-btn
              small
              right
              color="primary"
              @click.stop="addEmptyTask()"
            >
              <v-icon
                left
                small
              >
                mdi-plus
              </v-icon>
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-input>
</template>

<script>
import InputTask from '@/components/Common/InputTask.vue'

export default {
  name: 'InputListTask',
  components: {
    InputTask
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    tasks: {
      type: Array,
      required: true
    },
    minOneTask: {
      type: Boolean,
      default: true
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
