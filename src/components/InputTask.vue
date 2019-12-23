<template>
  <v-input
    :append-icon="iconType === 'add' ? 'mdi-plus' : 'mdi-close'"
    class="align-center"
    hide-details
    color="primary"
    @click:append="$emit('click:icon', $event)"
  >
    <template
      v-for="(_, slot) in $scopedSlots"
      #[slot]="scope"
    >
      <slot
        v-bind="scope"
        :name="slot"
      />
    </template>
    <v-row align="center">
      <v-col
        class="py-0"
        cols="4"
      >
        <v-select
          :value="taskType"
          :items="taskTypes"
          placeholder="Type"
          @change="$emit('update:taskType', $event)"
        />
      </v-col>
      <v-col
        class="py-0"
        cols="8"
      >
        <v-text-field
          :value="taskRemarks"
          placeholder="Remarks"
          @input="$emit('update:taskRemarks', $event)"
        />
      </v-col>
    </v-row>
  </v-input>
</template>

<script>
export default {
  name: 'InputTask',
  props: {
    iconType: {
      type: String,
      required: true,
      validator: v => v === 'add' || 'remove'
    },
    taskType: {
      type: String,
      default: ''
    },
    taskRemarks: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    taskTypes: [
      { text: 'Service', value: 'SERVICE' },
      { text: 'Complaint', value: 'COMPLAINT' },
      { text: 'Delivery', value: 'DELIVERY' },
      { text: 'Transport', value: 'TRANSPORT' },
      { text: 'Others', value: 'OTHERS' }
    ]
  })
}
</script>

<style>

</style>
