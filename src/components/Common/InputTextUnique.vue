<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    :error-messages="errorMessages"
    v-on="$listeners"
  >
    <template #appendIcon>
      <template v-show="value">
        <v-progress-circular
          v-show="isLoading"
          :indeterminate="isLoading"
        />
        <v-icon
          v-show="!isLoading && isUnique"
          small
          color="success"
        >
          mdi-check
        </v-icon>
        <v-icon
          v-show="!isLoading && !isUnique"
          small
          color="error"
        >
          mdi-close
        </v-icon>
      </template>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'InputTextUnique',
  apollo: {
    queryCount: {
      query () {
        return this.apolloQuery
      },
      variables () {
        return this.apolloVariables(this.value)
      },
      update () {
        return this.apolloUpdate
      },
      skip () {
        return !!this.value
      },
      debounce: 300,
      loadingKey: 'loadingCount'
    }
  },
  props: {
    value: {
      type: String,
      required: true
    },
    apolloQuery: {
      type: Function,
      required: true
    },
    apolloVariables: {
      type: Function,
      required: true
    },
    apolloUpdate: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    loadingCount: 0,
    queryCount: 0
  }),
  computed: {
    isLoading () {
      return !!this.loadingCount
    },
    isUnique () {
      return this.queryCount <= 0
    },
    errorMessages () {
      return (this.value && !this.isUnique) ? [`"${this.value}" is already taken`] : []
    }
  }
}
</script>
