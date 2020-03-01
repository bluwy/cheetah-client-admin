<template>
  <v-snackbar
    v-model="snackbar"
    :color="currentSnack.color"
    :timeout="currentSnack.timeout"
    bottom
    right
  >
    {{ currentSnack.message }}
    <v-btn
      text
      icon
      @click="snackbar = false"
    >
      <v-icon>$close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import collectInstanceMixin from '@/mixins/collect-instance'

const instances = []

export const pushSnack = ({ message, color, timeout }) => {
  instances.forEach(v => v.pushSnack({ message, color, timeout }))
}

export default {
  name: 'SnackbarGlobal',
  mixins: [collectInstanceMixin(instances)],
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
