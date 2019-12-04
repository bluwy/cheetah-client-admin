<template>
  <v-text-field
    v-bind="$props"
    v-on="$listeners"
    :type="show ? 'text' : 'password'"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="show = !show"
  >
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
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
