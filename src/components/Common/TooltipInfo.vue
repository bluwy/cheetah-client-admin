<template>
  <v-tooltip top>
    <template #activator="{ on }">
      <v-icon
        small
        v-on="on"
      >
        mdi-information
      </v-icon>
    </template>
    <slot />
  </v-tooltip>
</template>

<script>
export default {
  name: 'TooltipInfo'
}
</script>
