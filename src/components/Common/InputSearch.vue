<template>
  <v-text-field
    v-bind="$attrs"
    class="input-search"
    :class="{ 'input-search__expand': $attrs.value }"
    prepend-inner-icon="mdi-magnify"
    color="primary"
    label="Search"
    single-line
    hide-details
    dense
    filled
    rounded
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'InputSearch'
}
</script>

<style scoped>
.input-search {
  max-width: 140px;
  transition: max-width .2s;
}

.input-search__expand,
.input-search:focus-within {
  max-width: 400px;
}
</style>
