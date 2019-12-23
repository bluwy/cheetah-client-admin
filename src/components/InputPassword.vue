<template>
  <v-text-field
    v-bind="$props"
    :type="show ? 'text' : 'password'"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    v-on="$listeners"
    @click:append="show = !show"
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
  </v-text-field>
</template>

<script>
import { VTextField } from 'vuetify/lib/components'

export default {
  name: 'InputPassword',
  props: {
    ...VTextField.options.props
  },
  data: () => ({
    show: false
  })
}
</script>

<style>

</style>
