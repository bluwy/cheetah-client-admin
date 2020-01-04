<template>
  <v-input
    v-bind="$attrs"
    color="primary"
    hide-details
    v-on="$listeners"
  >
    <v-row>
      <v-col
        class="pt-0"
        cols="4"
      >
        <v-select
          :value="taskType"
          :items="taskTypes"
          :rules="rule.taskType"
          placeholder="Type"
          hide-details
          dense
          @change="$emit('update:taskType', $event)"
        />
      </v-col>
      <v-col
        class="pt-0"
        cols="8"
      >
        <v-text-field
          :value="taskRemarks"
          placeholder="Remarks"
          hide-details
          dense
          @input="$emit('update:taskRemarks', $event)"
        />
      </v-col>
    </v-row>
  </v-input>
</template>

<script>
import { required } from '@/utils/inputRules'

export default {
  name: 'InputTask',
  props: {
    taskType: {
      type: String,
      required: true
    },
    taskRemarks: {
      type: String,
      required: true
    }
  },
  data: () => ({
    rule: {
      taskType: [required]
    },
    taskTypes: [
      { text: 'FOLLOW-UP SERVICE', value: 'SERVICE' },
      { text: 'COMPLAINT', value: 'COMPLAINT' },
      { text: 'DELIVERY', value: 'DELIVERY' },
      { text: 'TRANSPORT', value: 'TRANSPORT' },
      { text: 'OTHERS', value: 'OTHERS' }
    ]
  })
}
</script>

<style>

</style>
