<template>
  <v-row>
    <v-col cols="8">
      <v-menu
        :close-on-content-click="false"
        :return-value="date"
        min-width="290px"
      >
        <template #activator="{ on }">
          <v-text-field
            v-bind="dateProps"
            :value="formatDate"
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker
          :value="date"
          no-title
          scrollable
          @input="setDate"
        />
      </v-menu>
    </v-col>
    <v-col cols="4">
      <v-menu
        :close-on-content-click="false"
        :return-value="time"
      >
        <template #activator="{ on }">
          <v-text-field
            v-bind="timeProps"
            :value="time"
            readonly
            v-on="on"
          />
        </template>
        <v-time-picker
          :value="time"
          format="24hr"
          @input="setTime"
        />
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'InputDateTime',
  props: {
    value: {
      type: String,
      required: true
    },
    dateProps: {
      type: Object,
      default: () => ({})
    },
    timeProps: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    formatDate () {
      return format(new Date(this.date), 'd MMM yyyy (EEEE)')
    },
    date () {
      const match = this.value.match(/\d\d\d\d-\d\d-\d\d/)
      return match && match.length ? match[0] : ''
    },
    time () {
      const match = this.value.match(/\d\d:\d\d/)
      return match && match.length ? match[0] : ''
    }
  },
  methods: {
    setDate (date) {
      this.$emit('input', `${date}T${this.time}Z`)
    },
    setTime (time) {
      this.$emit('input', `${this.date}T${time}Z`)
    }
  }
}
</script>

<style>

</style>
