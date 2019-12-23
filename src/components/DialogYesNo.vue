<template>
  <v-dialog
    :value="value"
    width="300"
    max-width="95vw"
    @click:outside="no"
    @keydown.esc="no"
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
    <v-card>
      <v-card-title v-if="header || $slots.header">
        <slot name="header">
          {{ header }}
        </slot>
      </v-card-title>
      <v-card-text v-if="message || $slots.message">
        <slot name="message">
          {{ message }}
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="no"
        >
          {{ noText }}
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="yes"
        >
          {{ yesText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogYesNo',
  props: {
    value: {
      type: Boolean
    },
    header: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    yesText: {
      type: String,
      default: 'Yes'
    },
    noText: {
      type: String,
      default: 'No'
    }
  },
  methods: {
    yes (evt) {
      this.$emit('input', false)
      this.$emit('yes')
    },
    no (evt) {
      this.$emit('input', false)
      this.$emit('no')
    }
  }
}
</script>

<style>

</style>
