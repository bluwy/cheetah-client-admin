<template>
  <v-text-field
    v-bind="$attrs"
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
export default {
  name: 'InputPassword',
  data: () => ({
    show: false
  })
}
</script>

<style>

</style>
