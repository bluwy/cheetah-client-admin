<template>
  <v-snackbar
    v-model="snackbar"
    :color="currentSnack.color"
    :timeout="currentSnack.timeout"
    bottom
    right
  >
    {{ currentSnack.message }}
    <v-btn text icon @click="snackbar = false">
      <v-icon>$close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import Vue from 'vue'

export const snackbarBus = new Vue()

export const snackbarPush = ({ message, color, timeout }) => {
  snackbarBus.$emit('push', { message, color, timeout })
}

export default {
  name: 'SnackbarGlobal',
  props: {
    transitionDuration: {
      type: Number,
      default: 200
    }
  },
  data: () => ({
    snackbar: false,
    snackStack: []
  }),
  computed: {
    currentSnack () {
      return this.snackStack[0] || {}
    }
  },
  watch: {
    snackbar (val) {
      if (!val && this.snackStack.length) {
        // Wait out animation before showing next snack
        setTimeout(() => {
          this.snackStack.shift()

          if (this.snackStack.length) {
            this.snackbar = true
          }
        }, this.transitionDuration)
      }
    }
  },
  mounted () {
    snackbarBus.$on('push', this.pushSnack)
  },
  methods: {
    pushSnack ({ message, color = 'info', timeout = 6000 }) {
      this.snackStack.push({ message, color, timeout })

      if (this.snackStack.length === 1) {
        this.snackbar = true
      }
    }
  }
}
</script>

<style>

</style>
